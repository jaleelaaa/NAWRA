#!/usr/bin/env python3
"""
Script to create test users in the database with proper role UUIDs
"""
import os
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from supabase import create_client, Client
from app.core.security import get_password_hash, verify_password
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test users configuration
# Role names must match exactly what's in the database
TEST_USERS = [
    {
        "email": "librarian@ministry.om",
        "password": "Test@123",
        "full_name": "Test Librarian",
        "role_name": "Librarian",  # Capital L - matches database
        "phone": "+968 9123456",
    },
    {
        "email": "admin@nawra.om",
        "password": "Admin@123",
        "full_name": "System Admin",
        "role_name": "Administrator",  # Full name - matches database
        "phone": "+968 9234567",
    },
    {
        "email": "cataloger@ministry.om",
        "password": "Catalog@123",
        "full_name": "Test Cataloger",
        "role_name": "Cataloger",  # Capital C - matches database
        "phone": "+968 9345678",
    },
    {
        "email": "circulation@ministry.om",
        "password": "Circulate@123",
        "full_name": "Circulation Staff Member",
        "role_name": "Circulation Staff",  # Full name - matches database
        "phone": "+968 9456789",
    },
    {
        "email": "patron@test.om",
        "password": "Patron@123",
        "full_name": "Library Patron",
        "role_name": "Patron",  # 'Patron' not 'member' - matches database
        "phone": "+968 9567890",
    }
]


def get_supabase_client() -> Client:
    """Create and return a Supabase client"""
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return supabase


def get_role_uuid(supabase: Client, role_name: str) -> str:
    """Fetch role UUID from database by role name"""
    try:
        response = supabase.table('roles').select('id').eq('name', role_name).single().execute()
        if response.data:
            return response.data['id']
        else:
            logger.error(f"Role '{role_name}' not found in database")
            return None
    except Exception as e:
        logger.error(f"Error fetching role '{role_name}': {e}")
        return None


def create_user(supabase: Client, user_data: dict, role_uuid: str) -> bool:
    """Create a single user in the database"""
    try:
        # Check if user already exists
        existing_user = supabase.table('users').select('id').eq('email', user_data['email']).execute()

        if existing_user.data:
            logger.info(f"✓ User '{user_data['email']}' already exists - skipping")
            return True

        # Hash the password
        hashed_password = get_password_hash(user_data['password'])

        # Verify the hash works (for debugging)
        if not verify_password(user_data['password'], hashed_password):
            logger.error(f"Password verification failed for {user_data['email']}")
            return False

        # Create user record
        user_record = {
            'email': user_data['email'],
            'password_hash': hashed_password,
            'full_name': user_data['full_name'],
            'phone': user_data.get('phone'),
            'role_id': role_uuid,
            'is_active': True,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }

        # Insert user
        response = supabase.table('users').insert(user_record).execute()

        if response.data:
            logger.info(f"✅ Created user: {user_data['email']} ({user_data['role_name']})")

            # Verify by fetching the user
            verify_response = supabase.table('users').select('email, full_name, role_id').eq('email', user_data['email']).single().execute()
            if verify_response.data:
                logger.info(f"   Verified: {verify_response.data['full_name']} with role_id: {verify_response.data['role_id']}")

            return True
        else:
            logger.error(f"Failed to create user {user_data['email']}")
            return False

    except Exception as e:
        logger.error(f"Error creating user {user_data['email']}: {e}")
        return False


def verify_login(supabase: Client, email: str, password: str) -> bool:
    """Verify that a user can login with their credentials"""
    try:
        # Fetch user with password hash
        response = supabase.table('users').select('password_hash').eq('email', email).single().execute()

        if response.data:
            stored_hash = response.data['password_hash']
            if verify_password(password, stored_hash):
                logger.info(f"✅ Login verification successful for {email}")
                return True
            else:
                logger.error(f"❌ Login verification failed for {email} - password mismatch")
                return False
        else:
            logger.error(f"❌ User {email} not found")
            return False

    except Exception as e:
        logger.error(f"Error verifying login for {email}: {e}")
        return False


def main():
    """Main function to create test users"""
    logger.info("🚀 Starting test user creation script...")
    logger.info(f"📦 Database URL: {settings.SUPABASE_URL}")

    # Get Supabase client
    supabase = get_supabase_client()

    # First, let's check what roles are available
    logger.info("\n📋 Checking available roles in database...")
    try:
        roles_response = supabase.table('roles').select('id, name').execute()
        if roles_response.data:
            logger.info("Available roles:")
            for role in roles_response.data:
                logger.info(f"  - {role['name']}: {role['id']}")
        else:
            logger.error("No roles found in database!")
            return
    except Exception as e:
        logger.error(f"Failed to fetch roles: {e}")
        return

    # Create users
    logger.info("\n👥 Creating test users...")
    created_count = 0
    failed_count = 0

    for user_data in TEST_USERS:
        # Get role UUID
        role_uuid = get_role_uuid(supabase, user_data['role_name'])

        if not role_uuid:
            logger.warning(f"⚠️  Skipping user {user_data['email']} - role '{user_data['role_name']}' not found")
            failed_count += 1
            continue

        # Create user
        if create_user(supabase, user_data, role_uuid):
            created_count += 1
        else:
            failed_count += 1

    # Summary
    logger.info(f"\n📊 Summary:")
    logger.info(f"  ✅ Successfully created/verified: {created_count} users")
    if failed_count > 0:
        logger.info(f"  ❌ Failed: {failed_count} users")

    # Verify logins
    logger.info("\n🔐 Verifying login credentials...")
    for user_data in TEST_USERS:
        verify_login(supabase, user_data['email'], user_data['password'])

    logger.info("\n✨ Test user creation script completed!")

    # Only show credentials for successfully created users
    if created_count > 0:
        logger.info("\n📝 Test Credentials:")
        logger.info("="*50)
        for user in TEST_USERS:
            logger.info(f"Email: {user['email']}")
            logger.info(f"Password: {user['password']}")
            logger.info(f"Role: {user['role_name']}")
            logger.info("-"*50)


if __name__ == "__main__":
    main()