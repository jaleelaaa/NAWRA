-- ================================================================
-- NAWRA Library Management System - Database Schema
-- Supabase PostgreSQL
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 1. ROLES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on role name
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('Administrator', 'Full system access with all permissions',
 '["users.create", "users.read", "users.update", "users.delete",
   "inventory.create", "inventory.read", "inventory.update", "inventory.delete",
   "circulation.checkout", "circulation.checkin", "circulation.renew",
   "acquisitions.create", "acquisitions.read", "acquisitions.update", "acquisitions.delete",
   "reports.view", "reports.generate", "settings.manage"]'::jsonb),

('Librarian', 'Library operations and management',
 '["users.read", "inventory.create", "inventory.read", "inventory.update", "inventory.delete",
   "circulation.checkout", "circulation.checkin", "circulation.renew",
   "acquisitions.read", "reports.view"]'::jsonb),

('Circulation Staff', 'Circulation desk operations',
 '["users.read", "inventory.read", "circulation.checkout", "circulation.checkin",
   "circulation.renew", "fees.collect"]'::jsonb),

('Cataloger', 'Catalog and inventory management',
 '["inventory.create", "inventory.read", "inventory.update", "inventory.delete"]'::jsonb),

('Patron', 'Library patron self-service',
 '["catalog.search", "profile.view", "profile.update", "requests.create", "loans.view"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ================================================================
-- 2. USERS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('staff', 'patron')),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(50),
    address TEXT,
    profile_data JSONB DEFAULT '{}'::jsonb,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ================================================================
-- 3. INSERT DEFAULT TEST USERS
-- ================================================================
-- Note: Password is 'Admin@123' for all users (hashed with bcrypt)
-- Hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LS2LwWBOPUHK

DO $$
DECLARE
    admin_role_id UUID;
    librarian_role_id UUID;
    circulation_role_id UUID;
    cataloger_role_id UUID;
    patron_role_id UUID;
BEGIN
    -- Get role IDs
    SELECT id INTO admin_role_id FROM roles WHERE name = 'Administrator';
    SELECT id INTO librarian_role_id FROM roles WHERE name = 'Librarian';
    SELECT id INTO circulation_role_id FROM roles WHERE name = 'Circulation Staff';
    SELECT id INTO cataloger_role_id FROM roles WHERE name = 'Cataloger';
    SELECT id INTO patron_role_id FROM roles WHERE name = 'Patron';

    -- Insert test users
    INSERT INTO users (email, password_hash, full_name, role_id, user_type, email_verified) VALUES
    ('admin@ministry.om', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LS2LwWBOPUHK',
     'System Administrator', admin_role_id, 'staff', TRUE),

    ('librarian@ministry.om', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LS2LwWBOPUHK',
     'Head Librarian', librarian_role_id, 'staff', TRUE),

    ('circulation@ministry.om', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LS2LwWBOPUHK',
     'Circulation Staff', circulation_role_id, 'staff', TRUE),

    ('cataloger@ministry.om', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LS2LwWBOPUHK',
     'Catalog Manager', cataloger_role_id, 'staff', TRUE),

    ('patron@ministry.om', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LS2LwWBOPUHK',
     'Test Patron', patron_role_id, 'patron', TRUE)
    ON CONFLICT (email) DO NOTHING;
END $$;

-- ================================================================
-- 4. REFRESH TOKENS TABLE (for JWT refresh token rotation)
-- ================================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ================================================================
-- 5. AUDIT LOG TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ================================================================
-- 6. FUNCTIONS & TRIGGERS
-- ================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for roles table
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired refresh tokens (run daily via cron or manually)
CREATE OR REPLACE FUNCTION cleanup_expired_refresh_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM refresh_tokens
    WHERE expires_at < TIMEZONE('utc', NOW());

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 7. ROW LEVEL SECURITY (RLS) - Optional but recommended
-- ================================================================
-- Uncomment if you want to use Supabase RLS

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- SCHEMA CREATED SUCCESSFULLY!
-- ================================================================
-- Default test users credentials:
--   Email: admin@ministry.om | librarian@ministry.om | circulation@ministry.om | cataloger@ministry.om | patron@ministry.om
--   Password: Admin@123 (for all users)
-- ================================================================
