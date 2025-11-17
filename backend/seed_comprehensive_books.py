#!/usr/bin/env python3
"""
Comprehensive Book Seeding Script
Populates the database with 12 professional books with cover images
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


def get_books_data(categories):
    """
    Generate books data with actual category IDs from database

    Args:
        categories: Dict mapping category names to UUIDs

    Returns:
        List of book dictionaries
    """
    return [
        {
            # 1. History - Arabian History
            "title": "The Arab Awakening",
            "title_ar": "اليقظة العربية",
            "author": "George Antonius",
            "author_ar": "جورج أنطونيوس",
            "isbn": "978-1-84511-568-4",
            "publisher": "Routledge",
            "publisher_ar": "روتليدج",
            "publication_year": 2010,
            "edition": "Reprint Edition",
            "language": "English",
            "description": "A seminal work on the rise of Arab nationalism and the history of the Arab world's struggle for independence. Essential reading for understanding modern Middle Eastern history.",
            "description_ar": "عمل رائد حول صعود القومية العربية وتاريخ نضال العالم العربي من أجل الاستقلال. قراءة أساسية لفهم تاريخ الشرق الأوسط الحديث.",
            "pages": 471,
            "category_id": categories.get("History & Geography"),
            "cover_image_url": "/books/omani-history-development-book-cover.jpg",
            "thumbnail_url": "/books/omani-history-development-book-cover.jpg",
            "shelf_location": "A-HIST-001",
            "quantity": 5,
            "available_quantity": 5,
            "status": "available",
            "keywords": "History, Arab World, Politics, Middle East, Independence"
        },
        {
            # 2. Literature - Classic Fiction
            "title": "One Hundred Years of Solitude",
            "title_ar": "مائة عام من العزلة",
            "author": "Gabriel García Márquez",
            "author_ar": "غابرييل غارسيا ماركيز",
            "isbn": "978-0-06-088328-7",
            "publisher": "Harper Perennial",
            "publisher_ar": "هاربر برينيال",
            "publication_year": 2006,
            "edition": "First Edition",
            "language": "English",
            "description": "A landmark novel in magical realism that tells the multi-generational story of the Buendía family. Winner of the Nobel Prize in Literature.",
            "description_ar": "رواية بارزة في الواقعية السحرية تروي قصة عائلة بوينديا عبر أجيال متعددة. حائزة على جائزة نوبل في الأدب.",
            "pages": 417,
            "category_id": categories.get("Literature"),
            "cover_image_url": "/books/great-gatsby-book-cover.jpg",
            "thumbnail_url": "/books/great-gatsby-book-cover.jpg",
            "shelf_location": "B-LIT-045",
            "quantity": 8,
            "available_quantity": 8,
            "status": "available",
            "keywords": "Fiction, Classic, Literature, Magic Realism, Nobel Prize"
        },
        {
            # 3. Social Sciences - Business & Economics
            "title": "Thinking, Fast and Slow",
            "title_ar": "التفكير، السريع والبطيء",
            "author": "Daniel Kahneman",
            "author_ar": "دانيال كانيمان",
            "isbn": "978-0-374-53355-7",
            "publisher": "Farrar, Straus and Giroux",
            "publisher_ar": "فارار، شتراوس وجيرو",
            "publication_year": 2011,
            "edition": "First Edition",
            "language": "English",
            "description": "A groundbreaking exploration of the two systems that drive the way we think. Essential for understanding decision-making and behavioral economics.",
            "description_ar": "استكشاف رائد للنظامين اللذين يحركان طريقة تفكيرنا. ضروري لفهم صنع القرار والاقتصاد السلوكي.",
            "pages": 499,
            "category_id": categories.get("Social Sciences"),
            "cover_image_url": "/books/trade-commerce-business-guide-oman-economy.jpg",
            "thumbnail_url": "/books/trade-commerce-business-guide-oman-economy.jpg",
            "shelf_location": "C-SOC-112",
            "quantity": 6,
            "available_quantity": 6,
            "status": "available",
            "keywords": "Psychology, Economics, Decision Making, Behavioral Science, Nobel Prize"
        },
        {
            # 4. Science - Physics
            "title": "A Brief History of Time",
            "title_ar": "تاريخ موجز للزمن",
            "author": "Stephen Hawking",
            "author_ar": "ستيفن هوكينج",
            "isbn": "978-0-553-38016-3",
            "publisher": "Bantam Books",
            "publisher_ar": "بانتام بوكس",
            "publication_year": 1998,
            "edition": "Updated and Expanded",
            "language": "English",
            "description": "An exploration of cosmology, black holes, and the nature of time by one of the greatest physicists of our era. A bestselling science classic.",
            "description_ar": "استكشاف لعلم الكونيات والثقوب السوداء وطبيعة الزمن من قبل أحد أعظم الفيزيائيين في عصرنا. من أفضل الكتب العلمية مبيعاً.",
            "pages": 212,
            "category_id": categories.get("Science"),
            "cover_image_url": "/books/foundation-asimov-science-fiction.jpg",
            "thumbnail_url": "/books/foundation-asimov-science-fiction.jpg",
            "shelf_location": "D-SCI-078",
            "quantity": 7,
            "available_quantity": 7,
            "status": "available",
            "keywords": "Physics, Cosmology, Science, Black Holes, Time"
        },
        {
            # 5. Technology - Computing
            "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
            "title_ar": "الكود النظيف: دليل براعة البرمجيات الرشيقة",
            "author": "Robert C. Martin",
            "author_ar": "روبرت سي مارتن",
            "isbn": "978-0-13-235088-4",
            "publisher": "Prentice Hall",
            "publisher_ar": "برنتيس هول",
            "publication_year": 2008,
            "edition": "First Edition",
            "language": "English",
            "description": "The definitive guide to writing clean, maintainable code. A must-read for software developers and computer science students.",
            "description_ar": "الدليل النهائي لكتابة كود نظيف وقابل للصيانة. قراءة ضرورية لمطوري البرمجيات وطلاب علوم الحاسوب.",
            "pages": 464,
            "category_id": categories.get("Technology"),
            "cover_image_url": "/books/medical-encyclopedia-healthcare-reference-book.jpg",
            "thumbnail_url": "/books/medical-encyclopedia-healthcare-reference-book.jpg",
            "shelf_location": "E-TECH-201",
            "quantity": 10,
            "available_quantity": 10,
            "status": "available",
            "keywords": "Programming, Software Development, Clean Code, Best Practices, Technology"
        },
        {
            # 6. Philosophy - Eastern Philosophy
            "title": "The Art of War",
            "title_ar": "فن الحرب",
            "author": "Sun Tzu",
            "author_ar": "سون تزو",
            "isbn": "978-1-59030-943-7",
            "publisher": "Shambhala",
            "publisher_ar": "شامبالا",
            "publication_year": 2005,
            "edition": "Deluxe Edition",
            "language": "English",
            "description": "An ancient Chinese military treatise on strategy, tactics, and philosophy. Widely applied in business, politics, and life.",
            "description_ar": "رسالة صينية قديمة عن الإستراتيجية والتكتيكات والفلسفة العسكرية. تطبق على نطاق واسع في الأعمال والسياسة والحياة.",
            "pages": 272,
            "category_id": categories.get("Philosophy & Psychology"),
            "cover_image_url": "/books/kahlil-gibran-the-prophet-arabic-literature.jpg",
            "thumbnail_url": "/books/kahlil-gibran-the-prophet-arabic-literature.jpg",
            "shelf_location": "F-PHIL-034",
            "quantity": 5,
            "available_quantity": 5,
            "status": "available",
            "keywords": "Philosophy, Strategy, Military, Classic, Chinese Philosophy"
        },
        {
            # 7. Arts & Recreation - Photography & Design
            "title": "The Photographer's Eye: Composition and Design",
            "title_ar": "عين المصور: التكوين والتصميم",
            "author": "Michael Freeman",
            "author_ar": "مايكل فريمان",
            "isbn": "978-0-240-80935-8",
            "publisher": "Focal Press",
            "publisher_ar": "فوكال برس",
            "publication_year": 2007,
            "edition": "First Edition",
            "language": "English",
            "description": "A comprehensive guide to photographic composition and visual design. Essential for photographers and visual artists.",
            "description_ar": "دليل شامل للتكوين الفوتوغرافي والتصميم البصري. ضروري للمصورين والفنانين البصريين.",
            "pages": 192,
            "category_id": categories.get("Arts & Recreation"),
            "cover_image_url": "/books/oman-heritage-culture-traditional-architecture.jpg",
            "thumbnail_url": "/books/oman-heritage-culture-traditional-architecture.jpg",
            "shelf_location": "G-ART-156",
            "quantity": 4,
            "available_quantity": 4,
            "status": "available",
            "keywords": "Photography, Art, Design, Composition, Visual Arts"
        },
        {
            # 8. Religion - Islamic Studies
            "title": "The Study Quran: A New Translation and Commentary",
            "title_ar": "القرآن الدراسي: ترجمة وتفسير جديد",
            "author": "Seyyed Hossein Nasr",
            "author_ar": "سيد حسين نصر",
            "isbn": "978-0-06-112586-7",
            "publisher": "HarperOne",
            "publisher_ar": "هاربر وان",
            "publication_year": 2015,
            "edition": "First Edition",
            "language": "English",
            "description": "A landmark scholarly translation and commentary of the Quran. Includes extensive theological and historical notes.",
            "description_ar": "ترجمة وتفسير علمي بارز للقرآن الكريم. يتضمن ملاحظات لاهوتية وتاريخية واسعة.",
            "pages": 1988,
            "category_id": categories.get("Religion"),
            "cover_image_url": "/books/arabian-nights-one-thousand-and-one-nights-classic.jpg",
            "thumbnail_url": "/books/arabian-nights-one-thousand-and-one-nights-classic.jpg",
            "shelf_location": "H-REL-089",
            "quantity": 8,
            "available_quantity": 8,
            "status": "available",
            "keywords": "Religion, Islam, Quran, Theology, Islamic Studies"
        },
        {
            # 9. Language - Linguistics
            "title": "The Power of Babel: A Natural History of Language",
            "title_ar": "قوة بابل: تاريخ طبيعي للغة",
            "author": "John McWhorter",
            "author_ar": "جون ماكوورتر",
            "isbn": "978-0-06-052085-0",
            "publisher": "Harper Perennial",
            "publisher_ar": "هاربر برينيال",
            "publication_year": 2003,
            "edition": "First Edition",
            "language": "English",
            "description": "An exploration of how languages evolve, change, and die. A fascinating journey through the world's linguistic diversity.",
            "description_ar": "استكشاف لكيفية تطور اللغات وتغيرها وانقراضها. رحلة رائعة عبر التنوع اللغوي في العالم.",
            "pages": 327,
            "category_id": categories.get("Language"),
            "cover_image_url": "/books/modern-arabic-literature-critical-analysis-study.jpg",
            "thumbnail_url": "/books/modern-arabic-literature-critical-analysis-study.jpg",
            "shelf_location": "I-LANG-023",
            "quantity": 5,
            "available_quantity": 5,
            "status": "available",
            "keywords": "Linguistics, Language, Evolution, Communication, Anthropology"
        },
        {
            # 10. General Works - Encyclopedia & Reference
            "title": "The New Oxford American Dictionary",
            "title_ar": "قاموس أكسفورد الأمريكي الجديد",
            "author": "Oxford University Press",
            "author_ar": "مطبعة جامعة أكسفورد",
            "isbn": "978-0-19-539288-3",
            "publisher": "Oxford University Press",
            "publisher_ar": "مطبعة جامعة أكسفورد",
            "publication_year": 2010,
            "edition": "Third Edition",
            "language": "English",
            "description": "The most comprehensive and authoritative American English dictionary. Over 350,000 words with detailed definitions.",
            "description_ar": "القاموس الإنجليزي الأمريكي الأكثر شمولاً وموثوقية. أكثر من 350،000 كلمة مع تعريفات مفصلة.",
            "pages": 2096,
            "category_id": categories.get("General Works"),
            "cover_image_url": "/books/environmental-conservation-nature-wildlife-oman-de.jpg",
            "thumbnail_url": "/books/environmental-conservation-nature-wildlife-oman-de.jpg",
            "shelf_location": "J-REF-001",
            "quantity": 3,
            "available_quantity": 3,
            "status": "available",
            "keywords": "Reference, Dictionary, Language, English, Oxford"
        },
        {
            # 11. Literature - Classic Dystopian
            "title": "1984",
            "title_ar": "1984",
            "author": "George Orwell",
            "author_ar": "جورج أورويل",
            "isbn": "978-0-452-28423-4",
            "publisher": "Signet Classic",
            "publisher_ar": "سيجنت كلاسيك",
            "publication_year": 1961,
            "edition": "Mass Market Paperback",
            "language": "English",
            "description": "A dystopian masterpiece about totalitarianism, surveillance, and the manipulation of truth. One of the most influential novels of the 20th century.",
            "description_ar": "تحفة بائسة عن الشمولية والمراقبة والتلاعب بالحقيقة. واحدة من أكثر الروايات تأثيراً في القرن العشرين.",
            "pages": 328,
            "category_id": categories.get("Literature"),
            "cover_image_url": "/books/1984-dystopian-novel.jpg",
            "thumbnail_url": "/books/1984-dystopian-novel.jpg",
            "shelf_location": "B-LIT-089",
            "quantity": 12,
            "available_quantity": 12,
            "status": "available",
            "keywords": "Fiction, Dystopian, Classic, Politics, Literature"
        },
        {
            # 12. History & Geography - Oman Specific
            "title": "Oman: Politics and Society in the Qaboos State",
            "title_ar": "عمان: السياسة والمجتمع في دولة قابوس",
            "author": "Marc Valeri",
            "author_ar": "مارك فاليري",
            "isbn": "978-1-84904-414-1",
            "publisher": "Hurst Publishers",
            "publisher_ar": "ناشرو هيرست",
            "publication_year": 2013,
            "edition": "First Edition",
            "language": "English",
            "description": "A comprehensive analysis of Oman's political development and social transformation under Sultan Qaboos. Essential for understanding modern Omani society.",
            "description_ar": "تحليل شامل للتطور السياسي والتحول الاجتماعي في عمان تحت حكم السلطان قابوس. ضروري لفهم المجتمع العماني الحديث.",
            "pages": 352,
            "category_id": categories.get("History & Geography"),
            "cover_image_url": "/books/oman-geography-demographics-maps-statistics.jpg",
            "thumbnail_url": "/books/oman-geography-demographics-maps-statistics.jpg",
            "shelf_location": "A-HIST-223",
            "quantity": 6,
            "available_quantity": 6,
            "status": "available",
            "keywords": "History, Oman, Politics, Gulf States, Middle East, Society"
        }
    ]


def main():
    """Seed comprehensive book collection"""
    logger.info("📚 Starting comprehensive book seeding...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Fetch category IDs from database
    logger.info("📁 Fetching categories from database...")
    categories_response = supabase.table('categories').select('id,name').execute()

    if not categories_response.data:
        logger.error("❌ No categories found in database. Please run migrations first.")
        return

    # Create category name -> ID mapping
    categories = {cat['name']: cat['id'] for cat in categories_response.data}
    logger.info(f"✅ Found {len(categories)} categories")

    # Get books data with actual category IDs
    BOOKS = get_books_data(categories)

    # Check existing books
    existing_response = supabase.table('books').select('title').execute()
    existing_count = len(existing_response.data) if existing_response.data else 0
    logger.info(f"📊 Current books in database: {existing_count}")

    # Seed each book
    seeded_count = 0
    failed_count = 0

    for idx, book_data in enumerate(BOOKS, 1):
        try:
            logger.info(f"\n📖 [{idx}/{len(BOOKS)}] Seeding: {book_data['title']}")
            logger.info(f"   Arabic: {book_data['title_ar']}")
            logger.info(f"   Author: {book_data['author']}")
            logger.info(f"   Cover: {book_data['cover_image_url']}")

            # Check if book already exists (by ISBN)
            check_response = supabase.table('books').select('id').eq('isbn', book_data['isbn']).execute()

            if check_response.data and len(check_response.data) > 0:
                logger.info(f"   ⏭️  Book already exists (ISBN: {book_data['isbn']}), skipping...")
                continue

            # Insert book
            insert_response = supabase.table('books').insert(book_data).execute()

            if insert_response.data:
                seeded_count += 1
                logger.info(f"   ✅ Successfully seeded!")
            else:
                failed_count += 1
                logger.error(f"   ❌ Failed to seed (no data returned)")

        except Exception as e:
            failed_count += 1
            logger.error(f"   ❌ Error seeding book: {str(e)}")

    # Final summary
    logger.info("\n" + "="*60)
    logger.info("📊 SEEDING SUMMARY")
    logger.info("="*60)
    logger.info(f"✅ Successfully seeded: {seeded_count} books")
    logger.info(f"❌ Failed: {failed_count} books")
    logger.info(f"📚 Total books in database: {existing_count + seeded_count}")
    logger.info("="*60)

    # Verify final count
    final_response = supabase.table('books').select('id, title, title_ar').execute()
    if final_response.data:
        logger.info(f"\n📋 All books in database ({len(final_response.data)}):")
        for book in final_response.data:
            logger.info(f"   • {book['title']} ({book['title_ar']})")

    logger.info("\n✨ Book seeding complete!")


if __name__ == "__main__":
    main()
