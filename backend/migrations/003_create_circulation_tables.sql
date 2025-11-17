-- =====================================================
-- Migration: Create Circulation Tables
-- Description: Tables for managing book circulation, fines, and reservations
-- =====================================================

-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Circulation Records Table
-- =====================================================
CREATE TABLE IF NOT EXISTS circulation_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,

    -- Circulation Dates
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,

    -- Book Condition
    book_condition VARCHAR(20) CHECK (book_condition IN ('good', 'fair', 'damaged')),

    -- Fines
    fine_amount DECIMAL(10, 3) DEFAULT 0.000,
    fine_paid BOOLEAN DEFAULT FALSE,

    -- Additional Information
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT check_dates CHECK (due_date >= issue_date),
    CONSTRAINT check_return_date CHECK (return_date IS NULL OR return_date >= issue_date),
    CONSTRAINT check_fine_amount CHECK (fine_amount >= 0)
);

-- =====================================================
-- Indexes for Circulation Records
-- =====================================================

-- Foreign key indexes
CREATE INDEX idx_circulation_user_id ON circulation_records(user_id);
CREATE INDEX idx_circulation_book_id ON circulation_records(book_id);

-- Date indexes for queries
CREATE INDEX idx_circulation_issue_date ON circulation_records(issue_date DESC);
CREATE INDEX idx_circulation_due_date ON circulation_records(due_date);
CREATE INDEX idx_circulation_return_date ON circulation_records(return_date) WHERE return_date IS NOT NULL;

-- Status queries
CREATE INDEX idx_circulation_unreturned ON circulation_records(user_id, due_date) WHERE return_date IS NULL;
-- Note: Removed CURRENT_DATE from index predicate as it's not IMMUTABLE
-- The index will still be useful for overdue queries by filtering on return_date IS NULL
CREATE INDEX idx_circulation_overdue ON circulation_records(due_date) WHERE return_date IS NULL;

-- Fine indexes
CREATE INDEX idx_circulation_unpaid_fines ON circulation_records(user_id, fine_amount) WHERE fine_paid = FALSE AND fine_amount > 0;
CREATE INDEX idx_circulation_fine_paid ON circulation_records(fine_paid);

-- Composite indexes for common queries
CREATE INDEX idx_circulation_user_status ON circulation_records(user_id, return_date, due_date);
CREATE INDEX idx_circulation_book_status ON circulation_records(book_id, return_date);

-- =====================================================
-- Reservations Table
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,

    -- Reservation Details
    reservation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (
        status IN ('active', 'fulfilled', 'cancelled', 'expired')
    ),

    -- Notifications
    notified BOOLEAN DEFAULT FALSE,
    notification_date TIMESTAMP WITH TIME ZONE,

    -- Additional Information
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT check_expiry_date CHECK (expiry_date >= reservation_date)
);

-- =====================================================
-- Indexes for Reservations
-- =====================================================

-- Foreign key indexes
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_book_id ON reservations(book_id);

-- Status and date indexes
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_active ON reservations(book_id, reservation_date) WHERE status = 'active';
CREATE INDEX idx_reservations_expiry ON reservations(expiry_date) WHERE status = 'active';

-- Composite indexes
CREATE INDEX idx_reservations_user_status ON reservations(user_id, status);
CREATE INDEX idx_reservations_book_status ON reservations(book_id, status);

-- =====================================================
-- Triggers for Updated At
-- =====================================================

-- Trigger for circulation_records
DROP TRIGGER IF EXISTS update_circulation_records_updated_at ON circulation_records;
CREATE TRIGGER update_circulation_records_updated_at
    BEFORE UPDATE ON circulation_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for reservations
DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Functions for Business Logic
-- =====================================================

-- Function to calculate overdue days
-- Note: STABLE (not IMMUTABLE) because it uses CURRENT_DATE when p_return_date is NULL
CREATE OR REPLACE FUNCTION calculate_overdue_days(p_due_date DATE, p_return_date DATE)
RETURNS INTEGER AS $$
BEGIN
    IF p_return_date IS NULL THEN
        -- Book not yet returned, calculate based on current date
        RETURN GREATEST(0, CURRENT_DATE - p_due_date);
    ELSE
        -- Book returned, calculate based on return date
        RETURN GREATEST(0, p_return_date - p_due_date);
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to calculate fine amount
-- Note: STABLE (not IMMUTABLE) because it calls calculate_overdue_days which uses CURRENT_DATE
CREATE OR REPLACE FUNCTION calculate_fine_amount(p_due_date DATE, p_return_date DATE)
RETURNS DECIMAL(10, 3) AS $$
DECLARE
    overdue_days INTEGER;
    fine_per_day DECIMAL(10, 3) := 0.500; -- OMR 0.500 per day
    max_fine DECIMAL(10, 3) := 50.000;    -- Maximum OMR 50.000
    calculated_fine DECIMAL(10, 3);
BEGIN
    overdue_days := calculate_overdue_days(p_due_date, p_return_date);

    IF overdue_days <= 0 THEN
        RETURN 0.000;
    END IF;

    calculated_fine := overdue_days * fine_per_day;

    -- Cap at maximum fine
    RETURN LEAST(calculated_fine, max_fine);
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get user's total unpaid fines
CREATE OR REPLACE FUNCTION get_user_unpaid_fines(p_user_id UUID)
RETURNS DECIMAL(10, 3) AS $$
DECLARE
    total_fines DECIMAL(10, 3);
