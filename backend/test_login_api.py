"""
Test the login API endpoint directly
"""
import requests
import json

# Login credentials
login_data = {
    "email": "admin@ministry.om",
    "password": "Admin@123",
    "remember_me": False
}

print("="  * 60)
print("Testing LOGIN API endpoint...")
print("=" * 60)

try:
    response = requests.post(
        "http://localhost:8000/api/v1/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )

    print(f"Status Code: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print("\n--- User Data ---")
        user = data.get('user', {})
        print(f"ID: {user.get('id')}")
        print(f"Email: {user.get('email')}")
        print(f"Full Name: {user.get('full_name')}")
        print(f"Arabic Name: {user.get('arabic_name')}")
        print(f"Role: {user.get('role')}")
        print(f"Permissions: {user.get('permissions')}")

        print("\n--- Full Response (JSON) ---")
        # Print full response but limit arabic_name field
        if 'user' in data and 'arabic_name' in data['user']:
            arabic_name = data['user']['arabic_name']
            if arabic_name:
                print(f"Arabic name field exists: YES (length: {len(arabic_name)} chars)")
            else:
                print(f"Arabic name field exists: NO (value is None)")

        print(f"\nFull user object keys: {list(user.keys())}")
    else:
        print(f"Error: {response.text}")

except Exception as e:
    print(f"Exception: {e}")
