#!/usr/bin/env python3
"""
Fix Introduction to Library Science Book
Adds category and cover image
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
    """Fix Introduction to Library Science book"""
    logger.info("🔧 Fixing 'Introduction to Library Science' book...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Get General Works category
    logger.info("📁 Fetching 'General Works' category...")
    category_response = supabase.table('categories').select('id,name').eq('name', 'General Works').execute()

    if not category_response.data or len(category_response.data) == 0:
        logger.error("❌ 'General Works' category not found")
        return

    category_id = category_response.data[0]['id']
    logger.info(f"✅ Found category: General Works (ID: {category_id})")

    # Get the book
    logger.info("\n📚 Fetching 'Introduction to Library Science' book...")
    book_response = supabase.table('books').select('id,title,title_ar').eq('title', 'Introduction to Library Science').execute()

    if not book_response.data or len(book_response.data) == 0:
        logger.error("❌ Book not found")
        return

    book = book_response.data[0]
    book_id = book['id']
    logger.info(f"✅ Found book: {book['title']} ({book['title_ar']})")

    # Update the book with category and cover image
    logger.info("\n📝 Updating book with category and cover image...")
    update_response = supabase.table('books').update({
        'category_id': category_id,
        'cover_image_url': '/books/medical-encyclopedia-healthcare-reference-book.jpg',
        'thumbnail_url': '/books/medical-encyclopedia-healthcare-reference-book.jpg'
    }).eq('id', book_id).execute()

    if update_response.data:
        logger.info("✅ Book updated successfully!")

        # Verify the update
        verify_response = supabase.table('books').select(
            'id, title, title_ar, category_id, cover_image_url, status'
        ).eq('id', book_id).execute()

        if verify_response.data:
            updated_book = verify_response.data[0]
            logger.info("\n" + "="*60)
            logger.info("📖 UPDATED BOOK DETAILS:")
            logger.info("="*60)
            logger.info(f"Title: {updated_book['title']}")
            logger.info(f"Arabic: {updated_book['title_ar']}")
            logger.info(f"Category ID: {updated_book['category_id']}")
            logger.info(f"Cover Image: {updated_book['cover_image_url']}")
            logger.info(f"Status: {updated_book['status']}")
            logger.info("="*60)
    else:
        logger.error("❌ Failed to update book")

    logger.info("\n✨ Update complete!")


if __name__ == "__main__":
    main()
