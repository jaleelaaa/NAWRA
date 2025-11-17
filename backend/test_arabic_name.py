"""
Test script to verify arabic_name column and backend response
"""
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

# Test 1: Check if column exists by selecting it
print("=" * 60)
print("Test 1: Checking if arabic_name column exists...")
print("=" * 60)
try:
    result = supabase.table('users').select('email, full_name, arabic_name').eq('email', 'admin@ministry.om').execute()
    print(f"✅ Column exists! Data: {result.data}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 2: Check what the auth endpoint returns
print("\n" + "=" * 60)
print("Test 2: Checking what data is in the user record...")
print("=" * 60)
try:
    result = supabase.table('users').select('id, email, full_name, arabic_name, user_type, is_active, created_at, roles(name, permissions)').eq('email', 'admin@ministry.om').eq('is_active', True).execute()
    if result.data:
        user = result.data[0]
        print(f"Email: {user.get('email')}")
        print(f"Full Name: {user.get('full_name')}")
        print(f"Arabic Name: {user.get('arabic_name')}")
        print(f"Role: {user.get('roles')}")
    else:
        print("❌ No user found")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 60)
print("Test 3: Listing all columns in users table...")
print("=" * 60)
try:
    # Get one user to see all fields
    result = supabase.table('users').select('*').limit(1).execute()
    if result.data:
        print(f"Available columns: {list(result.data[0].keys())}")
    else:
        print("No data")
except Exception as e:
    print(f"❌ Error: {e}")
