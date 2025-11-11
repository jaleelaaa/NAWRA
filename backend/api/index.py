from fastapi import FastAPI
from datetime import datetime

app = FastAPI()

@app.get("/")
def read_root():
    return {
        "message": "NAWRA Library Management System API",
        "version": "1.0.0",
        "status": "running",
        "deployment": "vercel-serverless",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/test")
def test():
    return {
        "status": "success",
        "message": "Vercel serverless function is working!",
        "timestamp": datetime.now().isoformat()
    }
