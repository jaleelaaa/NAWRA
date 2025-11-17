#!/usr/bin/env python3
"""
Script to check and fix user_type field for all users
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from supabase import create_client
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Check and fix user types"""
    logger.info("🔍 Checking user types...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Get all users
    response = supabase.table('users').select('id, email, full_name, user_type, is_active, role_id').execute()

    logger.info("\n📋 Current users:")
    logger.info("="*80)

    users_to_fix = []

    for user in response.data:
        status = "✅" if user.get('user_type') else "❌"
        logger.info(f"{status} {user['email']}")
        logger.info(f"   Name: {user['full_name']}")
        logger.info(f"   Type: {user.get('user_type', 'NOT SET')}")
        logger.info(f"   Active: {user.get('is_active', False)}")
        logger.info("-"*80)

        if not user.get('user_type'):
            users_to_fix.append(user)

    # Fix users without user_type
    if users_to_fix:
        logger.info(f"\n🔧 Fixing {len(users_to_fix)} users without user_type...")

        for user in users_to_fix:
            # Set user_type to 'staff' for non-patron users
            user_type = 'patron' if 'patron' in user['email'].lower() else 'staff'

            logger.info(f"Setting {user['email']} to {user_type}...")

            update_response = supabase.table('users').update({
                'user_type': user_type
            }).eq('id', user['id']).execute()

            if update_response.data:
                logger.info(f"✅ Updated {user['email']}")
            else:
                logger.error(f"❌ Failed to update {user['email']}")

    logger.info("\n✨ Check completed!")


if __name__ == "__main__":
    main()
