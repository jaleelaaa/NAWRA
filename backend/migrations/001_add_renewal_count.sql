-- Migration 1: Add renewal_count column to circulation_records
ALTER TABLE circulation_records
ADD COLUMN IF NOT EXISTS renewal_count INTEGER DEFAULT 0;

-- Verify
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'circulation_records' AND column_name = 'renewal_count';
