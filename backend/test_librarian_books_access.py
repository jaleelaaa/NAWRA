#!/usr/bin/env python3
"""
Test librarian access to books endpoint
"""
import sys
from pathlib import Path
import httpx
import asyncio

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_librarian_access():
    """Test librarian books access"""
    logger.info("🔍 Testing librarian access to books endpoint...")

    base_url = "http://localhost:8000/api/v1"

    async with httpx.AsyncClient() as client:
        # Step 1: Login as librarian
        logger.info("\n1️⃣  Logging in as librarian@nawra.om...")
        login_response = await client.post(
            f"{base_url}/auth/login",
            json={
                "email": "librarian@nawra.om",
                "password": "Admin@123"
            }
        )

        if login_response.status_code != 200:
            logger.error(f"❌ Login failed: {login_response.status_code}")
            logger.error(f"Response: {login_response.text}")
            return

        login_data = login_response.json()
        access_token = login_data.get("access_token")
        user_info = login_data.get("user", {})

        logger.info(f"✅ Login successful!")
        logger.info(f"   User: {user_info.get('email')}")
        logger.info(f"   Role: {user_info.get('role_name')}")
        logger.info(f"   Permissions: {user_info.get('permissions')}")
        logger.info(f"   Token: {access_token[:50]}...")

        # Step 2: Try to access books endpoint
        logger.info("\n2️⃣  Accessing books endpoint...")
        books_response = await client.get(
            f"{base_url}/books?page=1&page_size=12",
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )

        logger.info(f"\n📊 Books endpoint response:")
        logger.info(f"   Status: {books_response.status_code}")

        if books_response.status_code == 200:
            logger.info("✅ SUCCESS! Librarian can access books endpoint")
            books_data = books_response.json()
            logger.info(f"   Total books: {books_data.get('total', 0)}")
            logger.info(f"   Books returned: {len(books_data.get('books', []))}")
        elif books_response.status_code == 403:
            logger.error("❌ 403 FORBIDDEN - Permission denied")
            logger.error(f"   Response: {books_response.text}")
        elif books_response.status_code == 401:
            logger.error("❌ 401 UNAUTHORIZED - Authentication failed")
            logger.error(f"   Response: {books_response.text}")
        else:
            logger.error(f"❌ Unexpected status code: {books_response.status_code}")
            logger.error(f"   Response: {books_response.text}")


if __name__ == "__main__":
    asyncio.run(test_librarian_access())
