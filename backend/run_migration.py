"""
Run database migration for adding Arabic name support
"""
import sys
from pathlib import Path
from app.db.supabase_client import get_supabase

def run_migration():
    """Execute the Arabic name migration"""
    try:
        # Get Supabase client
        supabase = get_supabase()

        # Read migration SQL file
        migration_file = Path(__file__).parent / "sql" / "002_add_arabic_name.sql"
        with open(migration_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        print("=" * 60)
        print("Running Arabic Name Migration...")
        print("=" * 60)

        # Split SQL into individual statements and execute
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]

        for idx, statement in enumerate(statements, 1):
            if not statement or statement.startswith('--'):
                continue

            print(f"\nExecuting statement {idx}/{len(statements)}...")

            # Execute using supabase PostgREST or raw query
            # Since Supabase Python client uses PostgREST, we'll use direct SQL via RPC
            try:
                # For ALTER TABLE and UPDATE statements, we need to use raw SQL
                # This requires setting up a SQL function in Supabase or using direct connection
                print(f"Statement: {statement[:100]}...")
                # Note: Supabase Python client doesn't support raw SQL directly
                # You'll need to run these via Supabase Dashboard SQL editor
                print("⚠ Please run this SQL statement via Supabase Dashboard SQL Editor")
            except Exception as e:
                print(f"✗ Error: {e}")
                continue

        print("\n" + "=" * 60)
        print("Migration Instructions:")
        print("=" * 60)
        print("Please run the SQL migration manually via Supabase Dashboard:")
        print(f"1. Open your Supabase project dashboard")
        print(f"2. Go to SQL Editor")
        print(f"3. Copy and paste the contents of: {migration_file}")
        print(f"4. Click 'Run' to execute")
        print("=" * 60)

        return True

    except Exception as e:
        print(f"✗ Migration failed: {e}")
        return False

if __name__ == "__main__":
    success = run_migration()
    sys.exit(0 if success else 1)
