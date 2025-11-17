"""
Simple migration runner using Supabase REST API
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Extract project reference from URL
PROJECT_REF = SUPABASE_URL.split("//")[1].split(".")[0]

print("\n" + "="*70)
print("NAWRA Library Management System - Database Migrations via CLI")
print("="*70)
print(f"\nProject Reference: {PROJECT_REF}")
print(f"Supabase URL: {SUPABASE_URL}\n")

# Read migrations
print("Reading migration files...")

# Migration 1: Add renewal_count
migration_1 = """
ALTER TABLE circulation_records
ADD COLUMN IF NOT EXISTS renewal_count INTEGER DEFAULT 0;
"""

# Migration 2: Read from file
migration_2_file = os.path.join(os.path.dirname(__file__), 'migrations', '005_create_book_requests_table.sql')
with open(migration_2_file, 'r', encoding='utf-8') as f:
    migration_2 = f.read()

print("Migrations loaded successfully\n")

print("="*70)
print("INSTRUCTIONS TO RUN MIGRATIONS")
print("="*70)

print("""
You can run these migrations using one of these methods:

METHOD 1: Supabase Dashboard (Recommended - Easiest)
────────────────────────────────────────────────────
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Navigate to: SQL Editor
4. Copy and paste each migration below
5. Click "Run" for each migration

METHOD 2: Supabase CLI
────────────────────────────────────────────────────
1. Get your database password from Supabase Dashboard
2. Run these commands:

   cd backend
   npx supabase db execute --project-ref """ + PROJECT_REF + """ --file migrations/migration_001_renewal_count.sql
   npx supabase db execute --project-ref """ + PROJECT_REF + """ --file migrations/005_create_book_requests_table.sql

""")

print("="*70)
print("MIGRATION 1: Add renewal_count Column")
print("="*70)
print(migration_1)

print("\n" + "="*70)
print("MIGRATION 2: Create book_requests Table")
print("="*70)
print("\nFile location: migrations/005_create_book_requests_table.sql")
print(f"Lines: {len(migration_2.split(chr(10)))} lines")
print("\n(Use the SQL file for this migration)")

# Create a simple SQL file for migration 1
migration_1_file = os.path.join(os.path.dirname(__file__), 'migrations', 'migration_001_renewal_count.sql')
with open(migration_1_file, 'w', encoding='utf-8') as f:
    f.write(migration_1)

print("\nCreated: migrations/migration_001_renewal_count.sql")

print("\n" + "="*70)
print("QUICK START")
print("="*70)
print(f"""
To run migrations via Dashboard:
1. Visit: https://app.supabase.com/project/{PROJECT_REF}/sql

2. For Migration 1, paste this:
{migration_1}

3. For Migration 2, copy the entire content from:
   backend/migrations/005_create_book_requests_table.sql

""")

print("="*70 + "\n")
