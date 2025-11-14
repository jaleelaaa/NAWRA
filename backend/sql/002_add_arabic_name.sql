-- ================================================================
-- Add Arabic Name Support for Bilingual Display
-- ================================================================

-- Add arabic_name column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS arabic_name VARCHAR(255);

-- Update existing test users with Arabic names
UPDATE users SET arabic_name = 'مسؤول النظام' WHERE email = 'admin@ministry.om';
UPDATE users SET arabic_name = 'رئيس أمناء المكتبة' WHERE email = 'librarian@ministry.om';
UPDATE users SET arabic_name = 'موظف التداول' WHERE email = 'circulation@ministry.om';
UPDATE users SET arabic_name = 'مدير الفهرسة' WHERE email = 'cataloger@ministry.om';
UPDATE users SET arabic_name = 'مستفيد تجريبي' WHERE email = 'patron@ministry.om';

-- Update custom test users if they exist
UPDATE users SET arabic_name = 'مدير النظام' WHERE full_name = 'System Admin' AND arabic_name IS NULL;
UPDATE users SET arabic_name = 'أمين فهرسة تجريبي' WHERE full_name = 'Test Cataloger' AND arabic_name IS NULL;
UPDATE users SET arabic_name = 'عضو موظفي التداول' WHERE full_name = 'Circulation Staff Member' AND arabic_name IS NULL;
UPDATE users SET arabic_name = 'مستفيد المكتبة' WHERE full_name = 'Library Patron' AND arabic_name IS NULL;

-- ================================================================
-- Migration completed
-- ================================================================
