#!/usr/bin/env python3
"""
Script to fix admin user passwords
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from supabase import create_client
from app.core.security import get_password_hash, verify_password
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Fix admin passwords"""
    logger.info("🔧 Fixing admin user passwords...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Check all users
    response = supabase.table('users').select('email, full_name, role_id').execute()

    logger.info("\n📋 Current users in database:")
    for user in response.data:
        logger.info(f"  - {user['email']}: {user['full_name']}")

    # Fix admin@nawra.om password
    admin_email = "admin@nawra.om"
    new_password = "Admin@123"

    logger.info(f"\n🔑 Updating password for {admin_email}...")
    hashed_password = get_password_hash(new_password)

    # Update password
    update_response = supabase.table('users').update({
        'password_hash': hashed_password
    }).eq('email', admin_email).execute()

    if update_response.data:
        logger.info(f"✅ Password updated for {admin_email}")

        # Verify
        verify_response = supabase.table('users').select('password_hash').eq('email', admin_email).single().execute()
        if verify_response.data and verify_password(new_password, verify_response.data['password_hash']):
            logger.info(f"✅ Password verification successful!")
        else:
            logger.error(f"❌ Password verification failed!")
    else:
        logger.error(f"❌ Failed to update password")

    # Also update admin@ministry.om if it exists
    ministry_email = "admin@ministry.om"
    ministry_response = supabase.table('users').select('id').eq('email', ministry_email).execute()

    if ministry_response.data:
        logger.info(f"\n🔑 Updating password for {ministry_email}...")
        update_response = supabase.table('users').update({
            'password_hash': hashed_password
        }).eq('email', ministry_email).execute()

        if update_response.data:
            logger.info(f"✅ Password updated for {ministry_email}")
    else:
        logger.info(f"\n⚠️ User {ministry_email} does not exist - creating it...")

        # Get Administrator role ID
        role_response = supabase.table('roles').select('id').eq('name', 'Administrator').single().execute()
        if role_response.data:
            admin_role_id = role_response.data['id']

            # Create user
            create_response = supabase.table('users').insert({
                'email': ministry_email,
                'password_hash': hashed_password,
                'full_name': 'System Administrator',
                'role_id': admin_role_id,
                'user_type': 'staff',
                'is_active': True
            }).execute()

            if create_response.data:
                logger.info(f"✅ Created user {ministry_email}")
            else:
                logger.error(f"❌ Failed to create user")

    logger.info("\n📝 Updated Credentials:")
    logger.info("="*50)
    logger.info(f"Email: admin@ministry.om")
    logger.info(f"Password: Admin@123")
    logger.info("-"*50)
    logger.info(f"Email: admin@nawra.om")
    logger.info(f"Password: Admin@123")
    logger.info("="*50)


if __name__ == "__main__":
    main()
