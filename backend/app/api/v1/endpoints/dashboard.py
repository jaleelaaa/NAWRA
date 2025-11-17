"""
Dashboard endpoints for statistics and overview data
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from ....db import get_supabase
from ....core.dependencies import require_any_permission
from supabase import Client

router = APIRouter()


def get_db() -> Client:
    """Dependency to get Supabase client"""
    return get_supabase()


@router.get("/stats", summary="Get dashboard statistics")
async def get_dashboard_stats(
    db: Client = Depends(get_db),
    current_user: dict = Depends(require_any_permission(["reports.view", "circulation.checkout", "circulation.checkin", "users.read", "inventory.read"]))
):
    """
    Get comprehensive dashboard statistics including:
    - Total users count and trend
    - Total books count and trend
    - Books borrowed count and trend
    - Overdue books count and trend

    **Staff only** - requires reports, circulation, users, or inventory permissions

    **Required permission:** Any of reports.view, circulation.checkout, circulation.checkin, users.read, or inventory.read
    """
    try:
        # Get current date and date 30 days ago for trend calculation
        current_date = datetime.now()
        thirty_days_ago = current_date - timedelta(days=30)
        sixty_days_ago = current_date - timedelta(days=60)

        # --- TOTAL USERS ---
        total_users_response = db.table('users').select(
            'id, created_at', count='exact'
        ).eq('is_active', True).execute()

        total_users = total_users_response.count

        # Users created in last 30 days
        recent_users_response = db.table('users').select(
            'id', count='exact'
        ).gte('created_at', thirty_days_ago.isoformat()).eq('is_active', True).execute()

        # Users created between 60-30 days ago
        previous_users_response = db.table('users').select(
            'id', count='exact'
        ).gte('created_at', sixty_days_ago.isoformat()).lt('created_at', thirty_days_ago.isoformat()).eq('is_active', True).execute()

        users_trend = calculate_trend(recent_users_response.count, previous_users_response.count)

        # --- TOTAL BOOKS ---
        total_books_response = db.table('books').select(
            'id, created_at', count='exact'
        ).execute()

        total_books = total_books_response.count

        # Books added in last 30 days
        recent_books_response = db.table('books').select(
            'id', count='exact'
        ).gte('created_at', thirty_days_ago.isoformat()).execute()

        # Books added between 60-30 days ago
        previous_books_response = db.table('books').select(
            'id', count='exact'
        ).gte('created_at', sixty_days_ago.isoformat()).lt('created_at', thirty_days_ago.isoformat()).execute()

        books_trend = calculate_trend(recent_books_response.count, previous_books_response.count)

        # --- BOOKS BORROWED (Currently checked out) ---
        borrowed_books_response = db.table('circulation_records').select(
            'id, checkout_date', count='exact'
        ).is_('return_date', 'null').execute()

        books_borrowed = borrowed_books_response.count

        # Borrowings in last 30 days
        recent_borrowings_response = db.table('circulation_records').select(
            'id', count='exact'
        ).gte('checkout_date', thirty_days_ago.isoformat()).is_('return_date', 'null').execute()

        # Borrowings between 60-30 days ago (that were active then)
        previous_borrowings_response = db.table('circulation_records').select(
            'id', count='exact'
        ).gte('checkout_date', sixty_days_ago.isoformat()).lt('checkout_date', thirty_days_ago.isoformat()).execute()

        borrowed_trend = calculate_trend(recent_borrowings_response.count, previous_borrowings_response.count)

        # --- OVERDUE BOOKS ---
        # Books that are checked out and due date has passed
        overdue_books_response = db.table('circulation_records').select(
            'id, due_date', count='exact'
        ).is_('return_date', 'null').lt('due_date', current_date.isoformat()).execute()

        overdue_books = overdue_books_response.count

        # Overdue books 30 days ago
        thirty_days_ago_overdue = db.table('circulation_records').select(
            'id', count='exact'
        ).is_('return_date', 'null').lt('due_date', thirty_days_ago.isoformat()).execute()

        # Calculate overdue trend (inverted logic - decrease is good)
        if thirty_days_ago_overdue.count > 0:
            overdue_change = ((overdue_books - thirty_days_ago_overdue.count) / thirty_days_ago_overdue.count) * 100
        else:
            overdue_change = 0 if overdue_books == 0 else 100

        overdue_trend = {
            'direction': 'up' if overdue_change > 0 else 'down',
            'percentage': abs(round(overdue_change, 1))
        }

        # --- SPARKLINE DATA (Last 7 days for mini charts) ---
        # Generate sparkline data for each metric
        users_sparkline = generate_sparkline_data(db, 'users', 'created_at', 7)
        books_sparkline = generate_sparkline_data(db, 'books', 'created_at', 7)
        borrowings_sparkline = generate_sparkline_data(db, 'transactions', 'checkout_date', 7)
        overdue_sparkline = generate_overdue_sparkline(db, 7)

        return {
            "total_users": {
                "value": total_users,
                "trend": users_trend,
                "sparkline": users_sparkline
            },
            "total_books": {
                "value": total_books,
                "trend": books_trend,
                "sparkline": books_sparkline
            },
            "books_borrowed": {
                "value": books_borrowed,
                "trend": borrowed_trend,
                "sparkline": borrowings_sparkline
            },
            "overdue_books": {
                "value": overdue_books,
                "trend": overdue_trend,
                "sparkline": overdue_sparkline
            },
            "last_updated": current_date.isoformat()
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching dashboard stats: {str(e)}"
        )


def calculate_trend(recent_count: int, previous_count: int) -> dict:
    """Calculate trend percentage and direction"""
    if previous_count == 0:
        if recent_count == 0:
            percentage = 0
        else:
            percentage = 100
    else:
        percentage = ((recent_count - previous_count) / previous_count) * 100

    return {
        'direction': 'up' if percentage > 0 else 'down',
        'percentage': abs(round(percentage, 1))
    }


def generate_sparkline_data(db: Client, table: str, date_field: str, days: int) -> list:
    """Generate sparkline data for the last N days"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Fetch data for date range
        response = db.table(table).select(
            f'{date_field}, id'
        ).gte(date_field, start_date.isoformat()).execute()

        # Count by date
        counts_by_date = {}
        for row in response.data:
            date = row[date_field][:10]
            counts_by_date[date] = counts_by_date.get(date, 0) + 1

        # Create sparkline array
        sparkline = []
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            sparkline.append({
                'value': counts_by_date.get(date_str, 0)
            })
            current_date += timedelta(days=1)

        return sparkline

    except Exception as e:
        print(f"Error generating sparkline: {str(e)}")
        return [{'value': 0} for _ in range(days)]


def generate_overdue_sparkline(db: Client, days: int) -> list:
    """Generate sparkline for overdue books over last N days"""
    try:
        sparkline = []
        current_date = datetime.now()

        for i in range(days):
            date = current_date - timedelta(days=(days - i - 1))

            # Count overdue books on that date
            response = db.table('circulation_records').select(
                'id', count='exact'
            ).is_('return_date', 'null').lt('due_date', date.isoformat()).execute()

            sparkline.append({
                'value': response.count
            })

        return sparkline

    except Exception as e:
        print(f"Error generating overdue sparkline: {str(e)}")
        return [{'value': 0} for _ in range(days)]
