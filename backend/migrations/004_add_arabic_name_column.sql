-- Migration: Add arabic_name column to users table
-- Date: 2025-01-17
-- Description: Adds support for bilingual user names (Arabic/English)

-- Add arabic_name column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS arabic_name VARCHAR(255);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_arabic_name ON users(arabic_name);

-- Update existing users with sample Arabic names (optional - for testing)
-- You can customize these or remove this section if you want to set names manually
UPDATE users SET arabic_name = 'مسؤول النظام' WHERE email = 'admin@ministry.om';
UPDATE users SET arabic_name = 'مسؤول النظام' WHERE email = 'admin@nawra.om';
UPDATE users SET arabic_name = 'أمين مكتبة تجريبي' WHERE email = 'librarian@ministry.om';
UPDATE users SET arabic_name = 'موظف تداول تجريبي' WHERE email = 'circulation@ministry.om';
UPDATE users SET arabic_name = 'أمين فهرسة تجريبي' WHERE email = 'cataloger@ministry.om';
UPDATE users SET arabic_name = 'مستفيد تجريبي' WHERE email = 'patron@ministry.om';
UPDATE users SET arabic_name = 'مستفيد المكتبة' WHERE email = 'patron@test.om';
UPDATE users SET arabic_name = 'مستخدم النظام الافتراضي' WHERE email = 'system@nawra.om';

-- Add comment
COMMENT ON COLUMN users.arabic_name IS 'User full name in Arabic for bilingual support';
