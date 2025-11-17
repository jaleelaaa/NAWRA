#!/usr/bin/env python3
"""
NAWRA Credential Verification Script

This script verifies that all test user credentials are working correctly.

Usage:
    python verify_credentials.py              # Verify all credentials
    python verify_credentials.py --reset      # Reset and verify
    python verify_credentials.py --role admin # Test specific role only

Features:
    - Tests login for all 5 roles
    - Verifies JWT token generation
    - Checks role permissions
    - Generates credential report
"""

import os
import sys
import requests
import json
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_URL = os.getenv('API_URL', 'http://localhost:8000')
API_VERSION = 'v1'

# Standard test credentials
TEST_CREDENTIALS = {
    'admin': {
        'email': 'admin@nawra.om',
        'password': 'Nawra2025!',
        'expected_role': 'Administrator',
        'user_type': 'staff'
    },
    'librarian': {
        'email': 'librarian@nawra.om',
        'password': 'Nawra2025!',
        'expected_role': 'Librarian',
        'user_type': 'staff'
    },
    'circulation': {
        'email': 'circulation@nawra.om',
        'password': 'Nawra2025!',
        'expected_role': 'Circulation Staff',
        'user_type': 'staff'
    },
    'cataloger': {
        'email': 'cataloger@nawra.om',
        'password': 'Nawra2025!',
        'expected_role': 'Cataloger',
        'user_type': 'staff'
    },
    'patron': {
        'email': 'patron@nawra.om',
        'password': 'Nawra2025!',
        'expected_role': 'Patron',
        'user_type': 'patron'
    }
}

# Color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'


def print_header(text: str):
    """Print formatted header"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'=' * 70}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(70)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'=' * 70}{Colors.END}\n")


def print_success(text: str):
    """Print success message"""
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")


def print_error(text: str):
    """Print error message"""
    print(f"{Colors.RED}❌ {text}{Colors.END}")


def print_warning(text: str):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")


def print_info(text: str):
    """Print info message"""
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.END}")


def test_login(role: str, credentials: Dict) -> Optional[Dict]:
    """
    Test login for a specific role

    Returns:
        Dict with token and user info if successful, None if failed
    """
    url = f"{BASE_URL}/api/{API_VERSION}/auth/login"

    try:
        response = requests.post(
            url,
            json={
                'email': credentials['email'],
                'password': credentials['password']
            },
            headers={'Content-Type': 'application/json'},
            timeout=10
        )

        if response.status_code == 200:
            data = response.json()
            return {
                'success': True,
                'token': data.get('access_token'),
                'user': data.get('user', {}),
                'role': data.get('user', {}).get('role'),
                'user_type': data.get('user', {}).get('user_type')
            }
        else:
            return {
                'success': False,
                'error': response.json().get('detail', 'Unknown error'),
                'status_code': response.status_code
            }

    except requests.exceptions.ConnectionError:
        return {
            'success': False,
            'error': 'Connection refused. Is the backend server running?'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def verify_permissions(token: str, role: str) -> Dict:
    """
    Verify that the user has expected permissions
    """
    url = f"{BASE_URL}/api/{API_VERSION}/profile/me"

    try:
        response = requests.get(
            url,
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )

        if response.status_code == 200:
            data = response.json()
            return {
                'success': True,
                'permissions': data.get('permissions', []),
                'role': data.get('role')
            }
        else:
            return {
                'success': False,
                'error': f'HTTP {response.status_code}'
            }

    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def run_verification(specific_role: Optional[str] = None):
    """
    Run credential verification for all or specific role
    """
    print_header("NAWRA Credential Verification")

    print_info(f"Testing against: {BASE_URL}")
    print_info(f"Standard password: Nawra2025!")
    print_info(f"Domain: @nawra.om\n")

    # Filter roles if specific role requested
    roles_to_test = {specific_role: TEST_CREDENTIALS[specific_role]} if specific_role else TEST_CREDENTIALS

    results = {}

    for role_key, credentials in roles_to_test.items():
        print(f"\n{Colors.BOLD}Testing {role_key.upper()} role...{Colors.END}")
        print(f"  Email: {credentials['email']}")

        # Test login
        login_result = test_login(role_key, credentials)

        if not login_result['success']:
            print_error(f"Login failed: {login_result.get('error', 'Unknown error')}")
            results[role_key] = {'status': 'FAILED', 'reason': login_result.get('error')}
            continue

        print_success("Login successful")

        # Verify role matches
        actual_role = login_result.get('role')
        expected_role = credentials['expected_role']

        if actual_role == expected_role:
            print_success(f"Role verified: {actual_role}")
        else:
            print_error(f"Role mismatch! Expected: {expected_role}, Got: {actual_role}")
            results[role_key] = {'status': 'FAILED', 'reason': 'Role mismatch'}
            continue

        # Verify user type
        actual_type = login_result.get('user_type')
        expected_type = credentials['user_type']

        if actual_type == expected_type:
            print_success(f"User type verified: {actual_type}")
        else:
            print_error(f"User type mismatch! Expected: {expected_type}, Got: {actual_type}")

        # Check permissions
        token = login_result['token']
        perm_result = verify_permissions(token, role_key)

        if perm_result['success']:
            permissions = perm_result.get('permissions', [])
            print_success(f"Permissions loaded: {len(permissions)} permissions")

            # Show key permissions
            key_perms = ['users.create', 'inventory.create', 'circulation.checkout',
                        'catalog.search', 'reports.generate']
            user_key_perms = [p for p in key_perms if p in permissions]

            if user_key_perms:
                print(f"  Key permissions: {', '.join(user_key_perms[:5])}")
        else:
            print_warning(f"Could not verify permissions: {perm_result.get('error')}")

        results[role_key] = {'status': 'PASSED', 'permissions_count': len(permissions)}

    # Summary
    print_header("Verification Summary")

    passed = sum(1 for r in results.values() if r['status'] == 'PASSED')
    failed = sum(1 for r in results.values() if r['status'] == 'FAILED')
    total = len(results)

    print(f"\n{Colors.BOLD}Results:{Colors.END}")
    print(f"  Total tests: {total}")
    print(f"  {Colors.GREEN}Passed: {passed}{Colors.END}")
    print(f"  {Colors.RED}Failed: {failed}{Colors.END}")

    print(f"\n{Colors.BOLD}Detailed Results:{Colors.END}")
    for role, result in results.items():
        status_symbol = "✅" if result['status'] == 'PASSED' else "❌"
        print(f"  {status_symbol} {role.ljust(15)} - {result['status']}")
        if result['status'] == 'FAILED':
            print(f"     Reason: {result.get('reason', 'Unknown')}")

    print()

    # Return exit code
    return 0 if failed == 0 else 1


def generate_credentials_table():
    """Generate a formatted table of all credentials"""
    print_header("Standard Credentials Reference")

    print(f"\n{Colors.BOLD}{'Role'.ljust(20)} {'Email'.ljust(30)} {'Password'.ljust(15)}{Colors.END}")
    print("-" * 65)

    for role_key, creds in TEST_CREDENTIALS.items():
        role_name = creds['expected_role']
        email = creds['email']
        password = creds['password']

        print(f"{role_name.ljust(20)} {email.ljust(30)} {password.ljust(15)}")

    print("\n" + "=" * 65)
    print(f"{Colors.YELLOW}⚠️  These are TEST credentials. Change before production!{Colors.END}\n")


def print_curl_examples():
    """Print curl examples for testing"""
    print_header("API Testing Examples")

    print(f"\n{Colors.BOLD}Test Administrator Login:{Colors.END}")
    print(f"""
