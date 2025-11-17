"""
Authentication and authorization dependencies for FastAPI endpoints
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, List, Callable
import logging

from .security import decode_token
from ..db import get_supabase

logger = logging.getLogger(__name__)

# HTTP Bearer token scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependency to get current authenticated user from JWT token.

    Validates the JWT token from Authorization header and fetches user
    details including role and permissions from database.

    Args:
        credentials: HTTP Authorization credentials with Bearer token

    Returns:
        dict: User object with role and permissions

    Raises:
        HTTPException: 401 if token is invalid or user not found
    """
    try:
        # Extract and decode token
        token = credentials.credentials
        payload = decode_token(token)

        if not payload:
            logger.warning("Invalid token received")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Get user ID from token
        user_id = payload.get("user_id")
        if not user_id:
            logger.warning("Token missing user_id")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Fetch user from database with role and permissions
        supabase = get_supabase()
        response = supabase.table('users').select(
            "id, email, full_name, user_type, is_active, role_id, roles(name, permissions)"
        ).eq('id', user_id).eq('is_active', True).execute()

        if not response.data or len(response.data) == 0:
            logger.warning(f"User {user_id} not found or inactive")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = response.data[0]

        # Extract permissions from role
        role_info = user.get('roles', {})
        permissions = role_info.get('permissions', []) if isinstance(role_info, dict) else []

        # Add permissions to user object for easy access
        user['permissions'] = permissions
        user['role_name'] = role_info.get('name', 'Unknown') if isinstance(role_info, dict) else 'Unknown'

        logger.info(f"User {user['email']} authenticated successfully")
        return user

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_permissions(required_permissions: List[str]) -> Callable:
    """
    Dependency factory to check if user has required permissions.

    Usage:
        @router.post("/users")
        async def create_user(
            current_user: dict = Depends(require_permissions(["users.create"]))
        ):
            # User has users.create permission
            pass

    Args:
        required_permissions: List of permission strings required

    Returns:
        Dependency function that validates permissions

    Raises:
        HTTPException: 403 if user lacks required permissions
    """
    async def permission_checker(
        current_user: dict = Depends(get_current_user)
    ) -> dict:
        user_permissions = current_user.get('permissions', [])

        # Check each required permission
        missing_permissions = []
        for permission in required_permissions:
            if permission not in user_permissions:
                missing_permissions.append(permission)

        if missing_permissions:
            logger.warning(
                f"User {current_user['email']} denied access. "
                f"Missing permissions: {', '.join(missing_permissions)}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permissions: {', '.join(missing_permissions)}"
            )

        return current_user

    return permission_checker


def require_any_permission(required_permissions: List[str]) -> Callable:
    """
    Dependency factory to check if user has ANY of the required permissions.

    Usage:
        @router.get("/circulation")
        async def view_circulation(
            current_user: dict = Depends(require_any_permission([
                "circulation.checkout", "circulation.checkin"
            ]))
        ):
            # User has at least one circulation permission
            pass

    Args:
        required_permissions: List of permission strings (any will do)

    Returns:
        Dependency function that validates permissions

    Raises:
        HTTPException: 403 if user lacks all required permissions
    """
    async def permission_checker(
        current_user: dict = Depends(get_current_user)
    ) -> dict:
        user_permissions = current_user.get('permissions', [])

        # Check if user has ANY of the required permissions
        has_permission = any(
            perm in user_permissions for perm in required_permissions
        )

        if not has_permission:
            logger.warning(
                f"User {current_user['email']} denied access. "
                f"Requires one of: {', '.join(required_permissions)}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires one of these permissions: {', '.join(required_permissions)}"
            )

        return current_user

    return permission_checker


def require_role(allowed_roles: List[str]) -> Callable:
    """
    Dependency factory to check if user has one of the allowed roles.

    Usage:
        @router.get("/admin/settings")
        async def get_settings(
            current_user: dict = Depends(require_role(["Administrator"]))
        ):
            # User is Administrator
            pass

    Args:
        allowed_roles: List of role names allowed

    Returns:
        Dependency function that validates role

    Raises:
        HTTPException: 403 if user doesn't have allowed role
    """
    async def role_checker(
        current_user: dict = Depends(get_current_user)
    ) -> dict:
        user_role = current_user.get('role_name', '')

        if user_role not in allowed_roles:
            logger.warning(
                f"User {current_user['email']} with role '{user_role}' "
                f"denied access. Requires role: {', '.join(allowed_roles)}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {', '.join(allowed_roles)}"
            )

        return current_user

    return role_checker


def require_staff() -> dict:
    """
    Dependency to ensure user is staff (not patron).

    Usage:
        @router.get("/staff/dashboard")
        async def staff_dashboard(
            current_user: dict = Depends(require_staff)
        ):
            # User is staff member
            pass
    """
    async def staff_checker(
        current_user: dict = Depends(get_current_user)
    ) -> dict:
        if current_user.get('user_type') != 'staff':
            logger.warning(
                f"Non-staff user {current_user['email']} attempted staff access"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Staff access required"
            )

        return current_user

    return staff_checker


# Optional: Get current user if authenticated, None if not
async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    )
) -> Optional[dict]:
    """
    Dependency to optionally get current user.
    Returns None if not authenticated instead of raising exception.

    Useful for endpoints that work differently for authenticated vs anonymous users.
    """
    if not credentials:
        return None

    try:
        token = credentials.credentials
        payload = decode_token(token)

        if not payload:
            return None

        user_id = payload.get("user_id")
        if not user_id:
            return None

        supabase = get_supabase()
        response = supabase.table('users').select(
            "id, email, full_name, user_type, is_active, role_id, roles(name, permissions)"
        ).eq('id', user_id).eq('is_active', True).execute()

        if not response.data:
            return None

        user = response.data[0]
        role_info = user.get('roles', {})
        user['permissions'] = role_info.get('permissions', []) if isinstance(role_info, dict) else []
        user['role_name'] = role_info.get('name', 'Unknown') if isinstance(role_info, dict) else 'Unknown'

        return user

    except Exception:
        return None
