from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import asyncio
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

# Global variable to track last database ping
last_db_ping = {"timestamp": None, "status": "not_started"}


async def database_keep_alive():
    """
    Background task to keep Supabase connection active.
    Executes a lightweight query every 5 minutes to prevent database auto-pause.
    """
    global last_db_ping

    while True:
        try:
            # Execute a lightweight query to keep the database active
            supabase = get_supabase()
            result = supabase.table('roles').select('id').limit(1).execute()

            # Update last ping status
            last_db_ping["timestamp"] = datetime.now()
            last_db_ping["status"] = "healthy"

            logger.info(f"✅ Database keep-alive ping successful at {last_db_ping['timestamp']}")

        except Exception as e:
            last_db_ping["timestamp"] = datetime.now()
            last_db_ping["status"] = f"error: {str(e)}"
            logger.error(f"❌ Database keep-alive ping failed: {str(e)}")

        # Wait 5 minutes before next ping (300 seconds)
        await asyncio.sleep(300)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    logger.info("🚀 Starting NAWRA Library Management System...")
    logger.info(f"📦 Environment: {settings.ENVIRONMENT}")
    logger.info(f"🔗 API Docs: http://localhost:8000/docs")

    # Start database keep-alive background task
    logger.info("🔄 Starting database keep-alive task...")
    keep_alive_task = asyncio.create_task(database_keep_alive())

    yield

    # Shutdown
    logger.info("👋 Shutting down NAWRA Library Management System...")

    # Cancel the keep-alive task
    logger.info("🛑 Stopping database keep-alive task...")
    keep_alive_task.cancel()
    try:
        await keep_alive_task
    except asyncio.CancelledError:
        logger.info("✅ Database keep-alive task stopped successfully")


# Initialize FastAPI app
app = FastAPI(
    title="NAWRA Library Management System",
    description="API for Family of Oman Ministry Library Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
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
    }


@app.get("/health")
async def health_check():
    """
    Enhanced health check endpoint with database connection verification
    """
    global last_db_ping

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
        "database": {
            "status": db_status,
            "error": db_error,
        },
        "keep_alive": {
            "status": last_db_ping["status"],
            "last_ping": last_db_ping["timestamp"].isoformat() if last_db_ping["timestamp"] else None,
        }
    }

    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
