"""
Security utilities for authentication and authorization
"""
from datetime import datetime, timedelta
from typing import Optional
import hashlib
import bcrypt
from jose import JWTError, jwt
from .config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password using bcrypt directly.

    Using bcrypt directly to avoid passlib/bcrypt 5.0.0 compatibility issues.
    Handles SHA256 pre-hashing for passwords over 72 bytes to match
    the hashing process.
    """
    try:
        # Check if we need to pre-hash (same logic as in get_password_hash)
        if len(plain_password.encode('utf-8')) > 72:
            # Pre-hash with SHA256 for very long passwords
            plain_password = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()

        # Use bcrypt directly
        password_bytes = plain_password.encode('utf-8')
        hash_bytes = hashed_password.encode('utf-8') if isinstance(hashed_password, str) else hashed_password
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except Exception as e:
        # If verification fails for any reason, return False
        print(f"Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt directly with safety checks.

    Using bcrypt directly to avoid passlib/bcrypt 5.0.0 compatibility issues.
    Bcrypt has a 72-byte limit. For passwords longer than 72 bytes,
    we pre-hash with SHA256 to ensure it fits.
    """
    # Check password length - bcrypt has a 72-byte limit
    if len(password.encode('utf-8')) > 72:
        # Pre-hash with SHA256 for very long passwords
        password = hashlib.sha256(password.encode('utf-8')).hexdigest()

    # Use bcrypt directly
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """
    Create a JWT refresh token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT token
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
