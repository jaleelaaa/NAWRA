#!/usr/bin/env python3
"""
Script to update patron user's Arabic name
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
    """Update patron user's Arabic name"""
    logger.info("🔍 Checking patron user...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Get patron user
    response = supabase.table('users').select('*').eq('email', 'patron@nawra.om').execute()

    if not response.data:
        logger.error("❌ Patron user not found!")
        return

    user = response.data[0]

    logger.info("\n📋 Current patron user data:")
    logger.info("="*80)
    logger.info(f"Email: {user['email']}")
    logger.info(f"Full Name: {user['full_name']}")
    logger.info(f"Arabic Name: {user.get('arabic_name', '(not set)')}")
    logger.info("="*80)

    # Update Arabic name if not set
    if not user.get('arabic_name'):
        logger.info("\n🔧 Setting Arabic name for patron user...")

        update_response = supabase.table('users').update({
            'arabic_name': 'المستخدم التجريبي'
        }).eq('id', user['id']).execute()

        if update_response.data:
            logger.info("✅ Arabic name updated successfully!")
            logger.info(f"   New Arabic name: المستخدم التجريبي")
        else:
            logger.error("❌ Failed to update Arabic name")
    else:
        logger.info(f"\n✅ Arabic name already set: {user['arabic_name']}")

    logger.info("\n✨ Done!")


if __name__ == "__main__":
    main()
