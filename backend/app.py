"""
Vercel-compatible entry point for NAWRA Backend
This version removes background tasks that don't work in serverless environments
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from datetime import datetime
import sys
import traceback

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Import application modules with error handling
try:
    from app.core.config import settings
    from app.api.v1.router import api_router
    from app.db.supabase_client import get_supabase
    logger.info("✓ Application modules loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to import application modules: {str(e)}")
    logger.error(traceback.format_exc())
    raise

# Initialize FastAPI app
app = FastAPI(
    title="NAWRA Library Management System",
    description="API for Family of Oman Ministry Library Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

@app.on_event("startup")
async def startup_event():
    """Log successful startup"""
    logger.info("🚀 NAWRA Backend started successfully on Vercel serverless")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"CORS Origins: {settings.CORS_ORIGINS}")

# CORS Configuration
try:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info("✓ CORS middleware configured")
except Exception as e:
    logger.error(f"❌ Failed to configure CORS: {str(e)}")
    raise

# Include API router
try:
    app.include_router(api_router, prefix="/api")
    logger.info("✓ API router included")
except Exception as e:
    logger.error(f"❌ Failed to include API router: {str(e)}")
    raise


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
