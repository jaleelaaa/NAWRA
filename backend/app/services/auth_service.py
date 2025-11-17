"""
Authentication service - Business logic for user authentication
"""
from typing import Optional, Dict
from datetime import datetime
from ..db import get_supabase
from ..core.security import verify_password, create_access_token, create_refresh_token
from ..core.config import settings


class AuthService:
    """Authentication service"""

    def __init__(self):
        self.supabase = get_supabase()

    async def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        """
        Authenticate user by email and password
        Returns user data if authentication successful, None otherwise
        """
        try:
            # Fetch user from database with role information
            response = self.supabase.table('users').select(
                "id, email, password_hash, full_name, arabic_name, user_type, is_active, created_at, roles(name, permissions)"
            ).eq('email', email).eq('is_active', True).execute()

            if not response.data or len(response.data) == 0:
                return None

            user = response.data[0]

            # Verify password
            if not verify_password(password, user['password_hash']):
                return None

            # Update last login
            self.supabase.table('users').update({
                'last_login': datetime.utcnow().isoformat()
            }).eq('id', user['id']).execute()

            return user

        except Exception as e:
            print(f"Authentication error: {str(e)}")
            return None

    def generate_tokens(self, user: Dict, remember_me: bool = False) -> Dict:
        """
        Generate access and refresh tokens for user
        """
        token_data = {
            "sub": user['email'],
            "user_id": str(user['id']),
            "role": user.get('roles', {}).get('name', 'Patron') if user.get('roles') else 'Patron'
        }

        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # Convert to seconds

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": expires_in
        }
