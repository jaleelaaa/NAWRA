#!/usr/bin/env python3
"""
Check librarian password hash
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from supabase import create_client
from app.core.config import settings
import logging
import bcrypt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Check librarian password"""
    logger.info("🔍 Checking librarian password...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    # Get librarian user
    response = supabase.table('users').select('id, email, password_hash').eq('email', 'librarian@nawra.om').execute()

    if not response.data:
        logger.error("❌ No librarian@nawra.om user found!")
        return

    user = response.data[0]
    logger.info(f"\n✉️  Email: {user['email']}")
    logger.info(f"🔒 Password Hash: {user['password_hash']}")

    # Test common passwords
    passwords_to_test = [
        "Admin@123",
        "admin@123",
        "Password@123",
        "Librarian@123",
        "librarian",
        "admin",
    ]

    logger.info("\n🧪 Testing common passwords:")
    for pwd in passwords_to_test:
        try:
            is_match = bcrypt.checkpw(pwd.encode('utf-8'), user['password_hash'].encode('utf-8'))
            if is_match:
                logger.info(f"✅ MATCH FOUND: '{pwd}'")
                return
            else:
                logger.info(f"❌ Not: '{pwd}'")
        except Exception as e:
            logger.error(f"Error testing '{pwd}': {e}")

    logger.info("\n⚠️  No matching password found from common list")
    logger.info("💡 You may need to reset the password")


if __name__ == "__main__":
    main()
