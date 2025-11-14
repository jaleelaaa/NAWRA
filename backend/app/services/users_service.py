"""
Users service - Business logic for user management
"""
from typing import Optional, Dict, List
from uuid import UUID
import math
from ..db import get_supabase
from ..core.security import get_password_hash
from ..models.users import CreateUserRequest, UpdateUserRequest


class UsersService:
    """Users management service"""

    def __init__(self):
        self.supabase = get_supabase()

    async def get_users(
        self,
        search: Optional[str] = None,
        role: Optional[str] = None,
        user_type: Optional[str] = None,
        is_active: Optional[bool] = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Dict:
        """
        Get paginated list of users with optional filters
        """
        try:
            # Start building query
            query = self.supabase.table('users').select(
                "id, email, full_name, arabic_name, role_id, user_type, is_active, phone, "
                "address, last_login, created_at, updated_at, roles(id, name)",
                count="exact"
            )

            # Apply filters
            if search:
                # Search in full_name or email (case-insensitive)
                query = query.or_(f"full_name.ilike.%{search}%,email.ilike.%{search}%")

            if role:
                # Filter by role name through join
                query = query.eq('roles.name', role)

            if user_type:
                query = query.eq('user_type', user_type)

            if is_active is not None:
                query = query.eq('is_active', is_active)

            # Calculate offset
            offset = (page - 1) * page_size

            # Apply sorting and pagination
            query = query.order(sort_by, desc=(sort_order == "desc"))
            query = query.range(offset, offset + page_size - 1)

            # Execute query
            response = query.execute()

            # Transform data to include role name directly
            users = []
            for user in response.data:
                user_dict = dict(user)
                # Extract role name from nested roles object
                if user_dict.get('roles'):
                    user_dict['role'] = user_dict['roles'].get('name', 'Patron')
                else:
                    user_dict['role'] = 'Patron'
                # Remove nested roles object
                user_dict.pop('roles', None)
                users.append(user_dict)

            # Calculate total pages
            total = response.count if response.count is not None else 0
            total_pages = math.ceil(total / page_size) if page_size > 0 else 0

            return {
                "items": users,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages
            }

        except Exception as e:
            print(f"Error fetching users: {str(e)}")
            raise

    async def get_user_by_id(self, user_id: UUID) -> Optional[Dict]:
        """
        Get single user by ID
        """
        try:
            response = self.supabase.table('users').select(
                "id, email, full_name, arabic_name, role_id, user_type, is_active, phone, "
                "address, last_login, created_at, updated_at, roles(id, name)"
            ).eq('id', str(user_id)).execute()

            if not response.data or len(response.data) == 0:
                return None

            user = dict(response.data[0])

            # Extract role name from nested roles object
            if user.get('roles'):
                user['role'] = user['roles'].get('name', 'Patron')
            else:
                user['role'] = 'Patron'
            user.pop('roles', None)

            return user

        except Exception as e:
            print(f"Error fetching user: {str(e)}")
            raise

    async def create_user(self, user_data: CreateUserRequest) -> Dict:
        """
        Create new user with password hashing
        """
        try:
            # Hash password
            password_hash = get_password_hash(user_data.password)

            # Prepare user data
            new_user = {
                "email": user_data.email,
                "password_hash": password_hash,
                "full_name": user_data.full_name,
                "arabic_name": user_data.arabic_name,
                "user_type": user_data.user_type,
                "is_active": True,
                "phone": user_data.phone,
                "address": user_data.address,
            }

            # Add role_id if provided
            if user_data.role_id:
                new_user["role_id"] = str(user_data.role_id)
            else:
                # Get default Patron role
                role_response = self.supabase.table('roles').select('id').eq('name', 'Patron').execute()
                if role_response.data:
                    new_user["role_id"] = role_response.data[0]['id']

            # Insert user
            response = self.supabase.table('users').insert(new_user).execute()

            if not response.data or len(response.data) == 0:
                raise Exception("Failed to create user")

            # Fetch complete user data with role
            created_user_id = response.data[0]['id']
            return await self.get_user_by_id(UUID(created_user_id))

        except Exception as e:
            print(f"Error creating user: {str(e)}")
            raise

    async def update_user(self, user_id: UUID, user_data: UpdateUserRequest) -> Dict:
        """
        Update existing user
        """
        try:
            # Prepare update data (only include provided fields)
            update_data = {}

            if user_data.full_name is not None:
                update_data["full_name"] = user_data.full_name

            if user_data.arabic_name is not None:
                update_data["arabic_name"] = user_data.arabic_name

            if user_data.email is not None:
                update_data["email"] = user_data.email

            if user_data.role_id is not None:
                update_data["role_id"] = str(user_data.role_id)

            if user_data.phone is not None:
                update_data["phone"] = user_data.phone

            if user_data.address is not None:
                update_data["address"] = user_data.address

            if user_data.is_active is not None:
                update_data["is_active"] = user_data.is_active

            if not update_data:
                # No fields to update
                return await self.get_user_by_id(user_id)

            # Update user
            response = self.supabase.table('users').update(update_data).eq('id', str(user_id)).execute()

            if not response.data or len(response.data) == 0:
                raise Exception("User not found or update failed")

            # Fetch complete updated user data
            return await self.get_user_by_id(user_id)

        except Exception as e:
            print(f"Error updating user: {str(e)}")
            raise

    async def delete_user(self, user_id: UUID) -> bool:
        """
        Delete user (hard delete)
        """
        try:
            response = self.supabase.table('users').delete().eq('id', str(user_id)).execute()
            return True

        except Exception as e:
            print(f"Error deleting user: {str(e)}")
            raise

    async def get_user_stats(self) -> Dict:
        """
        Get user statistics
        """
        try:
            # Get total users
            total_response = self.supabase.table('users').select('id', count="exact").execute()
            total_users = total_response.count if total_response.count is not None else 0

            # Get active users
            active_response = self.supabase.table('users').select('id', count="exact").eq('is_active', True).execute()
            active_users = active_response.count if active_response.count is not None else 0

            # Get inactive users
            inactive_users = total_users - active_users

            # Get staff count
            staff_response = self.supabase.table('users').select('id', count="exact").eq('user_type', 'Staff').execute()
            staff_count = staff_response.count if staff_response.count is not None else 0

            # Get patron count
            patron_response = self.supabase.table('users').select('id', count="exact").eq('user_type', 'Patron').execute()
            patron_count = patron_response.count if patron_response.count is not None else 0

            return {
                "total_users": total_users,
                "active_users": active_users,
                "inactive_users": inactive_users,
                "staff_count": staff_count,
                "patron_count": patron_count
            }

        except Exception as e:
            print(f"Error fetching user stats: {str(e)}")
            raise
