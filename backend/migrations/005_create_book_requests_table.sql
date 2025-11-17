-- =====================================================
-- Migration: Create Book Requests Table
-- Description: Patron self-service book requests/reservations
-- Version: 005
-- Date: 2025-11-17
-- Author: NAWRA Development Team
-- =====================================================

-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Book Requests Table
-- =====================================================
CREATE TABLE IF NOT EXISTS book_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,

    -- Request Details
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'reserved', 'fulfilled', 'cancelled')
    ),
    request_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Additional Information
    notes TEXT,
    cancelled_date TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT check_notes_length CHECK (LENGTH(notes) <= 500),
    CONSTRAINT check_expiry_date CHECK (expiry_date > request_date),
    CONSTRAINT check_cancelled_date CHECK (
        (status = 'cancelled' AND cancelled_date IS NOT NULL) OR
        (status != 'cancelled' AND cancelled_date IS NULL)
    )
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_book_requests_user_id ON book_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_book_requests_book_id ON book_requests(book_id);

-- Status and date indexes
CREATE INDEX IF NOT EXISTS idx_book_requests_status ON book_requests(status);
CREATE INDEX IF NOT EXISTS idx_book_requests_request_date ON book_requests(request_date DESC);
CREATE INDEX IF NOT EXISTS idx_book_requests_expiry_date ON book_requests(expiry_date)
    WHERE status IN ('pending', 'reserved');

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_book_requests_user_status ON book_requests(user_id, status);
CREATE INDEX IF NOT EXISTS idx_book_requests_book_status ON book_requests(book_id, status);
CREATE INDEX IF NOT EXISTS idx_book_requests_active ON book_requests(user_id, book_id)
    WHERE status IN ('pending', 'reserved');

-- =====================================================
-- Triggers
-- =====================================================

-- Function to update updated_at timestamp (reuse existing function or create)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for book_requests
DROP TRIGGER IF EXISTS update_book_requests_updated_at ON book_requests;
CREATE TRIGGER update_book_requests_updated_at
    BEFORE UPDATE ON book_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to expire old book requests
CREATE OR REPLACE FUNCTION expire_old_book_requests()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE book_requests
    SET status = 'cancelled',
        cancelled_date = NOW(),
        updated_at = NOW()
    WHERE status = 'reserved'
    AND expiry_date < NOW();

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check for duplicate active requests
CREATE OR REPLACE FUNCTION has_active_book_request(p_user_id UUID, p_book_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    request_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO request_count
    FROM book_requests
    WHERE user_id = p_user_id
    AND book_id = p_book_id
    AND status IN ('pending', 'reserved');

    RETURN request_count > 0;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on book_requests table
ALTER TABLE book_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own book requests" ON book_requests;
DROP POLICY IF EXISTS "Users can create own book requests" ON book_requests;
DROP POLICY IF EXISTS "Users can update own book requests" ON book_requests;
DROP POLICY IF EXISTS "Users can delete own book requests" ON book_requests;
DROP POLICY IF EXISTS "Staff can view all book requests" ON book_requests;
DROP POLICY IF EXISTS "Staff can manage all book requests" ON book_requests;

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own book requests" ON book_requests
    FOR SELECT
    USING (user_id = auth.uid()::uuid);

-- Policy: Users can insert their own requests
CREATE POLICY "Users can create own book requests" ON book_requests
    FOR INSERT
    WITH CHECK (user_id = auth.uid()::uuid);

-- Policy: Users can update their own requests (for cancellation)
CREATE POLICY "Users can update own book requests" ON book_requests
    FOR UPDATE
    USING (user_id = auth.uid()::uuid)
    WITH CHECK (user_id = auth.uid()::uuid);

-- Policy: Users can delete their own requests
CREATE POLICY "Users can delete own book requests" ON book_requests
    FOR DELETE
    USING (user_id = auth.uid()::uuid);

-- Policy: Staff with requests.manage permission can view all
CREATE POLICY "Staff can view all book requests" ON book_requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid()::uuid
            AND r.permissions ? 'requests.manage'
        )
    );

-- Policy: Staff can manage all requests
CREATE POLICY "Staff can manage all book requests" ON book_requests
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid()::uuid
            AND r.permissions ? 'requests.manage'
        )
    );

-- =====================================================
-- Comments for Documentation
-- =====================================================

COMMENT ON TABLE book_requests IS 'Patron self-service book requests and reservations';
COMMENT ON COLUMN book_requests.id IS 'Unique identifier for the request';
COMMENT ON COLUMN book_requests.user_id IS 'The patron who made the request';
COMMENT ON COLUMN book_requests.book_id IS 'The book being requested';
COMMENT ON COLUMN book_requests.status IS 'pending: waiting for book, reserved: book held for patron, fulfilled: book checked out, cancelled: request cancelled';
COMMENT ON COLUMN book_requests.request_date IS 'When the patron requested the book';
COMMENT ON COLUMN book_requests.expiry_date IS 'When the reservation expires (typically 7 days from reserve)';
COMMENT ON COLUMN book_requests.notes IS 'Optional notes from patron (max 500 characters)';
COMMENT ON COLUMN book_requests.cancelled_date IS 'When the request was cancelled (if status is cancelled)';
COMMENT ON COLUMN book_requests.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN book_requests.updated_at IS 'Record last update timestamp';

-- =====================================================
-- Grant Permissions
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON book_requests TO authenticated;

-- Grant access to service role
GRANT ALL ON book_requests TO service_role;

-- =====================================================
-- Verification Queries (Run after migration)
-- =====================================================

-- Uncomment to verify after running migration:

-- 1. Check table exists
-- SELECT table_name,
--        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'book_requests') as column_count
-- FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name = 'book_requests';

-- 2. Check columns
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'book_requests'
-- ORDER BY ordinal_position;

-- 3. Check indexes
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'book_requests'
-- ORDER BY indexname;

-- 4. Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename = 'book_requests'
-- ORDER BY policyname;

-- 5. Check constraints
-- SELECT constraint_name, constraint_type
-- FROM information_schema.table_constraints
-- WHERE table_name = 'book_requests'
-- ORDER BY constraint_name;

-- 6. Test functions
-- SELECT expire_old_book_requests();
-- SELECT has_active_book_request('some-user-uuid'::uuid, 'some-book-uuid'::uuid);

-- =====================================================
-- Rollback Script (if needed)
-- =====================================================

-- To rollback this migration, run:
-- DROP TABLE IF EXISTS book_requests CASCADE;
-- DROP FUNCTION IF EXISTS expire_old_book_requests();
-- DROP FUNCTION IF EXISTS has_active_book_request(UUID, UUID);
-- -- Note: Keep update_updated_at_column() as it's used by other tables

-- =====================================================
-- Migration Complete!
-- =====================================================
-- Table created: book_requests
-- Columns: 10 (id, user_id, book_id, status, request_date, expiry_date, notes, cancelled_date, created_at, updated_at)
-- Indexes: 7 performance indexes
-- Functions: 2 helper functions (expire_old_book_requests, has_active_book_request)
-- RLS Policies: 6 policies for patron and staff access control
-- Constraints: 3 check constraints + foreign keys
-- =====================================================
