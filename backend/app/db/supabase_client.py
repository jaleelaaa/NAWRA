"""
Supabase client configuration
"""
from supabase import create_client, Client
from ..core.config import settings


def get_supabase_client() -> Client:
    """
    Create and return Supabase client
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise ValueError("Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env")

    supabase: Client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_KEY  # Use service key for backend operations
    )
    return supabase


# Create a global instance
supabase_client = None

def get_supabase() -> Client:
    """
    Get or create Supabase client instance
    """
    global supabase_client
    if supabase_client is None:
        supabase_client = get_supabase_client()
    return supabase_client
