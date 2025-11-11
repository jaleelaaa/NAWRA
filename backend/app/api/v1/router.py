from fastapi import APIRouter
from .endpoints import auth

api_router = APIRouter(prefix="/v1")

# Health check endpoint
@api_router.get("/health")
async def health():
    """
    API v1 health check
    """
    return {"status": "healthy", "version": "1.0.0"}

# Include routers for different modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# We'll add these as we build each feature
# api_router.include_router(users.router, prefix="/users", tags=["Users"])
# api_router.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
# api_router.include_router(circulation.router, prefix="/circulation", tags=["Circulation"])
# api_router.include_router(acquisitions.router, prefix="/acquisitions", tags=["Acquisitions"])
# api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
