"""
NAWRA Backend API - Vercel Serverless Deployment
Includes authentication, database connectivity, and debug endpoints
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from datetime import datetime
import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

# API Documentation Metadata
description = """
## NAWRA Library Management System API

A comprehensive library management system for managing books, members, borrowing, and reservations.

### Features

* **Authentication** - Secure JWT-based authentication with role-based access control
* **User Management** - Manage library members and staff accounts
* **Book Management** - Catalog and organize library resources
* **Borrowing System** - Track book loans and returns
* **Reservation System** - Allow members to reserve books
* **Fine Management** - Calculate and track overdue fines
* **Activity Tracking** - Monitor library operations and user activities

### Authentication

1. Use the `/api/v1/auth/login` endpoint to obtain access and refresh tokens
2. Click the 🔓 **Authorize** button at the top right
3. Enter your access token in the format: `Bearer <your_token>`
4. Test protected endpoints with your authenticated session

### Test Credentials

For testing purposes, you can use:
- **Email**: admin@nawra.om
- **Password**: Admin@123456

---
Built with ❤️ for NAWRA Library
"""

tags_metadata = [
    {
        "name": "authentication",
        "description": "User authentication and authorization operations including login, logout, and token management.",
    },
    {
        "name": "users",
        "description": "User management operations. Manage library members and staff accounts.",
    },
    {
        "name": "books",
        "description": "Book catalog management. Add, update, and organize library resources.",
    },
    {
        "name": "borrowing",
        "description": "Book borrowing and return operations. Track loans and manage due dates.",
    },
    {
        "name": "reservations",
        "description": "Book reservation system. Allow members to reserve available or borrowed books.",
    },
    {
        "name": "fines",
        "description": "Fine calculation and payment tracking for overdue items.",
    },
    {
        "name": "debug",
        "description": "Debug and testing endpoints. These should be disabled in production.",
    },
]

app = FastAPI(
    title="NAWRA Library Management API",
    description=description,
    version="1.0.0",
    contact={
        "name": "NAWRA Library",
        "email": "support@nawra.om",
    },
    license_info={
        "name": "MIT License",
    },
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom OpenAPI schema to add security schemes
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        tags=tags_metadata,
    )

    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token obtained from /api/v1/auth/login"
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

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

@app.get("/api/test", tags=["debug"])
def test():
    """
    Test endpoint to verify the serverless function is working.

    Returns a simple success message with timestamp.
    """
    return {
        "status": "success",
        "message": "Vercel serverless function is working!",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/debug/routes", tags=["debug"])
def debug_routes():
    """
    List all available API routes.

    Returns information about all registered routes including:
    - Path
    - HTTP methods
    - Route name
    - Router loading status
    """
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

@app.post("/api/debug/create-test-user", tags=["debug"])
async def create_test_user():
    """
    Create a test user for testing login functionality.

    Creates an admin user with email admin@nawra.om and password Admin@123456.

    Returns:
    - If user exists: Returns existing user information
    - If created: Returns newly created user information
    - If error: Returns error details
    """
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

@app.post("/api/debug/reset-test-password", tags=["debug"])
async def reset_test_password():
    """
    Reset test user password to Admin@123456.

    Useful when you need to reset the test admin account password.

    Returns:
    - Success: Confirmation that password was reset
    - Error: User not found or reset failed
    """
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
