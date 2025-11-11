#!/usr/bin/env python3
"""
Script to delete test users from the database for cleanup
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from supabase import create_client, Client
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Users to delete
USERS_TO_DELETE = [
    "librarian@ministry.om",
    "admin@nawra.om",
    "cataloger@ministry.om",
    "circulation@ministry.om",
    "patron@test.om"
]


def get_supabase_client() -> Client:
    """Create and return a Supabase client"""
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return supabase


def delete_user(supabase: Client, email: str) -> bool:
    """Delete a user from the database"""
    try:
        # First fetch the user to confirm they exist
        user_response = supabase.table('users').select('id, email').eq('email', email).execute()

        if not user_response.data:
            logger.info(f"⚠️  User '{email}' not found - skipping")
            return True

        user_id = user_response.data[0]['id']

        # Delete the user
        delete_response = supabase.table('users').delete().eq('id', user_id).execute()

        logger.info(f"✅ Deleted user: {email} (ID: {user_id})")
        return True

    except Exception as e:
        logger.error(f"Error deleting user {email}: {e}")
        return False


def main():
    """Main function to cleanup users"""
    logger.info("🧹 Starting user cleanup script...")
    logger.info(f"📦 Database URL: {settings.SUPABASE_URL}")

    # Get Supabase client
    supabase = get_supabase_client()

    # Delete users
    logger.info(f"\n🗑️  Deleting {len(USERS_TO_DELETE)} users...")
    deleted_count = 0
    failed_count = 0

    for email in USERS_TO_DELETE:
        if delete_user(supabase, email):
            deleted_count += 1
        else:
            failed_count += 1

    # Summary
    logger.info(f"\n📊 Summary:")
    logger.info(f"  ✅ Successfully deleted: {deleted_count} users")
    if failed_count > 0:
        logger.info(f"  ❌ Failed: {failed_count} users")

    logger.info("\n✨ Cleanup completed!")


if __name__ == "__main__":
    main()
