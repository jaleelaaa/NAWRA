"""
Test the login API endpoint - check if arabic_name is returned
"""
import requests
import json

login_data = {
    "email": "admin@ministry.om",
    "password": "Admin@123",
    "remember_me": False
}

print("=" * 60)
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
        user = data.get('user', {})

        print("\nUser Fields:")
        print(f"  - ID: {user.get('id')}")
        print(f"  - Email: {user.get('email')}")
        print(f"  - Full Name: {user.get('full_name')}")

        # Check arabic_name without printing it
        arabic_name = user.get('arabic_name')
        if arabic_name:
            print(f"  - Arabic Name: EXISTS (length: {len(arabic_name)} chars)")
            print(f"    -> Arabic Name (encoded): {arabic_name.encode('utf-8')}")
        elif arabic_name is None:
            print(f"  - Arabic Name: NULL")
        else:
            print(f"  - Arabic Name: EMPTY STRING")

        print(f"  - Role: {user.get('role')}")
        print(f"  - User Type: {user.get('user_type')}")

        print(f"\nAll user object keys: {list(user.keys())}")

        # Check if arabic_name is in the response
        if 'arabic_name' in user:
            print("\n✓ SUCCESS: arabic_name field is present in API response!")
        else:
            print("\n✗ FAIL: arabic_name field is missing from API response!")

    else:
        print(f"Error: {response.text}")

except Exception as e:
    print(f"Exception: {type(e).__name__}: {str(e)[:100]}")
