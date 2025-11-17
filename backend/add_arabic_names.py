#!/usr/bin/env python3
"""
Add Arabic names to existing users
Note: The arabic_name column must be added manually in Supabase SQL Editor first
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
    """Add Arabic names to users"""
    logger.info("🔧 Adding Arabic names to users...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # User Arabic names mapping
    user_arabic_names = {
        'admin@ministry.om': 'مسؤول النظام',
        'admin@nawra.om': 'مسؤول النظام',
        'librarian@ministry.om': 'أمين مكتبة تجريبي',
        'circulation@ministry.om': 'موظف تداول تجريبي',
        'cataloger@ministry.om': 'أمين فهرسة تجريبي',
        'patron@ministry.om': 'مستفيد تجريبي',
        'patron@test.om': 'مستفيد المكتبة',
        'system@nawra.om': 'مستخدم النظام الافتراضي',
    }

    logger.info(f"Updating {len(user_arabic_names)} users...")

    for email, arabic_name in user_arabic_names.items():
        try:
            result = supabase.table('users').update({
                'arabic_name': arabic_name
            }).eq('email', email).execute()

            if result.data:
                logger.info(f"✅ Updated {email}: {arabic_name}")
            else:
                logger.warning(f"⚠️ User not found: {email}")

        except Exception as e:
            logger.error(f"❌ Failed to update {email}: {str(e)}")

    logger.info("=" * 60)
    logger.info("✅ Arabic names update completed!")
    logger.info("Note: Make sure arabic_name column exists in database")


if __name__ == "__main__":
    main()
