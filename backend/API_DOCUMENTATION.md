# NAWRA Library Management System - API Documentation

## Overview

The NAWRA API provides a comprehensive RESTful interface for managing library operations including authentication, user management, book catalog, borrowing, reservations, and fines.

## API Documentation Access

### Swagger UI (Interactive)
- **Production**: https://nawra-backend.onrender.com/docs
- **Local**: http://localhost:8000/docs

Swagger UI provides an interactive interface where you can:
- View all available endpoints
- Test API calls directly in the browser
- See request/response examples
- Authenticate and test protected endpoints

### ReDoc (Alternative Documentation)
- **Production**: https://nawra-backend.onrender.com/redoc
- **Local**: http://localhost:8000/redoc

ReDoc provides a clean, readable documentation format.

### OpenAPI Specification
- **Production**: https://nawra-backend.onrender.com/openapi.json
- **Local**: http://localhost:8000/openapi.json

Download the OpenAPI JSON specification for use with tools like Postman, Insomnia, or code generators.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Test Credentials

For testing and development:
```
Email: admin@nawra.om
Password: Admin@123456
```

### How to Authenticate in Swagger UI

1. **Get Access Token**
   - Navigate to `/docs` (Swagger UI)
   - Find the `POST /api/v1/auth/login` endpoint under "authentication"
   - Click "Try it out"
   - Enter test credentials:
     ```json
     {
       "email": "admin@nawra.om",
       "password": "Admin@123456",
       "remember_me": false
     }
     ```
   - Click "Execute"
   - Copy the `access_token` from the response

2. **Authorize Swagger**
   - Click the 🔓 **Authorize** button at the top right of the page
   - In the "BearerAuth" section, enter: `Bearer <your_access_token>`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Click "Authorize"
   - Click "Close"

3. **Test Protected Endpoints**
   - Now you can test any protected endpoint
   - The token will be automatically included in requests
   - Try `GET /api/v1/auth/me` to verify authentication

### Token Expiration

- **Access Token**: Expires in 30 minutes (configurable)
- **Refresh Token**: Expires in 30 days (configurable)

Use the refresh token endpoint to obtain a new access token without re-authenticating.

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | User login | No |
| POST | `/logout` | User logout | Yes |
| POST | `/refresh` | Refresh access token | No |
| GET | `/me` | Get current user info | Yes |

### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all users | Yes (Admin) |
| GET | `/{id}` | Get user by ID | Yes |
| POST | `/` | Create new user | Yes (Admin) |
| PUT | `/{id}` | Update user | Yes |
| DELETE | `/{id}` | Delete user | Yes (Admin) |

### Books (Coming Soon)

Book management endpoints will be added in Phase 3.

### Borrowing (Coming Soon)

Borrowing management endpoints will be added in Phase 4.

### Reservations (Coming Soon)

Reservation management endpoints will be added in Phase 5.

### Fines (Coming Soon)

Fine management endpoints will be added in Phase 6.

### Debug Endpoints (`/api/debug`)

**Note**: These endpoints should be disabled in production environments.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/routes` | List all API routes |
| POST | `/create-test-user` | Create test admin user |
| POST | `/reset-test-password` | Reset test user password |

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "detail": "Error message here"
}
```

### Authentication Response
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@nawra.om",
    "full_name": "Test Admin",
    "role": "Admin",
    "user_type": "Staff",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1800
  },
  "message": "Login successful"
}
```

## Security Best Practices

### For Testing
1. Use provided test credentials in non-production environments
2. Test endpoints require valid JWT tokens
3. Store tokens securely (use httpOnly cookies in production)

### For Production
1. **Disable Debug Endpoints**: Remove or protect `/api/debug/*` endpoints
2. **Use HTTPS**: Always use HTTPS in production
3. **Secure Credentials**: Store credentials in environment variables or secrets management
4. **Rate Limiting**: Implement rate limiting for authentication endpoints
5. **Token Rotation**: Regularly rotate JWT secret keys
6. **CORS Configuration**: Restrict CORS to trusted domains only

## Environment Variables

The API requires the following environment variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# JWT Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30

# CORS Configuration
CORS_ORIGINS=https://nawra-frontend.vercel.app,http://localhost:3000

# Application
APP_NAME="NAWRA Library Management System"
ENVIRONMENT=production
```

### Setting Up GitHub Secrets

To securely manage credentials in your GitHub repository:

1. Go to your GitHub repository
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each secret:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SECRET_KEY`
   - `CORS_ORIGINS`

### Configuring Vercel with GitHub Secrets

Vercel can automatically pull environment variables from your repository. However, you need to manually add them in the Vercel dashboard:

1. Go to https://vercel.com/dashboard
2. Select your **nawra-backend-pd** project
3. Go to **Settings** > **Environment Variables**
4. Add each variable for Production, Preview, and Development environments
5. Redeploy to apply changes

## Testing with Postman

1. **Import OpenAPI Spec**
   - In Postman, click "Import"
   - Enter URL: `https://nawra-backend-pd.vercel.app/openapi.json`
   - Click "Import"

2. **Set Up Authentication**
   - Create a new environment
   - Add variable: `base_url` = `https://nawra-backend-pd.vercel.app`
   - Add variable: `access_token` (leave empty initially)

3. **Login**
   - Send POST request to `{{base_url}}/api/v1/auth/login`
   - Copy `access_token` from response
   - Set it as the `access_token` environment variable

4. **Test Protected Endpoints**
   - In request headers, add: `Authorization: Bearer {{access_token}}`
   - Send requests to protected endpoints

## Health Check

Monitor API health and database connectivity:

```bash
curl https://nawra-backend-pd.vercel.app/api/health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-01T00:00:00.000000",
  "environment": "production"
}
```

## Rate Limits

Currently, no rate limits are enforced. This will be added in future updates.

## Support

For issues or questions:
- **Email**: support@nawra.om
- **GitHub Issues**: https://github.com/jaleelaaa/NAWRA/issues

## License

MIT License

---

Built with ❤️ for NAWRA Library
