#!/usr/bin/env python3
"""
Reset librarian password to 'librarian' for demo
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
    """Reset librarian password"""
    logger.info("🔧 Resetting librarian password...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    # Get librarian user
    response = supabase.table('users').select('id, email').eq('email', 'librarian@nawra.om').execute()

    if not response.data:
        logger.error("❌ No librarian@nawra.om user found!")
        return

    user = response.data[0]
    logger.info(f"\n✉️  Found user: {user['email']}")

    # Hash the new password 'librarian'
    new_password = 'librarian'
    password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    logger.info(f"🔑 New password will be: '{new_password}'")
    logger.info(f"🔒 Generated hash: {password_hash[:50]}...")

    # Update the password
    update_response = supabase.table('users').update({
        'password_hash': password_hash
    }).eq('id', user['id']).execute()

    if update_response.data:
        logger.info(f"\n✅ Password successfully reset!")
        logger.info(f"📧 Email: librarian@nawra.om")
        logger.info(f"🔑 Password: librarian")
    else:
        logger.error("❌ Failed to update password")


if __name__ == "__main__":
    main()
