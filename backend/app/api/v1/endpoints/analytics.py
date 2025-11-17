"""
Analytics endpoints for dashboard charts and statistics
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime, timedelta
from ....db import get_supabase
from ....core.dependencies import require_any_permission
from supabase import Client

router = APIRouter()


def get_db() -> Client:
    """Dependency to get Supabase client"""
    return get_supabase()


@router.get("/borrowing-trends", summary="Get borrowing and return trends")
async def get_borrowing_trends(
    days: int = Query(default=30, ge=1, le=365, description="Number of days to fetch"),
    db: Client = Depends(get_db),
    current_user: dict = Depends(require_any_permission(["reports.view", "circulation.checkout", "circulation.checkin"]))
):
    """
    Get borrowing and return trends for the last N days

    **Staff only** - requires reports or circulation permissions

    Returns daily counts of borrowed and returned books

    **Required permission:** Any of reports.view, circulation.checkout, or circulation.checkin
    """
    try:
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Fetch borrowing data (circulation_records with checkout date in range)
        borrowing_response = db.table('circulation_records').select(
            'checkout_date, id'
        ).gte(
            'checkout_date', start_date.isoformat()
        ).lte(
            'checkout_date', end_date.isoformat()
        ).execute()

        # Fetch return data (circulation_records with return date in range)
        return_response = db.table('circulation_records').select(
            'return_date, id'
        ).gte(
            'return_date', start_date.isoformat()
        ).lte(
            'return_date', end_date.isoformat()
        ).is_not('return_date', 'null').execute()

        # Process data by date
        borrowed_by_date = {}
        returned_by_date = {}

        # Process borrowed books
        for transaction in borrowing_response.data:
            date = transaction['checkout_date'][:10]  # Get YYYY-MM-DD
            borrowed_by_date[date] = borrowed_by_date.get(date, 0) + 1

        # Process returned books
        for transaction in return_response.data:
            if transaction['return_date']:
                date = transaction['return_date'][:10]
                returned_by_date[date] = returned_by_date.get(date, 0) + 1

        # Create result array with all dates in range
        result = []
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            date_display = current_date.strftime('%b %d')  # e.g., "Jan 15"

            result.append({
                'date': date_display,
                'date_full': date_str,
                'borrowed': borrowed_by_date.get(date_str, 0),
                'returned': returned_by_date.get(date_str, 0)
            })
            current_date += timedelta(days=1)

        return {
            "data": result,
            "period": f"Last {days} days",
            "total_borrowed": sum(borrowed_by_date.values()),
            "total_returned": sum(returned_by_date.values())
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching borrowing trends: {str(e)}"
        )


@router.get("/categories", summary="Get books by category")
async def get_books_by_category(
    db: Client = Depends(get_db),
    current_user: dict = Depends(require_any_permission(["reports.view", "inventory.read"]))
):
    """
    Get count of books grouped by category

    **Staff only** - requires reports or inventory permissions

    Returns book counts per category for pie/bar chart

    **Required permission:** Any of reports.view or inventory.read
    """
    try:
        # Fetch books with category information
        response = db.table('books').select(
            'id, category_id, categories(name)'
        ).execute()

        # Count books by category
        category_counts = {}
        for book in response.data:
            if book.get('categories'):
                category_name = book['categories'].get('name', 'Uncategorized')
            else:
                category_name = 'Uncategorized'

            category_counts[category_name] = category_counts.get(category_name, 0) + 1

        # Format result
        result = [
            {
                'name': category,
                'value': count
            }
            for category, count in sorted(
                category_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )
        ]

        return {
            "data": result,
            "total_books": sum(category_counts.values()),
            "total_categories": len(category_counts)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching category data: {str(e)}"
        )


@router.get("/user-distribution", summary="Get user distribution by type")
async def get_user_distribution(
    db: Client = Depends(get_db),
    current_user: dict = Depends(require_any_permission(["reports.view", "users.read"]))
):
    """
    Get user count distribution by user type

    **Staff only** - requires reports or users permissions

    Returns user counts per type (Student, Teacher, Staff, etc.)

    **Required permission:** Any of reports.view or users.read
    """
    try:
        # Fetch all active users
        response = db.table('users').select(
            'user_type, id'
        ).eq('is_active', True).execute()

        # Count users by type
        type_counts = {}
        for user in response.data:
            user_type = user.get('user_type', 'Unknown')
            type_counts[user_type] = type_counts.get(user_type, 0) + 1

        # Format result
        result = [
            {
                'name': user_type,
                'value': count
            }
            for user_type, count in sorted(
                type_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )
        ]

        return {
            "data": result,
            "total_users": sum(type_counts.values())
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching user distribution: {str(e)}"
        )


@router.get("/monthly-circulation", summary="Get monthly circulation statistics")
async def get_monthly_circulation(
    months: int = Query(default=12, ge=1, le=24, description="Number of months to fetch"),
    db: Client = Depends(get_db),
    current_user: dict = Depends(require_any_permission(["reports.view", "circulation.checkout", "circulation.checkin"]))
):
    """
    Get monthly circulation statistics

    **Staff only** - requires reports or circulation permissions

    Returns monthly totals of checkouts and returns

    **Required permission:** Any of reports.view, circulation.checkout, or circulation.checkin
    """
    try:
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=months*30)  # Approximate

        # Fetch all circulation_records in range
        response = db.table('circulation_records').select(
            'checkout_date, return_date, id'
        ).gte(
            'checkout_date', start_date.isoformat()
        ).execute()

        # Process data by month
        monthly_checkouts = {}
        monthly_returns = {}

        for transaction in response.data:
            # Process checkout
            if transaction.get('checkout_date'):
                month_key = transaction['checkout_date'][:7]  # YYYY-MM
                monthly_checkouts[month_key] = monthly_checkouts.get(month_key, 0) + 1

            # Process return
            if transaction.get('return_date'):
                month_key = transaction['return_date'][:7]
                monthly_returns[month_key] = monthly_returns.get(month_key, 0) + 1

        # Create result array
        result = []
        current_month = start_date.replace(day=1)
        while current_month <= end_date:
            month_key = current_month.strftime('%Y-%m')
            month_display = current_month.strftime('%b %Y')  # e.g., "Jan 2024"

            result.append({
                'month': month_display,
                'month_key': month_key,
                'checkouts': monthly_checkouts.get(month_key, 0),
                'returns': monthly_returns.get(month_key, 0)
            })

            # Move to next month
            if current_month.month == 12:
                current_month = current_month.replace(year=current_month.year + 1, month=1)
            else:
                current_month = current_month.replace(month=current_month.month + 1)

        return {
            "data": result,
            "period": f"Last {months} months"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching circulation data: {str(e)}"
        )
