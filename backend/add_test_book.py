#!/usr/bin/env python3
"""
Script to add a test book
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
    """Add a test book"""
    logger.info("📚 Adding test book...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Create test book
    book_data = {
        'title': 'Introduction to Library Science',
        'title_ar': 'مقدمة في علم المكتبات',
        'author': 'Dr. Ahmed Al-Balushi',
        'author_ar': 'د. أحمد البلوشي',
        'isbn': '978-99969-0-123-4',
        'shelf_location': 'A1-001',
        'quantity': 5,
        'available_quantity': 4,  # One will be borrowed
        'publisher': 'Ministry of Education Press',
        'publisher_ar': 'دار وزارة التربية والتعليم للنشر',
        'publication_year': 2023,
        'language': 'en',
        'description': 'A comprehensive introduction to library science for students and professionals.',
        'description_ar': 'مقدمة شاملة في علم المكتبات للطلاب والمهنيين.'
    }

    logger.info(f"\n📝 Creating book:")
    logger.info(f"   Title: {book_data['title']}")
    logger.info(f"   Author: {book_data['author']}")
    logger.info(f"   ISBN: {book_data['isbn']}")

    # Insert book
    result = supabase.table('books').insert(book_data).execute()

    if result.data:
        logger.info(f"\n✅ Successfully created book!")
        logger.info(f"   Book ID: {result.data[0]['id']}")
    else:
        logger.error(f"❌ Failed to create book")

    logger.info("\n✨ Book creation completed!")


if __name__ == "__main__":
    main()
