#!/usr/bin/env python3
"""
Script to fix all test user passwords to Admin@123
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from supabase import create_client
from app.core.security import get_password_hash
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Fix all test user passwords"""
    logger.info("🔧 Fixing all test user passwords...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Test users to update
    test_users = [
        "admin@ministry.om",
        "admin@nawra.om",
        "librarian@ministry.om",
        "circulation@ministry.om",
        "cataloger@ministry.om",
        "patron@ministry.om",
    ]

    # New password for all users
    new_password = "Admin@123"
    hashed_password = get_password_hash(new_password)

    logger.info(f"\n🔑 Updating passwords for {len(test_users)} users...")

    for email in test_users:
        try:
            # Update password
            update_response = supabase.table('users').update({
                'password_hash': hashed_password
            }).eq('email', email).execute()

            if update_response.data:
                logger.info(f"✅ Updated password for {email}")
            else:
                logger.warning(f"⚠️ User {email} not found")

        except Exception as e:
            logger.error(f"❌ Failed to update {email}: {str(e)}")

    logger.info("\n📝 All passwords updated to: Admin@123")
    logger.info("="*60)
    logger.info("You can now log in with any of these accounts:")
    logger.info("- admin@ministry.om / Admin@123")
    logger.info("- librarian@ministry.om / Admin@123")
    logger.info("- circulation@ministry.om / Admin@123")
    logger.info("- cataloger@ministry.om / Admin@123")
    logger.info("- patron@ministry.om / Admin@123")
    logger.info("="*60)


if __name__ == "__main__":
    main()
