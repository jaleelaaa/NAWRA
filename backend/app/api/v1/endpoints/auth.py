"""
Authentication endpoints
"""
from fastapi import APIRouter, HTTPException, status, Depends
from ....models.auth import LoginRequest, LoginResponse, UserResponse, TokenResponse
from ....services.auth_service import AuthService
from ....core.dependencies import get_current_user as get_current_user_dependency

router = APIRouter()


def get_auth_service() -> AuthService:
    """Dependency to get auth service instance"""
    return AuthService()


@router.post("/login", response_model=LoginResponse, summary="User login")
async def login(login_data: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    """
    Authenticate user and return JWT tokens

    - **email**: User email address
    - **password**: User password
    - **remember_me**: Remember user for extended period
    """
    # Authenticate user
    user = await auth_service.authenticate_user(login_data.email, login_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate tokens
    tokens = auth_service.generate_tokens(user, login_data.remember_me)

    # Prepare user response with permissions
    role_info = user.get('roles', {}) if user.get('roles') else {}
    permissions = role_info.get('permissions', []) if isinstance(role_info, dict) else []

    user_response = UserResponse(
        id=user['id'],
        email=user['email'],
        full_name=user['full_name'],
        arabic_name=user.get('arabic_name'),
        role=role_info.get('name', 'Patron') if isinstance(role_info, dict) else 'Patron',
        user_type=user['user_type'],
        is_active=user['is_active'],
        created_at=user['created_at'],
        permissions=permissions
    )

    return LoginResponse(
        user=user_response,
        tokens=TokenResponse(**tokens),
        message="Login successful"
    )


@router.post("/logout", summary="User logout")
async def logout():
    """
    Logout user (invalidate tokens on client side)
    """
    return {"message": "Logout successful"}


@router.get("/me", response_model=UserResponse, summary="Get current user")
async def get_current_user_info(
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Get current authenticated user information.
    Validates JWT token and returns user details with permissions.

    Requires valid JWT token in Authorization header.
    """
    return UserResponse(
        id=current_user['id'],
        email=current_user['email'],
        full_name=current_user['full_name'],
        arabic_name=current_user.get('arabic_name'),
        role=current_user.get('role_name', 'Unknown'),
        user_type=current_user['user_type'],
        is_active=current_user['is_active'],
        created_at=current_user['created_at'],
        permissions=current_user.get('permissions', [])
    )