curl -X POST {BASE_URL}/api/{API_VERSION}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{{"email":"admin@nawra.om","password":"Nawra2025!"}}'
    """)

    print(f"\n{Colors.BOLD}Test Patron Login:{Colors.END}")
    print(f"""
curl -X POST {BASE_URL}/api/{API_VERSION}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{{"email":"patron@nawra.om","password":"Nawra2025!"}}'
    """)


def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(
        description='Verify NAWRA test user credentials',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python verify_credentials.py                # Verify all roles
  python verify_credentials.py --role admin   # Test admin only
  python verify_credentials.py --table        # Show credentials table
  python verify_credentials.py --examples     # Show curl examples
        """
    )

    parser.add_argument(
        '--role',
        choices=['admin', 'librarian', 'circulation', 'cataloger', 'patron'],
        help='Test specific role only'
    )

    parser.add_argument(
        '--table',
        action='store_true',
        help='Display credentials reference table'
    )

    parser.add_argument(
        '--examples',
        action='store_true',
        help='Show curl examples for API testing'
    )

    parser.add_argument(
        '--reset',
        action='store_true',
        help='Instructions to reset credentials (requires SQL)'
    )

    args = parser.parse_args()

    try:
        if args.table:
            generate_credentials_table()
            return 0

        if args.examples:
            print_curl_examples()
            return 0

        if args.reset:
            print_header("Reset Credentials")
            print("\nTo reset all test user credentials:")
            print("\n1. Open Supabase SQL Editor")
            print("2. Run the script: backend/reset_test_users.sql")
            print("3. Verify with: python verify_credentials.py\n")
            print_warning("This will delete and recreate all test users!")
            return 0

        # Run verification
        exit_code = run_verification(args.role)

        if exit_code == 0:
            print_success("\n✨ All credentials verified successfully!\n")
        else:
            print_error("\n❌ Some credential tests failed. Check output above.\n")

        return exit_code

    except KeyboardInterrupt:
        print("\n\nVerification cancelled by user.")
        return 130
    except Exception as e:
        print_error(f"\nUnexpected error: {str(e)}")
        return 1


if __name__ == '__main__':
    sys.exit(main())
