"""
Update Arabic names with proper UTF-8 encoding
"""
import sys
import os

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

from app.db.supabase_client import get_supabase

def update_arabic_names():
    """Update existing users with Arabic names"""
    supabase = get_supabase()

    # Name mappings
    name_mappings = {
        'System Admin': 'مدير النظام',
        'System Administrator': 'مسؤول النظام',
        'Test Cataloger': 'أمين فهرسة تجريبي',
        'Circulation Staff Member': 'عضو موظفي التداول',
        'Library Patron': 'مستفيد المكتبة',
        'Head Librarian': 'رئيس أمناء المكتبة',
        'Circulation Staff': 'موظف التداول',
        'Catalog Manager': 'مدير الفهرسة',
        'Test Patron': 'مستفيد تجريبي',
        'Test Librarian': 'أمين مكتبة تجريبي'
    }

    print("=" * 60)
    print("Updating users with Arabic names...")
    print("=" * 60)

    try:
        # First, check if the column exists by trying to select it
        test_response = supabase.table('users').select('id, full_name, arabic_name').limit(1).execute()
        print("✓ Column 'arabic_name' exists!")
    except Exception as e:
        error_msg = str(e)
        if '42703' in error_msg or 'does not exist' in error_msg:
            print("\n✗ ERROR: Column 'arabic_name' does not exist!")
            print("\nPlease run this SQL in Supabase Dashboard > SQL Editor:")
            print("-" * 60)
            print("ALTER TABLE users ADD COLUMN IF NOT EXISTS arabic_name VARCHAR(255);")
            print("-" * 60)
            return False
        else:
            print(f"✗ Unexpected error: {e}")
            return False

    # Fetch all users
    response = supabase.table('users').select('id, full_name, email').execute()

    if not response.data:
        print("No users found")
        return False

    print(f"\nFound {len(response.data)} users\n")

    updated_count = 0
    for user in response.data:
        full_name = user['full_name']
        arabic_name = name_mappings.get(full_name)

        if arabic_name:
            try:
                # Update user with Arabic name
                result = supabase.table('users').update({
                    'arabic_name': arabic_name
                }).eq('id', user['id']).execute()

                if result.data:
                    # Use ASCII-safe output
                    print(f"[OK] Updated: {full_name}")
                    updated_count += 1
                else:
                    print(f"[WARN] Update returned no data for: {full_name}")
            except Exception as e:
                print(f"[ERROR] Error updating {full_name}: {e}")
        else:
            print(f"[SKIP] No Arabic mapping for: {full_name}")

    print("\n" + "=" * 60)
    print(f"Successfully updated {updated_count} users!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = update_arabic_names()
    sys.exit(0 if success else 1)
