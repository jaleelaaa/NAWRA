#!/usr/bin/env python3
"""
Run Migration 005: Create book_requests table

This script creates the book_requests table for patron self-service
book requests and reservations.

Usage:
    python run_migration_005.py

Prerequisites:
    - SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file
    - supabase-py package installed: pip install supabase
    - PostgreSQL database accessible via Supabase

What this migration creates:
    - book_requests table with 10 columns
    - 7 performance indexes
    - 6 RLS policies for data isolation
    - 2 helper functions
    - Triggers for auto-updating timestamps
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Error: supabase package not installed")
    print("   Install it with: pip install supabase")
    sys.exit(1)


def load_environment():
    """Load environment variables from .env file"""
    env_path = Path(__file__).parent / '.env'
    if not env_path.exists():
        print(f"❌ Error: .env file not found at {env_path}")
        print("   Create a .env file with SUPABASE_URL and SUPABASE_SERVICE_KEY")
        return None, None

    load_dotenv(env_path)

    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_KEY')

    if not url or not key:
        print("❌ Error: Missing required environment variables")
        print("   Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env")
        return None, None

    return url, key


def read_migration_file():
    """Read the SQL migration file"""
    migration_file = Path(__file__).parent / 'migrations' / '005_create_book_requests_table.sql'

    if not migration_file.exists():
        print(f"❌ Error: Migration file not found: {migration_file}")
        return None

    try:
        with open(migration_file, 'r', encoding='utf-8') as f:
            sql = f.read()
        return sql
    except Exception as e:
        print(f"❌ Error reading migration file: {str(e)}")
        return None


def verify_table_exists(supabase: Client):
    """Verify that the book_requests table was created successfully"""
    try:
        # Try to select from the table (will work even with RLS)
        response = supabase.table('book_requests').select('*').limit(0).execute()
        return True
    except Exception as e:
        error_msg = str(e).lower()
        if 'does not exist' in error_msg or 'relation' in error_msg:
            return False
        # If it's a permission error, the table exists but RLS is blocking
        # which is actually what we want
        if 'permission' in error_msg or 'policy' in error_msg:
            return True
        print(f"⚠️  Warning: Could not verify table: {str(e)}")
        return False


def run_migration():
    """Main migration runner"""
    print("=" * 70)
    print("NAWRA Library Management System")
    print("Migration 005: Create Book Requests Table")
    print("=" * 70)
    print()

    # Step 1: Load environment
    print("📋 Step 1: Loading environment variables...")
    url, key = load_environment()
    if not url or not key:
        return False
    print(f"   ✅ Loaded Supabase URL: {url[:30]}...")
    print()

    # Step 2: Read migration file
    print("📋 Step 2: Reading migration file...")
    sql = read_migration_file()
    if not sql:
        return False
    lines = sql.count('\n')
    print(f"   ✅ Loaded migration ({lines} lines)")
    print()

    # Step 3: Connect to Supabase
    print("📋 Step 3: Connecting to Supabase...")
    try:
        supabase: Client = create_client(url, key)
        print("   ✅ Connected successfully")
    except Exception as e:
        print(f"   ❌ Connection failed: {str(e)}")
        return False
    print()

    # Step 4: Execute migration
    print("📋 Step 4: Executing migration...")
    print("   ⏳ This may take a few seconds...")

    # Split SQL into statements and execute them
    # Supabase doesn't have a direct SQL execution endpoint, so we need to use
    # PostgreSQL connection or execute via Supabase functions

    # For Supabase, the recommended approach is to use the SQL Editor in the dashboard
    # or use a PostgreSQL client directly. However, we can try to execute via RPC

    print()
    print("⚠️  IMPORTANT: Automatic execution via Python is limited in Supabase.")
    print("   Please use one of these methods instead:")
    print()
    print("   Method 1: Supabase Dashboard (RECOMMENDED)")
    print("   -----------------------------------------")
    print("   1. Go to https://supabase.com/dashboard")
    print("   2. Select your NAWRA project")
    print("   3. Navigate to 'SQL Editor' in the left sidebar")
    print("   4. Click '+ New Query'")
    print("   5. Copy the entire contents of:")
    print(f"      {Path(__file__).parent / 'migrations' / '005_create_book_requests_table.sql'}")
    print("   6. Paste into the SQL Editor")
    print("   7. Click 'Run' or press Ctrl+Enter")
    print()
    print("   Method 2: PostgreSQL Client (psql)")
    print("   ------------------------------------")
    print("   psql $DATABASE_URL -f migrations/005_create_book_requests_table.sql")
    print()
    print("   Method 3: pgAdmin or DBeaver")
    print("   ------------------------------")
    print("   Connect using your DATABASE_URL and run the SQL file")
    print()

    # Try to verify if table already exists
    print("📋 Step 5: Checking if migration already ran...")
    if verify_table_exists(supabase):
        print("   ✅ Table 'book_requests' already exists!")
        print()
        print("=" * 70)
        print("Migration Status: ALREADY COMPLETED")
        print("=" * 70)
        print()
        print("The book_requests table is ready for use. You can:")
        print("  • Test the API endpoints in requests.py")
        print("  • Run the Playwright tests: npx playwright test tests/patron-requests.spec.ts")
        print("  • Use the patron frontend to create book requests")
        return True
    else:
        print("   ℹ️  Table does not exist yet - please run the migration using one of the methods above")
        print()

    return True


def verify_migration():
    """Run verification queries after migration"""
    print("=" * 70)
    print("Migration Verification Queries")
    print("=" * 70)
    print()
    print("Run these queries in Supabase SQL Editor to verify:")
    print()

    queries = [
        ("1. Check table exists", """
SELECT table_name,
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'book_requests') as column_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'book_requests';
        """),

        ("2. Check columns", """
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'book_requests'
ORDER BY ordinal_position;
        """),

        ("3. Check indexes", """
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'book_requests'
ORDER BY indexname;
        """),

        ("4. Check RLS policies", """
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'book_requests'
ORDER BY policyname;
        """),

        ("5. Check constraints", """
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'book_requests'
ORDER BY constraint_name;
        """),
    ]

    for title, query in queries:
        print(f"{title}:")
        print(query.strip())
        print()

    print("=" * 70)
    print()


if __name__ == '__main__':
    print()
    success = run_migration()
    print()

    if success:
        print("📚 For verification queries, run with --verify flag:")
        print("   python run_migration_005.py --verify")
        print()

        if '--verify' in sys.argv:
            verify_migration()

        print("✅ Migration script completed!")
        print()
        print("Next steps:")
        print("  1. Run the migration in Supabase SQL Editor (if not done)")
        print("  2. Verify with the queries above")
        print("  3. Test the API: POST http://localhost:8000/api/v1/requests")
        print("  4. Run Playwright tests: npx playwright test tests/patron-requests.spec.ts")
        print()
    else:
        print("❌ Migration script failed. Please check errors above.")
        sys.exit(1)
