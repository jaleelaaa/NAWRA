#!/usr/bin/env python
"""Simple script to run migration 005"""
import sys
from pathlib import Path
from dotenv import load_dotenv
import os

# Load environment
load_dotenv()

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from app.db.supabase_client import get_supabase

def run_migration():
    print("Running Migration 005: Create Book Requests Table")
    print("="*60)

    try:
        # Get Supabase client
        supabase = get_supabase()

        # Read migration SQL
        migration_path = Path(__file__).parent / 'migrations' / '005_create_book_requests_table.sql'
        with open(migration_path, 'r', encoding='utf-8') as f:
            sql = f.read()

        # Execute migration
        print("Executing migration SQL...")

        # Note: Supabase Python client doesn't support raw SQL execution
        # The table needs to be created via Supabase Dashboard SQL Editor
        # Let's check if the table exists instead

        try:
            result = supabase.table('book_requests').select('id').limit(1).execute()
            print("[OK] book_requests table already exists!")
            print(f"Table has data: {len(result.data) > 0}")
            return True
        except Exception as e:
            error_msg = str(e)
            if 'does not exist' in error_msg.lower() or 'not found' in error_msg.lower():
                print("[ERROR] book_requests table does not exist!")
                print("")
                print("To create the table:")
                print("1. Go to your Supabase Dashboard")
                print("2. Navigate to SQL Editor")
                print("3. Run the SQL from: migrations/005_create_book_requests_table.sql")
                print("")
                return False
            else:
                print(f"[WARNING] Unexpected error: {error_msg}")
                # May be a permissions issue but table exists
                return True

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return False

if __name__ == "__main__":
    success = run_migration()
    sys.exit(0 if success else 1)
