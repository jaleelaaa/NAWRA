"""
Add arabic_name column and populate with data
Uses Supabase's SQL execution capability
"""
import sys
from app.db.supabase_client import get_supabase

def migrate_arabic_names():
    """Add arabic_name column and update existing users"""
    supabase = get_supabase()

    print("=" * 60)
    print("Adding arabic_name column and updating users...")
    print("=" * 60)

    # Since we can't execute DDL directly, we'll just update the existing users
    # The column needs to be added via Supabase Dashboard first

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

    try:
        # Fetch all users
        response = supabase.table('users').select('id, full_name, email').execute()

        if not response.data:
            print("No users found")
            return

        print(f"\nFound {len(response.data)} users")
        print("\nUpdating users with Arabic names...\n")

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
                        print(f"[OK] {full_name} -> {arabic_name}")
                        updated_count += 1
                    else:
                        print(f"[WARN] Update returned no data for: {full_name}")
                except Exception as e:
                    error_msg = str(e)
                    if 'arabic_name' in error_msg and 'schema cache' in error_msg:
                        print(f"\n[ERROR] Column 'arabic_name' does not exist!")
                        print("\nPlease add the column first by running this SQL in Supabase Dashboard:")
                        print("-" * 60)
                        print("ALTER TABLE users ADD COLUMN IF NOT EXISTS arabic_name VARCHAR(255);")
                        print("-" * 60)
                        return False
                    else:
                        print(f"[ERROR] Error updating {full_name}: {e}")
            else:
                print(f"[SKIP] No Arabic mapping for: {full_name}")

        print("\n" + "=" * 60)
        print(f"Successfully updated {updated_count} users!")
        print("=" * 60)
        return True

    except Exception as e:
        print(f"\n[ERROR] Migration failed: {e}")
        return False

if __name__ == "__main__":
    success = migrate_arabic_names()
    sys.exit(0 if success else 1)
