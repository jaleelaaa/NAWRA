"""
Test API response to verify Arabic names are included
"""
import sys
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

from app.db.supabase_client import get_supabase
import json

def test_users_api():
    """Test the users API endpoint data"""
    supabase = get_supabase()

    print("Testing Users API Response")
    print("=" * 60)

    # Query exactly as the service does
    response = supabase.table('users').select(
        "id, email, full_name, arabic_name, role_id, user_type, is_active, phone, "
        "address, last_login, created_at, updated_at, roles(id, name)"
    ).order('created_at', desc=True).limit(3).execute()

    if response.data:
        print(f"\nFound {len(response.data)} users\n")
        for user in response.data:
            print(f"User: {user['full_name']}")
            print(f"  Arabic Name: {user.get('arabic_name', 'NOT SET')}")
            print(f"  Role: {user.get('roles', {}).get('name', 'N/A')}")
            print(f"  Email: {user['email']}")
            print("-" * 60)
    else:
        print("No users found")

if __name__ == "__main__":
    test_users_api()
