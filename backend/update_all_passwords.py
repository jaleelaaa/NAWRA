#!/usr/bin/env python3
"""
Update all test user passwords to Nawra2025!
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
    """Update all test user passwords to Nawra2025!"""
    logger.info("🔧 Updating all test user passwords to Nawra2025!...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    # Test users to update
    test_users = [
        "admin@nawra.om",
        "librarian@nawra.om",
        "circulation@nawra.om",
        "cataloger@nawra.om",
        "patron@nawra.om",
    ]

    # New password hash for: Nawra2025!
    # Generated with bcrypt, 12 rounds, verified working
    password_hash = "$2b$12$oKyAaod7Qh3Ub7lpDoeh2.ag8ibdX32sxvbbykhkJIRAbFGYyR41a"

    logger.info(f"\n🔑 Updating passwords for {len(test_users)} users...")

    success_count = 0
    for email in test_users:
        try:
            # Update password
            update_response = supabase.table('users').update({
                'password_hash': password_hash
            }).eq('email', email).execute()

            if update_response.data:
                logger.info(f"✅ Updated password for {email}")
                success_count += 1
            else:
                logger.warning(f"⚠️  User {email} not found")

        except Exception as e:
            logger.error(f"❌ Failed to update {email}: {str(e)}")

    logger.info(f"\n📊 Results: {success_count}/{len(test_users)} passwords updated")
    logger.info("\n📝 All passwords are now: Nawra2025!")
    logger.info("="*60)
    logger.info("You can now log in with any of these accounts:")
    for email in test_users:
        logger.info(f"  • {email} / Nawra2025!")
    logger.info("="*60)


if __name__ == "__main__":
    main()
