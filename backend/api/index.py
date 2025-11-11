from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Track router loading status
router_status = {"auth": "not_loaded", "error": None}

# Include routers
try:
    from app.api.v1.endpoints import auth
    app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
    router_status["auth"] = "loaded"
except Exception as e:
    router_status["error"] = str(e)
    print(f"Warning: Could not load auth router: {e}")
    import traceback
    traceback.print_exc()

@app.get("/")
def read_root():
    return {
        "message": "NAWRA Library Management System API",
        "version": "1.0.0",
        "status": "running",
        "deployment": "vercel-serverless",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint with database connectivity test"""
    try:
        # Lazy import to avoid cold start issues
        from app.db.supabase_client import get_supabase

        # Test database connection
        supabase = get_supabase()

        # Simple query to test connection
        response = supabase.table('users').select("id").limit(1).execute()

        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat(),
            "environment": settings.ENVIRONMENT
        }
    except Exception as e:
        return {
            "status": "degraded",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/test")
def test():
    return {
        "status": "success",
        "message": "Vercel serverless function is working!",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/debug/routes")
def debug_routes():
    """Debug endpoint to see all available routes"""
    routes = []
    for route in app.routes:
        if hasattr(route, "methods") and hasattr(route, "path"):
            routes.append({
                "path": route.path,
                "methods": list(route.methods),
                "name": route.name
            })
    return {
        "router_status": router_status,
        "total_routes": len(routes),
        "routes": routes
    }

@app.post("/api/debug/create-test-user")
async def create_test_user():
    """Create a test user for testing login functionality"""
    try:
        from app.db.supabase_client import get_supabase
        from app.core.security import get_password_hash

        supabase = get_supabase()

        # Check if test user already exists
        existing = supabase.table('users').select("*").eq('email', 'admin@nawra.om').execute()

        if existing.data and len(existing.data) > 0:
            return {
                "status": "exists",
                "message": "Test user already exists",
                "user": {
                    "email": "admin@nawra.om",
                    "password": "Admin@123456"
                }
            }

        # Get admin role ID
        role_response = supabase.table('roles').select("id").eq('name', 'Admin').execute()
        role_id = role_response.data[0]['id'] if role_response.data else None

        # Create test user
        password_hash = get_password_hash("Admin@123456")

        new_user = {
            "email": "admin@nawra.om",
            "password_hash": password_hash,
            "full_name": "Test Admin",
            "role_id": role_id,
            "user_type": "Staff",
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }

        result = supabase.table('users').insert(new_user).execute()

        return {
            "status": "created",
            "message": "Test user created successfully",
            "user": {
                "email": "admin@nawra.om",
                "password": "Admin@123456",
                "full_name": "Test Admin"
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "message": "Failed to create test user"
        }

@app.post("/api/debug/reset-test-password")
async def reset_test_password():
    """Reset test user password to Admin@123456"""
    try:
        from app.db.supabase_client import get_supabase
        from app.core.security import get_password_hash

        supabase = get_supabase()

        # Generate new password hash
        new_password_hash = get_password_hash("Admin@123456")

        # Update password
        result = supabase.table('users').update({
            'password_hash': new_password_hash
        }).eq('email', 'admin@nawra.om').execute()

        if result.data and len(result.data) > 0:
            return {
                "status": "success",
                "message": "Password reset successfully",
                "user": {
                    "email": "admin@nawra.om",
                    "password": "Admin@123456"
                }
            }
        else:
            return {
                "status": "error",
                "message": "User not found"
            }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "message": "Failed to reset password"
        }
