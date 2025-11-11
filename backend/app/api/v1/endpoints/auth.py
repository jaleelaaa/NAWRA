"""
Authentication endpoints
"""
from fastapi import APIRouter, HTTPException, status, Depends
from ....models.auth import LoginRequest, LoginResponse, UserResponse, TokenResponse
from ....services.auth_service import AuthService

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

    # Prepare user response
    user_response = UserResponse(
        id=user['id'],
        email=user['email'],
        full_name=user['full_name'],
        role=user.get('roles', {}).get('name', 'Patron') if user.get('roles') else 'Patron',
        user_type=user['user_type'],
        is_active=user['is_active'],
        created_at=user['created_at']
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


@router.get("/me", summary="Get current user")
async def get_current_user():
    """
    Get current authenticated user information
    (This will be implemented with proper JWT validation in next iteration)
    """
    return {"message": "Get current user endpoint"}
