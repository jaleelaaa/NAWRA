#!/usr/bin/env python3
"""
Upload Book Cover to Supabase Storage

This script uploads a single image file to the Supabase Storage bucket 'book-covers'
and returns the public URL for use in the book form.

Usage:
    python upload_book_cover.py path/to/image.jpg
    python upload_book_cover.py path/to/image.jpg --folder fiction
    python upload_book_cover.py path/to/image.jpg --name custom-name.jpg
"""

import sys
import os
from pathlib import Path
import argparse
from app.db.supabase_client import get_supabase
from app.core.config import settings


def upload_book_cover(file_path: str, folder: str = "", custom_name: str = None) -> str:
    """
    Upload a book cover image to Supabase Storage.

    Args:
        file_path: Path to the image file
        folder: Optional folder within the bucket (e.g., 'fiction', 'arabic')
        custom_name: Optional custom filename (uses original if not provided)

    Returns:
        Public URL of the uploaded image
    """
    # Validate file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    # Get file info
    file_size = os.path.getsize(file_path)
    file_name = custom_name or Path(file_path).name

    # Check file size (max 5MB recommended for covers)
    max_size = 5 * 1024 * 1024  # 5MB
    if file_size > max_size:
        raise ValueError(f"File size ({file_size / 1024 / 1024:.2f}MB) exceeds maximum ({max_size / 1024 / 1024}MB)")

    # Validate image extension
    valid_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
    if Path(file_name).suffix.lower() not in valid_extensions:
        raise ValueError(f"Invalid file type. Supported: {', '.join(valid_extensions)}")

    # Build storage path
    storage_path = f"{folder}/{file_name}" if folder else file_name

    print(f"📤 Uploading: {file_path}")
    print(f"📦 To bucket: book-covers/{storage_path}")
    print(f"📊 File size: {file_size / 1024:.2f} KB")

    # Get Supabase client
    supabase = get_supabase()

    # Read file
    with open(file_path, 'rb') as f:
        file_data = f.read()

    try:
        # Upload to Supabase Storage
        response = supabase.storage.from_('book-covers').upload(
            path=storage_path,
            file=file_data,
            file_options={
                "content-type": f"image/{Path(file_name).suffix.lstrip('.')}"
            }
        )

        # Get public URL
        public_url_response = supabase.storage.from_('book-covers').get_public_url(storage_path)
        public_url = public_url_response

        print(f"\n✅ Upload successful!")
        print(f"🔗 Public URL: {public_url}")
        print(f"\n📝 Copy this URL to the 'Cover Image URL' field in the book form.")

        return public_url

    except Exception as e:
        error_msg = str(e)

        # Handle common errors
        if "already exists" in error_msg.lower():
            print(f"\n⚠️  File already exists: {storage_path}")

            # Attempt to get existing URL
            try:
                public_url = supabase.storage.from_('book-covers').get_public_url(storage_path)
                print(f"🔗 Existing URL: {public_url}")
                return public_url
            except:
                pass

            raise ValueError(f"File '{storage_path}' already exists. Use --name to specify a different name.")

        elif "bucket not found" in error_msg.lower():
            raise ValueError(
                "Storage bucket 'book-covers' not found. "
                "Please create it in Supabase Dashboard (Storage → New Bucket)."
            )

        elif "not allowed" in error_msg.lower() or "permission" in error_msg.lower():
            raise ValueError(
                "Permission denied. Please check:\n"
                "1. Storage bucket 'book-covers' exists\n"
                "2. Bucket policies allow uploads\n"
                "3. SUPABASE_SERVICE_KEY is set correctly in .env"
            )

        else:
            raise Exception(f"Upload failed: {error_msg}")


def main():
    parser = argparse.ArgumentParser(
        description='Upload book cover image to Supabase Storage',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python upload_book_cover.py image.jpg
  python upload_book_cover.py image.jpg --folder fiction
  python upload_book_cover.py image.jpg --name great-gatsby.jpg
  python upload_book_cover.py image.jpg --folder arabic --name nizar-qabbani.jpg
        """
    )

    parser.add_argument('file', help='Path to the image file')
    parser.add_argument('--folder', '-f', default='', help='Folder within bucket (e.g., fiction, arabic)')
    parser.add_argument('--name', '-n', help='Custom filename (default: original filename)')

    args = parser.parse_args()

    try:
        # Check Supabase configuration
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            print("❌ Error: Supabase not configured!")
            print("Please set SUPABASE_URL and SUPABASE_KEY in backend/.env")
            sys.exit(1)

        # Upload file
        public_url = upload_book_cover(args.file, args.folder, args.name)

        # Return URL for scripting
        return public_url

    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

    except ValueError as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
