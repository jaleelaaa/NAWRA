# NAWRA Deployment Guide

Complete guide for deploying the NAWRA Library Management System to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Security Preparation](#security-preparation)
3. [Backend Deployment (Railway/Render)](#backend-deployment)
4. [Frontend Deployment (Vercel)](#frontend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [x] GitHub account with repository access: https://github.com/jaleelaaa/NAWRA
- [x] Supabase project set up: https://app.supabase.com
- [x] Vercel account: https://vercel.com
- [x] Railway.app OR Render.com account for backend
- [x] Git installed locally
- [x] Node.js 18+ and Python 3.11+ installed

---

## Security Preparation

### 1. Verify .gitignore

Ensure the root `.gitignore` file includes:

```gitignore
# Environment Variables
.env
.env.local
.env.*.local
*.env

# Dependencies
node_modules/
venv/
__pycache__/

# Build outputs
.next/
dist/
build/
```

### 2. Backup Current Environment Files

```bash
# Create a secure backup directory (NOT in the project)
mkdir ~/nawra-secrets-backup
cp backend/.env ~/nawra-secrets-backup/backend.env
cp frontend/.env.local ~/nawra-secrets-backup/frontend.env.local
```

### 3. Regenerate Supabase Keys (RECOMMENDED)

For production security, regenerate your Supabase API keys:

1. Go to: https://app.supabase.com/project/_/settings/api
2. Click "Reset JWT Secret" (this will invalidate old keys)
3. Copy new keys to your backup file
4. Update your local `.env` files with new keys

### 4. Verify No Secrets in Code

```bash
# Search for any hardcoded credentials
cd "E:\Library-Management Project\NAWRA"
grep -r "supabase.co" --exclude-dir=node_modules --exclude-dir=venv --exclude="*.md"
grep -r "eyJhbGci" --exclude-dir=node_modules --exclude-dir=venv --exclude="*.md"
```

If any results appear in `.ts`, `.tsx`, `.py` files (not `.env` files), remove them immediately.

---

## Backend Deployment

### Option A: Railway.app (Recommended)

#### 1. Create Railway Project

1. Go to: https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select: `jaleelaaa/NAWRA`
4. Choose root directory: `backend/`

#### 2. Configure Build Settings

Railway should auto-detect Python. If not:

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### 3. Add Environment Variables

In Railway dashboard, add these variables:

```bash
ENVIRONMENT=production
SECRET_KEY=<generate-new-key-with-openssl-rand-hex-32>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-role-key>
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-custom-domain.com
```

To generate a secure `SECRET_KEY`:
```bash
openssl rand -hex 32
```

#### 4. Deploy

Railway will automatically deploy. Once deployed, copy the production URL:
```
https://nawra-backend-production.up.railway.app
```

---

### Option B: Render.com

#### 1. Create Web Service

1. Go to: https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository: `jaleelaaa/NAWRA`
4. Root Directory: `backend`

#### 2. Configure Service

- **Name**: nawra-backend
- **Environment**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan**: Free (or paid for better performance)

#### 3. Environment Variables

Same as Railway configuration above.

#### 4. Deploy

Click "Create Web Service" and wait for deployment.

---

## Frontend Deployment

### Vercel Deployment (Recommended)

#### 1. Connect GitHub Repository

1. Go to: https://vercel.com/new
2. Import Git Repository: `jaleelaaa/NAWRA`
3. **Root Directory**: Set to `frontend/`
4. **Framework Preset**: Next.js (should auto-detect)

#### 2. Configure Build Settings

Vercel should auto-configure, but verify:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

#### 3. Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```bash
NEXT_PUBLIC_API_URL=https://nawra-backend-production.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=<optional-redis-url>
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN=<optional-redis-token>
```

**IMPORTANT**: Use your actual backend URL from Railway/Render.

#### 4. Deploy

Click "Deploy" and wait for the build to complete.

Your frontend will be available at:
```
https://nawra-<random-id>.vercel.app
```

---

## Environment Configuration

### Update Backend CORS

After frontend is deployed, update backend environment variables:

**Railway/Render Dashboard** → Environment Variables:

```bash
CORS_ORIGINS=https://nawra-<your-id>.vercel.app,https://your-custom-domain.com
```

Redeploy backend after updating.

### Verify API Connection

Test the connection:

```bash
curl https://nawra-backend-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": {
    "status": "healthy"
  }
}
```

---

## Post-Deployment

### 1. Test Authentication

Visit your deployed frontend:
```
https://nawra-<your-id>.vercel.app/en/login
```

Login with test credentials:
- Email: `admin@nawra.om`
- Password: `Admin@123`

### 2. Test API Endpoints

Check Swagger docs:
```
https://nawra-backend-production.up.railway.app/docs
```

### 3. Run E2E Tests Against Production

Update Playwright config with production URL:

```typescript
// frontend/playwright.config.ts
use: {
  baseURL: 'https://nawra-<your-id>.vercel.app',
}
```

Run tests:
```bash
cd frontend
npx playwright test
```

### 4. Set Up Custom Domain (Optional)

#### Vercel (Frontend):
1. Go to: Project Settings → Domains
2. Add your domain: `library.nawra.om`
3. Configure DNS records as instructed

#### Railway (Backend):
1. Go to: Service Settings → Domains
2. Add custom domain: `api.nawra.om`
3. Configure DNS records

---

## GitHub Secrets Configuration

For CI/CD workflows, configure these GitHub Secrets:

1. Go to: https://github.com/jaleelaaa/NAWRA/settings/secrets/actions
2. Click "New repository secret" for each:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-role-key>

# Backend
SECRET_KEY=<your-secret-key>

# Vercel (for automated deployments)
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>

# Railway (for automated deployments)
RAILWAY_TOKEN=<your-railway-token>
```

---

## Troubleshooting

### Build Failures

**Frontend Build Error: "API connection failed"**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend is deployed and accessible
- Verify CORS configuration in backend

**Backend Build Error: "Module not found"**
- Verify `requirements.txt` is complete
- Check Python version (3.11+ required)
- Try adding `pip install --upgrade pip` to build command

### CORS Errors

**Error: "Access-Control-Allow-Origin"**

Backend `.env` must include frontend URL:
```bash
CORS_ORIGINS=https://your-frontend.vercel.app
```

Redeploy backend after updating.

### Database Connection Issues

**Error: "Database unhealthy"**
- Verify Supabase credentials are correct
- Check Supabase project is not paused
- Verify service role key has correct permissions

### Authentication Not Working

**Error: "Invalid credentials"**
- Verify backend API URL in frontend env
- Check JWT SECRET_KEY is set in backend
- Test backend `/health` endpoint directly
- Verify Supabase connection is working

---

## Monitoring & Logs

### Railway Logs
```bash
railway logs
```

### Vercel Logs
Go to: Dashboard → Project → Deployments → Click deployment → Logs

### Supabase Logs
Go to: https://app.supabase.com/project/_/logs/explorer

---

## Backup Strategy

### Database Backups
Supabase automatically backs up your database. Configure manual backups:
1. Go to: https://app.supabase.com/project/_/database/backups
2. Enable daily backups
3. Configure retention period

### Code Backups
- All code is version controlled in GitHub
- Tag stable releases: `git tag -a v1.0.0 -m "Production release"`
- Push tags: `git push origin --tags`

---

## Security Best Practices

1. **Never commit `.env` files** to GitHub
2. **Rotate secrets regularly** (quarterly recommended)
3. **Use different keys** for dev/staging/production
4. **Enable 2FA** on all service accounts (GitHub, Vercel, Railway, Supabase)
5. **Monitor logs** for suspicious activity
6. **Keep dependencies updated**: `npm audit`, `pip check`

---

## Support

- **Issues**: https://github.com/jaleelaaa/NAWRA/issues
- **Documentation**: https://github.com/jaleelaaa/NAWRA/blob/main/README.md
- **API Docs**: https://your-backend-url.railway.app/docs

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | https://nawra-<id>.vercel.app | Next.js app |
| Backend | https://nawra-backend.railway.app | FastAPI |
| API Docs | https://nawra-backend.railway.app/docs | Swagger UI |
| Database | https://app.supabase.com | PostgreSQL |
| GitHub | https://github.com/jaleelaaa/NAWRA | Source code |

---

**Last Updated**: 2025-11-11
**Version**: 1.0.0
