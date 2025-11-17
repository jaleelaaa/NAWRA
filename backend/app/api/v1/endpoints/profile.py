"""
Profile management endpoints for patron self-service
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from ....core.dependencies import get_current_user
from ....db import get_supabase
from supabase import Client

router = APIRouter()


def get_db() -> Client:
    """Dependency to get Supabase client"""
    return get_supabase()


class ProfileUpdate(BaseModel):
    """Model for profile update request"""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

    @validator('full_name')
    def validate_full_name(cls, v):
        if v is not None and len(v.strip()) < 2:
            raise ValueError('Full name must be at least 2 characters')
        return v.strip() if v else v

    @validator('phone')
    def validate_phone(cls, v):
        if v is not None and len(v.strip()) < 7:
            raise ValueError('Phone number must be at least 7 characters')
        return v.strip() if v else v


class PasswordChange(BaseModel):
    """Model for password change request"""
    current_password: str
    new_password: str

    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v


@router.get("/me", summary="Get current user's profile")
async def get_my_profile(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Get the current authenticated user's profile information.

    **All authenticated users** can access their own profile.

    Returns:
    - User ID, email, full name
    - User type and role information
    - Contact details (phone, address)
    - Account status and creation date
    - Permissions (for reference)

    **Required permission:** Any authenticated user (no specific permission needed)
    """
    try:
        # Fetch complete user profile from database
        response = db.table('users').select(
            """
            id, email, full_name, user_type, phone, address,
            is_active, created_at, updated_at,
            role_id, roles(name, permissions)
            """
        ).eq('id', current_user['id']).single().execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )

        user_data = response.data

        # Format permissions for display
        role_info = user_data.get('roles', {})
        permissions = role_info.get('permissions', []) if isinstance(role_info, dict) else []
        role_name = role_info.get('name', 'Unknown') if isinstance(role_info, dict) else 'Unknown'

        return {
            "id": user_data['id'],
            "email": user_data['email'],
            "full_name": user_data['full_name'],
            "user_type": user_data['user_type'],
            "phone": user_data.get('phone'),
            "address": user_data.get('address'),
            "is_active": user_data['is_active'],
            "created_at": user_data['created_at'],
            "updated_at": user_data.get('updated_at'),
            "role": {
                "id": user_data['role_id'],
                "name": role_name,
                "permissions": permissions
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch profile: {str(e)}"
        )


@router.patch("/me", summary="Update current user's profile")
async def update_my_profile(
    profile_data: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Update the current authenticated user's profile information.

    **All authenticated users** can update their own profile.

    Users can update:
    - Full name
    - Phone number
    - Address

    Users CANNOT update:
    - Email (requires admin)
    - User type or role (requires admin)
    - Account status (requires admin)
    - Permissions (requires admin)

    **Required permission:** Any authenticated user (no specific permission needed)
    """
    try:
        # Filter out None values (only update provided fields)
        update_data = {k: v for k, v in profile_data.dict().items() if v is not None}

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )

        # Add updated_at timestamp
        from datetime import datetime
        update_data['updated_at'] = datetime.now().isoformat()

        # Update profile in database
        response = db.table('users').update(update_data).eq(
            'id', current_user['id']
        ).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )

        # Fetch updated profile
        return await get_my_profile(current_user, db)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )


@router.post("/me/change-password", summary="Change password")
async def change_password(
    password_data: PasswordChange,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Change the current user's password.

    **All authenticated users** can change their own password.

    Requires:
    - Current password (for verification)
    - New password (minimum 8 characters)

    **Required permission:** Any authenticated user (no specific permission needed)
    """
    try:
        from ....core.security import verify_password, get_password_hash
        from datetime import datetime

        # Fetch user's current password hash
        user_response = db.table('users').select('password_hash').eq(
            'id', current_user['id']
        ).single().execute()

        if not user_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        current_password_hash = user_response.data.get('password_hash')

        # Verify current password
        if not verify_password(password_data.current_password, current_password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )

        # Hash the new password
        new_password_hash = get_password_hash(password_data.new_password)

        # Update password in database
        update_response = db.table('users').update({
            'password_hash': new_password_hash,
            'updated_at': datetime.now().isoformat()
        }).eq('id', current_user['id']).execute()

        if not update_response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update password"
            )

        return {
            "message": "Password changed successfully",
            "detail": "Your password has been updated. Please use your new password for future logins.",
            "user_id": current_user['id']
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to change password: {str(e)}"
        )


@router.get("/me/stats", summary="Get user's personal statistics")
async def get_my_stats(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Get the current user's personal statistics.

    **All authenticated users** can view their own statistics.

    Returns:
    - Total books borrowed (all time)
    - Currently active loans
    - Overdue books count
    - Total fines (if any)
    - Borrowing history summary

    **Required permission:** Any authenticated user (no specific permission needed)
    """
    try:
        user_id = str(current_user['id'])

        # Get total books borrowed (all time)
        total_borrowed_response = db.table('circulation_records').select(
            'id', count='exact'
        ).eq('user_id', user_id).execute()

        # Get active loans (not returned)
        active_loans_response = db.table('circulation_records').select(
            'id', count='exact'
        ).eq('user_id', user_id).is_('return_date', 'null').execute()

        # Get overdue books
        from datetime import datetime
        current_date = datetime.now().isoformat()
        overdue_response = db.table('circulation_records').select(
            'id', count='exact'
        ).eq('user_id', user_id).is_('return_date', 'null').lt('due_date', current_date).execute()

        # Get returned books count
        returned_response = db.table('circulation_records').select(
            'id', count='exact'
        ).eq('user_id', user_id).is_not('return_date', 'null').execute()

        return {
            "user_id": user_id,
            "total_borrowed": total_borrowed_response.count,
            "active_loans": active_loans_response.count,
            "returned_books": returned_response.count,
            "overdue_books": overdue_response.count,
            "borrowing_status": "Good Standing" if overdue_response.count == 0 else f"{overdue_response.count} Overdue",
            "account_type": current_user.get('user_type', 'Unknown')
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch statistics: {str(e)}"
        )
