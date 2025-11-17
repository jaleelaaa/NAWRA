"""Create migration SQL files for CLI execution"""
import os

# Migration 1: Add renewal_count
migration_1 = """-- Migration 1: Add renewal_count column to circulation_records
ALTER TABLE circulation_records
ADD COLUMN IF NOT EXISTS renewal_count INTEGER DEFAULT 0;

-- Verify
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'circulation_records' AND column_name = 'renewal_count';
"""

# Create migrations directory if needed
migrations_dir = os.path.join(os.path.dirname(__file__), 'migrations')
os.makedirs(migrations_dir, exist_ok=True)

# Write migration 1
migration_1_file = os.path.join(migrations_dir, '001_add_renewal_count.sql')
with open(migration_1_file, 'w', encoding='utf-8') as f:
    f.write(migration_1)

print("Migration files created:")
print(f"  1. {migration_1_file}")
print(f"  2. migrations/005_create_book_requests_table.sql (already exists)")
print()
print("To run migrations via Supabase CLI:")
print()
print("  npx supabase db execute --project-ref gcthmfmxsyddplmkifbd --file migrations/001_add_renewal_count.sql")
print("  npx supabase db execute --project-ref gcthmfmxsyddplmkifbd --file migrations/005_create_book_requests_table.sql")
print()
print("You will be prompted for your database password.")
print("Get it from: https://supabase.com/dashboard/project/gcthmfmxsyddplmkifbd/settings/database")
