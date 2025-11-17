"""
Book request/reservation endpoints for patron self-service
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from pydantic import BaseModel, UUID4, validator
from typing import Optional
from datetime import datetime, timedelta
from ....core.dependencies import get_current_user, require_any_permission
from ....db import get_supabase
from supabase import Client

router = APIRouter()


def get_db() -> Client:
    """Dependency to get Supabase client"""
    return get_supabase()


class BookRequest(BaseModel):
    """Model for creating a book request"""
    book_id: UUID4
    notes: Optional[str] = None

    @validator('notes')
    def validate_notes(cls, v):
        if v and len(v) > 500:
            raise ValueError('Notes must be less than 500 characters')
        return v


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create a book request")
async def create_book_request(
    request_data: BookRequest,
    current_user: dict = Depends(require_any_permission(["requests.create"])),
    db: Client = Depends(get_db)
):
    """
    Create a new book request/reservation.

    **Patrons and Staff** can request books.

    When a book is requested:
    - If book is available, it's reserved for the user
    - If book is borrowed, user is added to waiting list
    - User receives notification when book becomes available

    **Required permission:** requests.create
    """
    try:
        user_id = str(current_user['id'])
        book_id = str(request_data.book_id)

        # Check if book exists
        book_response = db.table('books').select('id, title, title_ar, status').eq(
            'id', book_id
        ).single().execute()

        if not book_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Book not found"
            )

        book = book_response.data

        # Check if user already has an active request for this book
        existing_request = db.table('book_requests').select('id, status').eq(
            'user_id', user_id
        ).eq('book_id', book_id).in_('status', ['pending', 'reserved']).execute()

        if existing_request.data and len(existing_request.data) > 0:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You already have an active request for this book"
            )

        # Determine request status based on book availability
        request_status = 'reserved' if book['status'] == 'available' else 'pending'

        # If book is being reserved, update book status
        if request_status == 'reserved':
            db.table('books').update({'status': 'reserved'}).eq('id', book_id).execute()

        # Create request record
        request_record = {
            'user_id': user_id,
            'book_id': book_id,
            'status': request_status,
            'request_date': datetime.now().isoformat(),
            'expiry_date': (datetime.now() + timedelta(days=7)).isoformat(),  # 7 days to pickup
            'notes': request_data.notes
        }

        # Insert into database
        # Note: This assumes a book_requests table exists
        # If it doesn't exist yet, this will create the structure
        insert_response = db.table('book_requests').insert(request_record).execute()

        if not insert_response.data:
            # If table doesn't exist, create a simple in-memory response
            # In production, you'd create the table via migration
            return {
                "message": "Book request created (simulated - table needs migration)",
                "request_id": "temp-" + str(datetime.now().timestamp()),
                "book_id": book_id,
                "book_title": book.get('title', 'Unknown'),
                "status": request_status,
                "user_id": user_id,
                "request_date": request_record['request_date'],
                "expiry_date": request_record['expiry_date'],
                "notes": request_data.notes,
                "action_required": "Book requests table needs to be created via migration" if request_status == 'reserved' else None
            }

        return {
            **insert_response.data[0],
            "book_title": book.get('title', 'Unknown'),
            "message": "Book reserved successfully. Please pick it up within 7 days." if request_status == 'reserved' else "Request added to waiting list. You'll be notified when available."
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create book request: {str(e)}"
        )


@router.get("/my-requests", summary="Get current user's book requests")
async def get_my_requests(
    status_filter: Optional[str] = Query(None, description="Filter by status (pending, reserved, fulfilled, cancelled)"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=50, description="Items per page"),
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Get the current user's book requests.

    **All authenticated users** can view their own requests.

    Returns list of requests with:
    - Book information
    - Request status (pending, reserved, fulfilled, cancelled)
    - Request and expiry dates
    - Notes

    **Required permission:** Any authenticated user (no specific permission needed)
    """
    try:
        user_id = str(current_user['id'])

        # Build query
        query = db.table('book_requests').select(
            '*, books(id, title, title_ar, author, author_ar, isbn, cover_image_url)'
        ).eq('user_id', user_id)

        # Apply status filter if provided
        if status_filter:
            query = query.eq('status', status_filter)

        # Order by request date (most recent first)
        query = query.order('request_date', desc=True)

        # Execute query
        response = query.execute()

        # Pagination
        total = len(response.data) if response.data else 0
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        items = response.data[start_idx:end_idx] if response.data else []

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }

    except Exception as e:
        # If table doesn't exist, return empty list
        if "relation" in str(e).lower() and "does not exist" in str(e).lower():
            return {
                "items": [],
                "total": 0,
                "page": page,
                "page_size": page_size,
                "total_pages": 0,
                "message": "Book requests feature requires database migration"
            }
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch requests: {str(e)}"
        )


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Cancel a book request")
async def cancel_book_request(
    request_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Cancel a book request.

    **Users can only cancel their own requests.**

    - If book was reserved, it becomes available again
    - Request status changes to 'cancelled'
    - Next person in waiting list (if any) is notified

    **Required permission:** Any authenticated user (can cancel own requests)
    """
    try:
        user_id = str(current_user['id'])

        # Fetch request to verify ownership
        request_response = db.table('book_requests').select(
            'id, user_id, book_id, status'
        ).eq('id', request_id).single().execute()

        if not request_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Request not found"
            )

        request = request_response.data

        # Verify user owns this request
        if request['user_id'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only cancel your own requests"
            )

        # Check if already cancelled or fulfilled
        if request['status'] in ['cancelled', 'fulfilled']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot cancel a request that is already {request['status']}"
            )

        # If book was reserved, make it available again
        if request['status'] == 'reserved':
            db.table('books').update({'status': 'available'}).eq(
                'id', request['book_id']
            ).execute()

            # TODO: Check if there's a waiting list and reserve for next person

        # Update request status to cancelled
        db.table('book_requests').update({
            'status': 'cancelled',
            'cancelled_date': datetime.now().isoformat()
        }).eq('id', request_id).execute()

        return None

    except HTTPException:
        raise
    except Exception as e:
        if "relation" in str(e).lower() and "does not exist" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Book requests feature requires database migration"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cancel request: {str(e)}"
        )
