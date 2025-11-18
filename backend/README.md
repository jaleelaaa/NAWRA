# NAWRA Library Management System - Backend

FastAPI backend for the Family of Oman Ministry Library Management System.

## Technology Stack

- **Framework**: FastAPI 0.115+
- **Database**: Supabase (PostgreSQL)
- **Cache**: Upstash Redis
- **Authentication**: JWT (python-jose)
- **ORM**: SQLAlchemy 2.0 (Async)
- **Email**: Resend API
- **Testing**: pytest

## Setup Instructions

### 1. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your credentials
```

You need to set up:
- Supabase account (database)
- Upstash Redis account (caching)
- Resend account (emails)

### 4. Run the Application

```bash
# Development mode with hot reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

**🚀 Production:**
- API: https://nawra-backend.onrender.com
- Interactive API docs: https://nawra-backend.onrender.com/docs
- Alternative docs: https://nawra-backend.onrender.com/redoc

**💻 Local Development:**
- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/              # API endpoints
│   │   └── v1/
│   │       ├── endpoints/  # Route handlers
│   │       └── router.py   # Main router
│   ├── core/             # Core configuration
│   │   ├── config.py     # Settings
│   │   ├── security.py   # Auth & security
│   │   └── permissions.py # RBAC
│   ├── db/               # Database
│   │   ├── supabase.py   # Supabase client
│   │   └── redis.py      # Redis client
│   ├── models/           # Pydantic schemas
│   ├── services/         # Business logic
│   └── utils/            # Utilities
├── main.py               # FastAPI app entry
└── requirements.txt      # Dependencies
```

## API Documentation

**🚀 Production:** Visit [https://nawra-backend.onrender.com/docs](https://nawra-backend.onrender.com/docs) for live API documentation.

**💻 Local Development:** Visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API documentation.

## Development

### Code Style

```bash
# Format code
black app/

# Lint
flake8 app/

# Type check
mypy app/
```

### Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## Deployment

See deployment documentation for deploying to Railway.app or Render.com.
