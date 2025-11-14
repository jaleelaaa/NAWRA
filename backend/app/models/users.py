"""
User Management Pydantic models
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class UserDetailResponse(BaseModel):
    """User detail response schema"""
    id: UUID
    email: str
    full_name: str
    arabic_name: Optional[str] = None
    role: str
    user_type: str
    is_active: bool
    phone: Optional[str] = None
    address: Optional[str] = None
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Paginated user list response"""
    items: List[UserDetailResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class CreateUserRequest(BaseModel):
    """Create user request schema"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password")
    full_name: str = Field(..., min_length=2, max_length=255, description="Full name")
    arabic_name: Optional[str] = Field(None, max_length=255, description="Arabic name")
    role_id: Optional[UUID] = Field(None, description="Role ID")
    user_type: str = Field(..., description="User type: Staff or Patron")
    phone: Optional[str] = Field(None, max_length=50, description="Phone number")
    address: Optional[str] = Field(None, description="Address")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@ministry.om",
                "password": "SecurePass123!",
                "full_name": "Ahmed Al-Balushi",
                "arabic_name": "أحمد البلوشي",
                "user_type": "Staff",
                "phone": "+968 9123 4567"
            }
        }


class UpdateUserRequest(BaseModel):
    """Update user request schema"""
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    arabic_name: Optional[str] = Field(None, max_length=255)
    email: Optional[EmailStr] = None
    role_id: Optional[UUID] = None
    phone: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None
    is_active: Optional[bool] = None

    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "Ahmed Abdullah Al-Balushi",
                "arabic_name": "أحمد عبدالله البلوشي",
                "phone": "+968 9123 4567",
                "is_active": True
            }
        }


class UserStatsResponse(BaseModel):
    """User statistics response schema"""
    total_users: int
    active_users: int
    inactive_users: int
    staff_count: int
    patron_count: int


class UserFilters(BaseModel):
    """User filter parameters"""
    search: Optional[str] = Field(None, description="Search by name or email")
    role: Optional[str] = Field(None, description="Filter by role name")
    user_type: Optional[str] = Field(None, description="Filter by user type")
    is_active: Optional[bool] = Field(None, description="Filter by active status")
    page: int = Field(default=1, ge=1, description="Page number")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")
    sort_by: Optional[str] = Field(None, description="Sort field")
    sort_order: Optional[str] = Field("asc", description="Sort order: asc or desc")
