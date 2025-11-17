#!/usr/bin/env python3
"""
Update Book Status Script
Ensures all books have status='available'
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
    """Update all books to have status='available'"""
    logger.info("🔧 Updating book statuses...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Get all books
    logger.info("📚 Fetching all books...")
    response = supabase.table('books').select('id, title, status').execute()

    if not response.data:
        logger.error("❌ No books found in database")
        return

    logger.info(f"✅ Found {len(response.data)} books")

    # Update books that don't have status='available'
    updated_count = 0
    for book in response.data:
        if book['status'] != 'available':
            logger.info(f"📖 Updating '{book['title']}' from '{book['status']}' to 'available'")
            update_response = supabase.table('books').update({
                'status': 'available'
            }).eq('id', book['id']).execute()

            if update_response.data:
                updated_count += 1
            else:
                logger.error(f"❌ Failed to update '{book['title']}'")
        else:
            logger.info(f"✓ '{book['title']}' already has status='available'")

    logger.info("\n" + "="*60)
    logger.info(f"✅ Updated {updated_count} books")
    logger.info(f"📚 Total books: {len(response.data)}")
    logger.info("="*60)

    logger.info("\n✨ Status update complete!")


if __name__ == "__main__":
    main()
