"""
Run database migrations for NAWRA Library Management System
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Create Supabase client with service role key (bypasses RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def run_sql(sql: str, description: str) -> bool:
    """Execute SQL and return success status"""
    try:
        print(f"\n{'='*60}")
        print(f"Running: {description}")
        print(f"{'='*60}")

        # Execute SQL using Supabase RPC
        result = supabase.rpc('exec_sql', {'query': sql}).execute()

        print(f"✅ SUCCESS: {description}")
        return True
    except Exception as e:
        print(f"❌ ERROR: {description}")
        print(f"Error details: {str(e)}")
        return False

def run_migration_1():
    """Migration 1: Add renewal_count column"""
    sql = """
    ALTER TABLE circulation_records
    ADD COLUMN IF NOT EXISTS renewal_count INTEGER DEFAULT 0;
    """

    return run_sql(sql, "Migration 1: Add renewal_count column")

def run_migration_2():
    """Migration 2: Create book_requests table"""

    # Read the SQL file
    sql_file = os.path.join(os.path.dirname(__file__), 'migrations', '005_create_book_requests_table.sql')

    with open(sql_file, 'r', encoding='utf-8') as f:
        sql = f.read()

    return run_sql(sql, "Migration 2: Create book_requests table")

def verify_migrations():
    """Verify migrations completed successfully"""
    print(f"\n{'='*60}")
    print("Verifying Migrations")
    print(f"{'='*60}")

    # Check renewal_count column
    try:
        result = supabase.table('circulation_records').select('renewal_count').limit(1).execute()
        print("✅ renewal_count column exists")
    except Exception as e:
        print(f"❌ renewal_count column not found: {str(e)}")

    # Check book_requests table
    try:
        result = supabase.table('book_requests').select('*').limit(1).execute()
        print("✅ book_requests table exists")
    except Exception as e:
        print(f"❌ book_requests table not found: {str(e)}")

def main():
    print("\n" + "="*60)
    print("NAWRA Library Management System - Database Migrations")
    print("="*60)

    print(f"\n📡 Connecting to Supabase...")
    print(f"   URL: {SUPABASE_URL}")

    # Run migrations
    success_count = 0

    if run_migration_1():
        success_count += 1

    if run_migration_2():
        success_count += 1

    # Verify
    verify_migrations()

    # Summary
    print(f"\n{'='*60}")
    print(f"Migration Summary: {success_count}/2 migrations completed")
    print(f"{'='*60}\n")

    if success_count == 2:
        print("🎉 All migrations completed successfully!")
    else:
        print("⚠️  Some migrations failed. Please check errors above.")

if __name__ == "__main__":
    main()
