-- =====================================================
-- Reset Test Users with Standard Credentials
-- =====================================================
-- Purpose: Create/reset all 5 test users with uniform credentials
-- Password: Nawra2025! (for all users)
-- Domain: @nawra.om
--
-- Usage:
--   1. Open Supabase SQL Editor
--   2. Copy and paste this entire script
--   3. Click "Run" or press Ctrl+Enter
--
-- This script will:
--   - Delete existing test users (if they exist)
--   - Recreate all 5 test users
--   - Assign proper roles and permissions
--   - Set uniform password: Nawra2025!
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. Delete Existing Test Users
-- =====================================================

-- Delete test users (safe to run even if they don't exist)
DELETE FROM users WHERE email IN (
    'admin@nawra.om',
    'librarian@nawra.om',
    'circulation@nawra.om',
    'cataloger@nawra.om',
    'patron@nawra.om',
    -- Also delete old test users
    'admin@ministry.om',
    'librarian@ministry.om',
    'circulation@ministry.om',
    'cataloger@ministry.om',
    'patron@ministry.om'
);

-- =====================================================
-- 2. Get Role IDs (these should already exist)
-- =====================================================

-- Store role IDs in variables for easy reference
DO $$
DECLARE
    admin_role_id UUID;
    librarian_role_id UUID;
    circulation_role_id UUID;
    cataloger_role_id UUID;
    patron_role_id UUID;

    -- Password hash for: Nawra2025!
    -- Generated with bcrypt, 12 rounds
    -- Verified working hash generated: 2025-11-17
    password_hash VARCHAR(255) := '$2b$12$EbbtqvPm/ziEEcDj8KrQf..xr/F/gbaLjAY0Q2mArHYaWwNQF35ma';
BEGIN
    -- Get role IDs from roles table
    SELECT id INTO admin_role_id FROM roles WHERE name = 'Administrator';
    SELECT id INTO librarian_role_id FROM roles WHERE name = 'Librarian';
    SELECT id INTO circulation_role_id FROM roles WHERE name = 'Circulation Staff';
    SELECT id INTO cataloger_role_id FROM roles WHERE name = 'Cataloger';
    SELECT id INTO patron_role_id FROM roles WHERE name = 'Patron';

    -- Verify all roles exist
    IF admin_role_id IS NULL OR librarian_role_id IS NULL OR
       circulation_role_id IS NULL OR cataloger_role_id IS NULL OR
       patron_role_id IS NULL THEN
        RAISE EXCEPTION 'One or more roles not found. Please ensure roles table is populated.';
    END IF;

    -- =====================================================
    -- 3. Create Test Users
    -- =====================================================

    -- Administrator
    INSERT INTO users (
        id,
        email,
        password_hash,
        full_name,
        role_id,
        user_type,
        is_active,
        email_verified,
        created_at,
        updated_at
    ) VALUES (
        uuid_generate_v4(),
        'admin@nawra.om',
        password_hash,
        'System Administrator',
        admin_role_id,
        'staff',
        TRUE,
        TRUE,
        NOW(),
        NOW()
    );

    -- Librarian
    INSERT INTO users (
        id,
        email,
        password_hash,
        full_name,
        role_id,
        user_type,
        is_active,
        email_verified,
        created_at,
        updated_at
    ) VALUES (
        uuid_generate_v4(),
        'librarian@nawra.om',
        password_hash,
        'Head Librarian',
        librarian_role_id,
        'staff',
        TRUE,
        TRUE,
        NOW(),
        NOW()
    );

    -- Circulation Staff
    INSERT INTO users (
        id,
        email,
        password_hash,
        full_name,
        role_id,
        user_type,
        is_active,
        email_verified,
        created_at,
        updated_at
    ) VALUES (
        uuid_generate_v4(),
        'circulation@nawra.om',
        password_hash,
        'Circulation Desk Staff',
        circulation_role_id,
        'staff',
        TRUE,
        TRUE,
        NOW(),
        NOW()
    );

    -- Cataloger
    INSERT INTO users (
        id,
        email,
        password_hash,
        full_name,
        role_id,
        user_type,
        is_active,
        email_verified,
        created_at,
        updated_at
    ) VALUES (
        uuid_generate_v4(),
        'cataloger@nawra.om',
        password_hash,
        'Catalog Manager',
        cataloger_role_id,
        'staff',
        TRUE,
        TRUE,
        NOW(),
        NOW()
    );

    -- Patron
    INSERT INTO users (
        id,
        email,
        password_hash,
        full_name,
        role_id,
        user_type,
        is_active,
        email_verified,
        phone,
        address,
        created_at,
        updated_at
    ) VALUES (
        uuid_generate_v4(),
        'patron@nawra.om',
        password_hash,
        'Test Patron User',
        patron_role_id,
        'patron',
        TRUE,
        TRUE,
        '+968 1234 5678',
        'Test Address, Muscat, Oman',
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Successfully created 5 test users with standard credentials';
    RAISE NOTICE 'Email domain: @nawra.om';
    RAISE NOTICE 'Password: Nawra2025!';

END $$;

-- =====================================================
-- 4. Verify Users Created
-- =====================================================

-- Display all test users
SELECT
    u.email,
    u.full_name,
    r.name as role,
    u.user_type,
    u.is_active,
    u.email_verified,
    u.created_at
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE u.email LIKE '%@nawra.om'
ORDER BY
    CASE
        WHEN r.name = 'Administrator' THEN 1
        WHEN r.name = 'Librarian' THEN 2
        WHEN r.name = 'Circulation Staff' THEN 3
        WHEN r.name = 'Cataloger' THEN 4
        WHEN r.name = 'Patron' THEN 5
    END;

-- =====================================================
-- 5. Test Login (Optional - for verification)
-- =====================================================

-- To test login, use this query (replace email):
-- SELECT
--     u.id,
--     u.email,
--     u.full_name,
--     u.password_hash,
--     r.name as role,
--     r.permissions
-- FROM users u
-- JOIN roles r ON u.role_id = r.id
-- WHERE u.email = 'admin@nawra.om';

-- =====================================================
-- Rollback (if needed)
-- =====================================================

-- To remove all test users:
-- DELETE FROM users WHERE email LIKE '%@nawra.om';

-- =====================================================
-- Summary
-- =====================================================

-- Users Created: 5
-- Domain: @nawra.om
-- Password (all): Nawra2025!
-- Status: Active, Email Verified
--
-- Administrator: admin@nawra.om
-- Librarian: librarian@nawra.om
-- Circulation Staff: circulation@nawra.om
-- Cataloger: cataloger@nawra.om
-- Patron: patron@nawra.om
--
-- Next Steps:
-- 1. Test login via frontend: http://localhost:3000/en/login
-- 2. Test API: POST http://localhost:8000/api/v1/auth/login
-- 3. Verify permissions for each role
--
-- =====================================================
-- IMPORTANT: Production Deployment
-- =====================================================
--
-- Before deploying to production:
-- 1. DELETE all test users: DELETE FROM users WHERE email LIKE '%@nawra.om';
-- 2. Create real staff accounts with secure, unique passwords
-- 3. Enable email verification for new accounts
-- 4. Set up 2FA if available
-- 5. Implement password reset via email
--
-- =====================================================
