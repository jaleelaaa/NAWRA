"""
Vercel-compatible entry point for NAWRA Backend
Minimal serverless-compatible version
"""
from fastapi import FastAPI
from datetime import datetime

# Initialize FastAPI app with minimal configuration
app = FastAPI(
    title="NAWRA Library Management System",
    description="API for Family of Oman Ministry Library Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


@app.get("/")
async def root():
    """
    Root endpoint - Basic health check
    """
    return {
        "message": "NAWRA Library Management System API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "deployment": "vercel-serverless",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/test")
async def test():
    """
    Test endpoint to verify deployment
    """
    return {
        "status": "success",
        "message": "Vercel serverless function is working!",
        "timestamp": datetime.now().isoformat()
    }


# Vercel handler
handler = app
