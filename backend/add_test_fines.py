#!/usr/bin/env python3
"""
Script to add test fines for testing fine collection
"""
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from supabase import create_client
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Add test fines to circulation records"""
    logger.info("🔧 Adding test fines to circulation records...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Get a test patron user
    patron_response = supabase.table('users').select('id, email, full_name').eq('email', 'patron@ministry.om').execute()

    if not patron_response.data:
        logger.error("❌ Patron user not found!")
        return

    patron = patron_response.data[0]
    logger.info(f"✅ Found patron: {patron['full_name']} ({patron['email']})")

    # Get a test book
    book_response = supabase.table('books').select('id, title').limit(1).execute()

    if not book_response.data:
        logger.error("❌ No books found!")
        return

    book = book_response.data[0]
    logger.info(f"✅ Found book: {book['title']}")

    # Create an overdue circulation record
    issue_date = datetime.now() - timedelta(days=25)  # Issued 25 days ago
    due_date = datetime.now() - timedelta(days=10)    # Due 10 days ago (overdue)

    fine_amount = 10 * 0.5  # 10 days overdue at 0.5 OMR per day = 5.0 OMR

    circulation_data = {
        'user_id': patron['id'],
        'book_id': book['id'],
        'issue_date': issue_date.date().isoformat(),
        'due_date': due_date.date().isoformat(),
        'return_date': None,  # Not returned yet
        'fine_amount': fine_amount,
        'fine_paid': False,
        'book_condition': 'good',
        'notes': 'Test overdue record with fine for testing'
    }

    logger.info(f"\n📝 Creating overdue circulation record:")
    logger.info(f"   Patron: {patron['full_name']}")
    logger.info(f"   Book: {book['title']}")
    logger.info(f"   Issue Date: {issue_date.date()}")
    logger.info(f"   Due Date: {due_date.date()}")
    logger.info(f"   Days Overdue: 10")
    logger.info(f"   Fine Amount: OMR {fine_amount:.3f}")

    # Insert circulation record
    result = supabase.table('circulation_records').insert(circulation_data).execute()

    if result.data:
        logger.info(f"\n✅ Successfully created overdue record with fine!")
        logger.info(f"   Record ID: {result.data[0]['id']}")
        logger.info(f"   Fine: OMR {fine_amount:.3f}")
        logger.info(f"\n🎯 You can now test fine collection for user: {patron['email']}")
    else:
        logger.error(f"❌ Failed to create circulation record")

    logger.info("\n✨ Test data setup completed!")


if __name__ == "__main__":
    main()
