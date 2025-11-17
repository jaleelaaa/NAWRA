"""
Test script to verify arabic_name column and backend response
"""
from supabase import create_client
import os
from dotenv import load_dotenv
import json

load_dotenv()

supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

print("=" * 60)
print("Test 1: Checking if arabic_name column exists...")
print("=" * 60)
try:
    result = supabase.table('users').select('email, full_name, arabic_name').eq('email', 'admin@ministry.om').execute()
    print("SUCCESS - Column exists!")
    print(f"Data: {json.dumps(result.data, ensure_ascii=False, indent=2)}")
except Exception as e:
    print(f"ERROR: {e}")

print("\n" + "=" * 60)
print("Test 2: Full user record (as auth service fetches it)...")
print("=" * 60)
try:
    result = supabase.table('users').select('id, email, full_name, arabic_name, user_type, is_active, created_at, roles(name, permissions)').eq('email', 'admin@ministry.om').eq('is_active', True).execute()
    if result.data:
        print(f"Data: {json.dumps(result.data, ensure_ascii=False, indent=2)}")
    else:
        print("No user found")
except Exception as e:
    print(f"ERROR: {e}")

print("\n" + "=" * 60)
print("Test 3: All columns in users table...")
print("=" * 60)
try:
    result = supabase.table('users').select('*').limit(1).execute()
    if result.data:
        print(f"Columns: {list(result.data[0].keys())}")
    else:
        print("No data")
except Exception as e:
    print(f"ERROR: {e}")
