#!/usr/bin/env python3
"""
Verify Books Script
Confirms all books are properly loaded and visible
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
    """Verify all books are properly configured"""
    logger.info("🔍 Verifying book configuration...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Get all books with key fields
    response = supabase.table('books').select(
        'id, title, title_ar, status, category_id, cover_image_url, quantity, available_quantity'
    ).order('created_at', desc=True).execute()

    if not response.data:
        logger.error("❌ No books found in database")
        return

    logger.info(f"\n✅ Found {len(response.data)} books in database\n")
    logger.info("="*80)

    for idx, book in enumerate(response.data, 1):
        logger.info(f"\n📖 Book #{idx}: {book['title']}")
        logger.info(f"   Arabic: {book.get('title_ar', 'N/A')}")
        logger.info(f"   Status: {book.get('status', 'N/A')}")
        logger.info(f"   Quantity: {book.get('quantity', 0)} (Available: {book.get('available_quantity', 0)})")
        logger.info(f"   Category ID: {book.get('category_id', 'N/A')}")
        logger.info(f"   Cover: {book.get('cover_image_url', 'N/A')}")

        # Check for issues
        issues = []
        if not book.get('status'):
            issues.append("Missing status")
        elif book.get('status') != 'available':
            issues.append(f"Status is '{book.get('status')}' (not 'available')")

        if not book.get('category_id'):
            issues.append("Missing category")

        if not book.get('cover_image_url'):
            issues.append("Missing cover image")

        if issues:
            logger.warning(f"   ⚠️  Issues: {', '.join(issues)}")
        else:
            logger.info(f"   ✅ All fields configured correctly")

    logger.info("\n" + "="*80)
    logger.info("\n📊 SUMMARY:")
    logger.info(f"   Total books: {len(response.data)}")

    available_count = sum(1 for book in response.data if book.get('status') == 'available')
    logger.info(f"   Available books: {available_count}")

    with_categories = sum(1 for book in response.data if book.get('category_id'))
    logger.info(f"   Books with categories: {with_categories}")

    with_covers = sum(1 for book in response.data if book.get('cover_image_url'))
    logger.info(f"   Books with cover images: {with_covers}")

    logger.info("\n✨ Verification complete!")
    logger.info("\n📍 View books at: http://localhost:3000/en/admin/catalog")
    logger.info("   (Make sure you're logged in as admin or staff with inventory.read permission)")


if __name__ == "__main__":
    main()