BEGIN
    SELECT COALESCE(SUM(fine_amount), 0.000)
    INTO total_fines
    FROM circulation_records
    WHERE user_id = p_user_id
    AND fine_paid = FALSE
    AND fine_amount > 0;

    RETURN total_fines;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to check if user has overdue books
CREATE OR REPLACE FUNCTION user_has_overdue_books(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    overdue_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO overdue_count
    FROM circulation_records
    WHERE user_id = p_user_id
    AND return_date IS NULL
    AND due_date < CURRENT_DATE;

    RETURN overdue_count > 0;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to expire old reservations
CREATE OR REPLACE FUNCTION expire_old_reservations()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE reservations
    SET status = 'expired',
        updated_at = NOW()
    WHERE status = 'active'
    AND expiry_date < CURRENT_DATE;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Views for Common Queries
-- =====================================================

-- View: Active Loans (unreturned books)
CREATE OR REPLACE VIEW active_loans AS
SELECT
    cr.id,
    cr.user_id,
    u.full_name AS user_name,
    u.email AS user_email,
    cr.book_id,
    b.title AS book_title,
    b.author AS book_author,
    b.isbn,
    cr.issue_date,
    cr.due_date,
    CURRENT_DATE - cr.due_date AS days_overdue,
    calculate_fine_amount(cr.due_date, NULL) AS current_fine,
    cr.fine_amount,
    cr.fine_paid,
    CASE
        WHEN cr.due_date < CURRENT_DATE THEN 'overdue'
        WHEN cr.due_date = CURRENT_DATE THEN 'due_today'
        ELSE 'active'
    END AS status
FROM circulation_records cr
JOIN users u ON cr.user_id = u.id
JOIN books b ON cr.book_id = b.id
WHERE cr.return_date IS NULL;

-- View: Overdue Loans
CREATE OR REPLACE VIEW overdue_loans AS
SELECT *
FROM active_loans
WHERE status = 'overdue';

-- View: User Fines Summary
CREATE OR REPLACE VIEW user_fines_summary AS
SELECT
    u.id AS user_id,
    u.full_name,
    u.email,
    COUNT(cr.id) AS total_loans,
    COUNT(cr.id) FILTER (WHERE cr.return_date IS NULL) AS active_loans,
    COUNT(cr.id) FILTER (WHERE cr.return_date IS NULL AND cr.due_date < CURRENT_DATE) AS overdue_loans,
    COALESCE(SUM(cr.fine_amount) FILTER (WHERE cr.fine_paid = FALSE), 0.000) AS unpaid_fines,
    COALESCE(SUM(cr.fine_amount) FILTER (WHERE cr.fine_paid = TRUE), 0.000) AS paid_fines,
    COALESCE(SUM(cr.fine_amount), 0.000) AS total_fines
FROM users u
LEFT JOIN circulation_records cr ON u.id = cr.user_id
WHERE u.user_type = 'patron'
GROUP BY u.id, u.full_name, u.email;

-- =====================================================
-- Comments for Documentation
-- =====================================================

COMMENT ON TABLE circulation_records IS 'Records of book checkouts, returns, and associated fines';
COMMENT ON TABLE reservations IS 'Book reservations/holds placed by patrons';

COMMENT ON COLUMN circulation_records.issue_date IS 'Date when book was checked out';
COMMENT ON COLUMN circulation_records.due_date IS 'Date when book should be returned';
COMMENT ON COLUMN circulation_records.return_date IS 'Actual date when book was returned (NULL if not yet returned)';
COMMENT ON COLUMN circulation_records.fine_amount IS 'Fine amount in OMR for overdue return';
COMMENT ON COLUMN circulation_records.fine_paid IS 'Whether the fine has been paid';

COMMENT ON COLUMN reservations.status IS 'active: waiting for book, fulfilled: book issued, cancelled: user cancelled, expired: reservation expired';

-- =====================================================
-- Grant Permissions (if using RLS)
-- =====================================================

-- If you're using Row Level Security, uncomment and configure:
-- ALTER TABLE circulation_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Run these to verify the migration succeeded:

-- Check tables exist
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('circulation_records', 'reservations');

-- Check indexes
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename IN ('circulation_records', 'reservations');

-- Check functions
-- SELECT routine_name, routine_type
-- FROM information_schema.routines
-- WHERE routine_schema = 'public'
-- AND routine_name LIKE '%circulation%' OR routine_name LIKE '%reservation%' OR routine_name LIKE '%fine%';

-- Check views
-- SELECT table_name
-- FROM information_schema.views
-- WHERE table_schema = 'public';

-- =====================================================
-- Migration Complete!
-- =====================================================
-- Tables created: circulation_records, reservations
-- Functions created: calculate_overdue_days, calculate_fine_amount, get_user_unpaid_fines, user_has_overdue_books, expire_old_reservations
-- Views created: active_loans, overdue_loans, user_fines_summary
-- =====================================================
