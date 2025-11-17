"""
Script to create admin user for testing
"""
from app.db.supabase_client import get_supabase
from app.core.security import get_password_hash
from datetime import datetime

def create_admin_user():
    """Create admin user with credentials admin@nawra.om / Admin@123456"""
    try:
        supabase = get_supabase()

        # Check if user already exists
        existing = supabase.table('users').select("*").eq('email', 'admin@nawra.om').execute()

        if existing.data and len(existing.data) > 0:
            print("✓ Admin user already exists!")
            print(f"  Email: admin@nawra.om")
            print(f"  ID: {existing.data[0]['id']}")
            return

        # Get Admin role ID
        role_response = supabase.table('roles').select("id, name").eq('name', 'Admin').execute()

        if not role_response.data:
            print("✗ Admin role not found in database. Creating roles first...")
            # Create Admin role
            role_data = supabase.table('roles').insert({
                'name': 'Admin',
                'name_ar': 'مدير',
                'description': 'System administrator with full access',
                'description_ar': 'مدير النظام مع وصول كامل'
            }).execute()
            role_id = role_data.data[0]['id']
            print(f"✓ Admin role created with ID: {role_id}")
        else:
            role_id = role_response.data[0]['id']
            print(f"✓ Found Admin role with ID: {role_id}")

        # Hash the password
        password_hash = get_password_hash("Admin@123456")

        # Create admin user
        new_user = {
            "email": "admin@nawra.om",
            "password_hash": password_hash,
            "full_name": "System Administrator",
            "full_name_ar": "مدير النظام",
            "role_id": role_id,
            "user_type": "Staff",
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }

        result = supabase.table('users').insert(new_user).execute()

        if result.data:
            print("✓ Admin user created successfully!")
            print(f"  Email: admin@nawra.om")
            print(f"  Password: Admin@123456")
            print(f"  ID: {result.data[0]['id']}")
        else:
            print("✗ Failed to create admin user")

    except Exception as e:
        print(f"✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("Creating admin user...")
    create_admin_user()
