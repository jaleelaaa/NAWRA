#!/usr/bin/env python3
"""
Bulk Upload Book Covers to Supabase Storage

This script uploads multiple image files from a folder to the Supabase Storage bucket.
It can optionally organize them into subfolders and generate a CSV mapping file.

Usage:
    python bulk_upload_covers.py /path/to/covers/folder
    python bulk_upload_covers.py /path/to/covers --folder fiction
    python bulk_upload_covers.py /path/to/covers --csv output.csv
"""

import sys
import os
from pathlib import Path
import argparse
import csv
from typing import List, Dict
from app.db.supabase_client import get_supabase
from app.core.config import settings


def get_image_files(directory: str) -> List[Path]:
    """Get all image files from directory."""
    valid_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
    directory_path = Path(directory)

    if not directory_path.exists():
        raise FileNotFoundError(f"Directory not found: {directory}")

    if not directory_path.is_dir():
        raise ValueError(f"Not a directory: {directory}")

    image_files = [
        f for f in directory_path.iterdir()
        if f.is_file() and f.suffix.lower() in valid_extensions
    ]

    return sorted(image_files)


def upload_file(supabase, file_path: Path, folder: str = "") -> Dict:
    """Upload a single file and return result."""
    file_name = file_path.name
    storage_path = f"{folder}/{file_name}" if folder else file_name
    file_size = file_path.stat().st_size

    # Check size limit (5MB)
    max_size = 5 * 1024 * 1024
    if file_size > max_size:
        return {
            'file': file_name,
            'status': 'skipped',
            'reason': f'File too large ({file_size / 1024 / 1024:.2f}MB > 5MB)',
            'url': None
        }

    try:
        # Read file
        with open(file_path, 'rb') as f:
            file_data = f.read()

        # Upload
        supabase.storage.from_('book-covers').upload(
            path=storage_path,
            file=file_data,
            file_options={
                "content-type": f"image/{file_path.suffix.lstrip('.')}"
            }
        )

        # Get public URL
        public_url = supabase.storage.from_('book-covers').get_public_url(storage_path)

        return {
            'file': file_name,
            'status': 'success',
            'reason': 'Uploaded',
            'url': public_url,
            'size_kb': file_size / 1024
        }

    except Exception as e:
        error_msg = str(e)

        # Check if file already exists
        if "already exists" in error_msg.lower():
            # Get existing URL
            try:
                public_url = supabase.storage.from_('book-covers').get_public_url(storage_path)
                return {
                    'file': file_name,
                    'status': 'exists',
                    'reason': 'Already exists',
                    'url': public_url,
                    'size_kb': file_size / 1024
                }
            except:
                pass

        return {
            'file': file_name,
            'status': 'error',
            'reason': str(e),
            'url': None
        }


def bulk_upload(directory: str, folder: str = "", csv_output: str = None) -> Dict:
    """
    Upload all images from directory.

    Returns:
        Dictionary with upload statistics and results
    """
    print(f"📂 Scanning directory: {directory}")

    # Get all image files
    image_files = get_image_files(directory)

    if not image_files:
        print("⚠️  No image files found in directory")
        return {'total': 0, 'results': []}

    print(f"📸 Found {len(image_files)} image files")

    if folder:
        print(f"📁 Uploading to folder: book-covers/{folder}/")
    else:
        print(f"📁 Uploading to: book-covers/")

    # Get Supabase client
    supabase = get_supabase()

    # Upload each file
    results = []
    success_count = 0
    error_count = 0
    exists_count = 0
    skipped_count = 0

    print(f"\n{'='*70}")
    print("Starting upload...")
    print(f"{'='*70}\n")

    for i, file_path in enumerate(image_files, 1):
        print(f"[{i}/{len(image_files)}] {file_path.name}...", end=' ')

        result = upload_file(supabase, file_path, folder)
        results.append(result)

        if result['status'] == 'success':
            print("✅ Uploaded")
            success_count += 1
        elif result['status'] == 'exists':
            print("⚠️  Already exists")
            exists_count += 1
        elif result['status'] == 'skipped':
            print(f"⏭️  Skipped ({result['reason']})")
            skipped_count += 1
        else:
            print(f"❌ Error: {result['reason']}")
            error_count += 1

    # Print summary
    print(f"\n{'='*70}")
    print("Upload Summary")
    print(f"{'='*70}")
    print(f"Total files:      {len(image_files)}")
    print(f"✅ Uploaded:      {success_count}")
    print(f"⚠️  Already exist: {exists_count}")
    print(f"⏭️  Skipped:       {skipped_count}")
    print(f"❌ Errors:        {error_count}")
    print(f"{'='*70}\n")

    # Save to CSV if requested
    if csv_output:
        save_to_csv(results, csv_output)
        print(f"📄 Results saved to: {csv_output}\n")

    return {
        'total': len(image_files),
        'success': success_count,
        'exists': exists_count,
        'skipped': skipped_count,
        'errors': error_count,
        'results': results
    }


def save_to_csv(results: List[Dict], output_file: str):
    """Save upload results to CSV file."""
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['file', 'status', 'url', 'size_kb', 'reason'])
        writer.writeheader()
        writer.writerows(results)


def main():
    parser = argparse.ArgumentParser(
        description='Bulk upload book cover images to Supabase Storage',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Upload all images from a folder
  python bulk_upload_covers.py /path/to/covers

  # Upload to a specific subfolder
  python bulk_upload_covers.py /path/to/covers --folder fiction

  # Generate CSV mapping file
  python bulk_upload_covers.py /path/to/covers --csv results.csv

  # Combine options
  python bulk_upload_covers.py /path/to/arabic-books --folder arabic --csv arabic-results.csv
        """
    )

    parser.add_argument('directory', help='Directory containing image files')
    parser.add_argument('--folder', '-f', default='', help='Subfolder in bucket (e.g., fiction, arabic)')
    parser.add_argument('--csv', '-c', help='Output CSV file with results and URLs')

    args = parser.parse_args()

    try:
        # Check Supabase configuration
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            print("❌ Error: Supabase not configured!")
            print("Please set SUPABASE_URL and SUPABASE_KEY in backend/.env")
            sys.exit(1)

        # Perform bulk upload
        result = bulk_upload(args.directory, args.folder, args.csv)

        # Exit with error code if any uploads failed
        if result['errors'] > 0:
            sys.exit(1)

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
