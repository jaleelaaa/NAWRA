"""
Vercel-compatible entry point for NAWRA Backend
This version removes background tasks that don't work in serverless environments
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from datetime import datetime

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.supabase_client import get_supabase

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="NAWRA Library Management System",
    description="API for Family of Oman Ministry Library Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    """
    Root endpoint - Health check
    """
    return {
        "message": "NAWRA Library Management System API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "deployment": "vercel-serverless"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint with database connection verification
    """
    # Check database connection
    db_status = "unknown"
    db_error = None

    try:
        supabase = get_supabase()
        # Perform a lightweight query to verify connection
        result = supabase.table('roles').select('id').limit(1).execute()
        db_status = "healthy"
    except Exception as e:
        db_status = "unhealthy"
        db_error = str(e)
        logger.error(f"❌ Database health check failed: {str(e)}")

    # Prepare response
    response = {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now().isoformat(),
        "deployment": "vercel-serverless",
        "database": {
            "status": db_status,
            "error": db_error,
        }
    }

    return response


# Vercel handler
handler = app
