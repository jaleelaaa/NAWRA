#!/usr/bin/env python3
"""
Script to fix circulation user password
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
    """Fix circulation user password"""
    logger.info("🔧 Fixing circulation user password...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Fix circulation@ministry.om password
    circulation_email = "circulation@ministry.om"
    new_password = "Admin@123"

    logger.info(f"\n🔑 Updating password for {circulation_email}...")
    hashed_password = get_password_hash(new_password)

    # Update password
    update_response = supabase.table('users').update({
        'password_hash': hashed_password
    }).eq('email', circulation_email).execute()

    if update_response.data:
        logger.info(f"✅ Password updated for {circulation_email}")

        # Verify
        verify_response = supabase.table('users').select('password_hash').eq('email', circulation_email).single().execute()
        if verify_response.data and verify_password(new_password, verify_response.data['password_hash']):
            logger.info(f"✅ Password verification successful!")
        else:
            logger.error(f"❌ Password verification failed!")
    else:
        logger.error(f"❌ Failed to update password")

    logger.info("\n📝 Updated Credentials:")
    logger.info("="*50)
    logger.info(f"Email: {circulation_email}")
    logger.info(f"Password: {new_password}")
    logger.info("="*50)


if __name__ == "__main__":
    main()
