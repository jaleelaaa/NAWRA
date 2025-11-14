"""
Add Arabic names to existing users
Note: The column must be added first via Supabase Dashboard SQL Editor
"""
from app.db.supabase_client import get_supabase

def add_arabic_names():
    """Update existing users with Arabic names"""
    supabase = get_supabase()

    # Mapping of English names to Arabic names
    name_mappings = {
        'System Admin': 'مدير النظام',
        'System Administrator': 'مسؤول النظام',
        'Test Cataloger': 'أمين فهرسة تجريبي',
        'Circulation Staff Member': 'عضو موظفي التداول',
        'Library Patron': 'مستفيد المكتبة',
        'Head Librarian': 'رئيس أمناء المكتبة',
        'Circulation Staff': 'موظف التداول',
        'Catalog Manager': 'مدير الفهرسة',
        'Test Patron': 'مستفيد تجريبي'
    }

    print("=" * 60)
    print("Updating users with Arabic names...")
    print("=" * 60)

    # Fetch all users
    response = supabase.table('users').select('id, full_name, email').execute()

    if not response.data:
        print("No users found")
        return

    updated_count = 0
    for user in response.data:
        full_name = user['full_name']
        arabic_name = name_mappings.get(full_name)

        if arabic_name:
            try:
                # Update user with Arabic name
                supabase.table('users').update({
                    'arabic_name': arabic_name
                }).eq('id', user['id']).execute()

                print(f"[OK] Updated: {full_name} -> {arabic_name}")
                updated_count += 1
            except Exception as e:
                print(f"[ERROR] Error updating {full_name}: {e}")
        else:
            print(f"[WARN] No Arabic mapping for: {full_name}")

    print("\n" + "=" * 60)
    print(f"Updated {updated_count} users successfully!")
    print("=" * 60)

if __name__ == "__main__":
    try:
        add_arabic_names()
    except Exception as e:
        print(f"Error: {e}")
