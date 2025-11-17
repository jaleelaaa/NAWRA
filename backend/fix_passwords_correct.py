#!/usr/bin/env python3
"""
Fix all user passwords using the app's password hashing function
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
    """Fix all user passwords using app's password hashing"""
    logger.info("🔧 Fixing all user passwords with app's password hash function...")

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

    # Generate password hash using the app's function
    password = "Nawra2025!"
    password_hash = get_password_hash(password)

    logger.info(f"\n🔑 Generated hash using app's function:")
    logger.info(f"   Hash: {password_hash}")

    # Verify it works
    if verify_password(password, password_hash):
        logger.info("   ✅ Hash verification test PASSED")
    else:
        logger.error("   ❌ Hash verification test FAILED - stopping")
        return

    logger.info(f"\n🔄 Updating passwords for {len(test_users)} users...")

    success_count = 0
    for email in test_users:
        try:
            # Update password
            update_response = supabase.table('users').update({
                'password_hash': password_hash
            }).eq('email', email).execute()

            if update_response.data:
                logger.info(f"   ✅ Updated: {email}")
                success_count += 1
            else:
                logger.warning(f"   ⚠️  Not found: {email}")

        except Exception as e:
            logger.error(f"   ❌ Failed {email}: {str(e)}")

    logger.info(f"\n📊 Results: {success_count}/{len(test_users)} passwords updated")
    logger.info("\n" + "="*60)
    logger.info("✅ All passwords are now: Nawra2025!")
    logger.info("="*60)
    logger.info("\nYou can now log in with:")
    for email in test_users:
        logger.info(f"  • {email} / Nawra2025!")
    logger.info("="*60)


if __name__ == "__main__":
    main()
