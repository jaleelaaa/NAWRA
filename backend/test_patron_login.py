#!/usr/bin/env python3
"""
Test patron login
"""
import sys
from pathlib import Path
import requests

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

BASE_URL = "http://localhost:8000"

# Test patron login
email = "patron@nawra.om"
password = "Nawra2025!"

print(f"Testing login for: {email}")
print(f"Password: {password}")
print(f"URL: {BASE_URL}/api/v1/auth/login")
print()

try:
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": email, "password": password},
        headers={"Content-Type": "application/json"},
        timeout=10
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    if response.status_code == 200:
        print("\n✅ LOGIN SUCCESSFUL!")
    else:
        print("\n❌ LOGIN FAILED!")

except Exception as e:
    print(f"ERROR: {str(e)}")
