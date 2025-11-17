#!/usr/bin/env python3
"""
Script to check librarian user permissions
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from supabase import create_client
from app.core.config import settings
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Check librarian user permissions"""
    logger.info("🔍 Checking librarian user permissions...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    # Get all users with 'librarian' in email
    response = supabase.table('users').select('id, email, full_name, user_type, is_active, role_id, roles(name, permissions)').like('email', '%librarian%').execute()

    logger.info("\n📋 Users with 'librarian' in email:")
    logger.info("="*80)

    for user in response.data:
        logger.info(f"\n✉️  Email: {user['email']}")
        logger.info(f"👤 Name: {user['full_name']}")
        logger.info(f"📝 Type: {user.get('user_type', 'NOT SET')}")
        logger.info(f"✅ Active: {user.get('is_active', False)}")
        logger.info(f"🆔 Role ID: {user.get('role_id', 'NOT SET')}")

        if user.get('roles'):
            logger.info(f"🎭 Role Name: {user['roles']['name']}")
            logger.info(f"🔑 Permissions:")
            permissions = user['roles'].get('permissions', [])
            if permissions:
                for perm in permissions:
                    logger.info(f"   - {perm}")
            else:
                logger.info("   NO PERMISSIONS")
        else:
            logger.info("❌ NO ROLE ASSIGNED")

        logger.info("-"*80)

    # Get all roles
    logger.info("\n\n📚 All Roles:")
    logger.info("="*80)

    roles_response = supabase.table('roles').select('id, name, description, permissions').execute()

    for role in roles_response.data:
        logger.info(f"\n🎭 Role: {role['name']}")
        logger.info(f"📄 Description: {role.get('description', 'N/A')}")
        logger.info(f"🆔 ID: {role['id']}")
        logger.info(f"🔑 Permissions:")
        permissions = role.get('permissions', [])
        if permissions:
            for perm in permissions:
                logger.info(f"   - {perm}")
        else:
            logger.info("   NO PERMISSIONS")
        logger.info("-"*80)

    logger.info("\n✨ Check completed!")


if __name__ == "__main__":
    main()
