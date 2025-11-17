# NAWRA Deployment Guide - Render CI/CD

This guide explains how to set up automated deployment for the NAWRA Library Management System using GitHub Actions and Render.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Render Services Setup](#render-services-setup)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [Deployment Workflows](#deployment-workflows)
- [Manual Deployment](#manual-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before setting up CI/CD, ensure you have:

- ✅ GitHub repository with NAWRA code
- ✅ Render account with two services created:
  - **Backend Service**: `srv-d49ql1i4d50c739k8ao0`
  - **Frontend Service**: `srv-d49q6uripnbc7397nor0`
- ✅ Admin access to GitHub repository settings
- ✅ Render API access or Deploy Hook URLs

---

## Render Services Setup

### 1. Backend Service (FastAPI)

**Service ID**: `srv-d49ql1i4d50c739k8ao0`

#### Configuration:
```yaml
Name: nawra-backend
Environment: Python 3.13
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Root Directory: backend
Branch: main (or master)
```

#### Environment Variables:
```bash
# Database
DATABASE_URL=<your-supabase-connection-string>
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>

# Security
JWT_SECRET_KEY=<your-secret-key>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["https://your-frontend-url.onrender.com"]

# Python
PYTHON_VERSION=3.13
```

#### Get Deploy Hook:
1. Go to: https://dashboard.render.com/web/srv-d49ql1i4d50c739k8ao0
2. Click **Settings** → **Deploy Hook**
3. Copy the Deploy Hook URL (looks like: `https://api.render.com/deploy/srv-xxx?key=yyy`)

---

### 2. Frontend Service (Next.js)

**Service ID**: `srv-d49q6uripnbc7397nor0`

#### Configuration:
```yaml
Name: nawra-frontend
Environment: Node 20
Build Command: npm install && npm run build
Start Command: npm start
Root Directory: frontend
Branch: main (or master)
```

#### Environment Variables:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=<your-backend-url>

# Build Configuration
NODE_ENV=production
NODE_VERSION=20

# Next.js
NEXT_TELEMETRY_DISABLED=1
```

#### Get Deploy Hook:
1. Go to: https://dashboard.render.com/web/srv-d49q6uripnbc7397nor0
2. Click **Settings** → **Deploy Hook**
3. Copy the Deploy Hook URL

---

## GitHub Secrets Configuration

### Step-by-Step Setup:

1. **Navigate to GitHub Repository**
   - Go to your NAWRA repository on GitHub
   - Click **Settings** → **Secrets and variables** → **Actions**

2. **Add Backend Deploy Hook**
   - Click **New repository secret**
   - **Name**: `RENDER_BACKEND_DEPLOY_HOOK`
   - **Secret**: Paste your backend deploy hook URL
   - Click **Add secret**

3. **Add Frontend Deploy Hook**
   - Click **New repository secret**
   - **Name**: `RENDER_FRONTEND_DEPLOY_HOOK`
   - **Secret**: Paste your frontend deploy hook URL
   - Click **Add secret**

4. **Add Frontend API URL** (Optional but recommended)
   - Click **New repository secret**
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Secret**: Your backend URL (e.g., `https://nawra-backend.onrender.com`)
   - Click **Add secret**

### Required Secrets Summary:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `RENDER_BACKEND_DEPLOY_HOOK` | Backend deploy hook URL | `https://api.render.com/deploy/srv-xxx?key=yyy` |
| `RENDER_FRONTEND_DEPLOY_HOOK` | Frontend deploy hook URL | `https://api.render.com/deploy/srv-xxx?key=zzz` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://nawra-backend.onrender.com` |

---

## Deployment Workflows

### Automatic Deployment

The CI/CD pipeline automatically deploys when:

#### Backend Deployment Triggers:
- ✅ Push to `main` or `master` branch
- ✅ Changes in `backend/**` directory
- ✅ Changes in `.github/workflows/deploy-backend.yml`
- ✅ Manual trigger via GitHub Actions UI

#### Frontend Deployment Triggers:
- ✅ Push to `main` or `master` branch
- ✅ Changes in `frontend/**` directory
- ✅ Changes in `.github/workflows/deploy-frontend.yml`
- ✅ Manual trigger via GitHub Actions UI

### Workflow Stages

Both workflows follow this pattern:

```
1. Test Stage
   ├── Checkout code
   ├── Setup environment (Python 3.13 / Node 20)
   ├── Install dependencies
   ├── Run linting
   ├── Run tests
   └── Build application (frontend only)

2. Deploy Stage
   ├── Trigger Render deployment
   ├── Verify deployment response
   └── Generate deployment summary

3. Notify Stage
   ├── Success notification
   └── Failure notification (if applicable)
```

---

## Manual Deployment

### Method 1: GitHub Actions UI

1. Go to **Actions** tab in your GitHub repository
2. Select the workflow:
   - **Deploy Backend to Render** or
   - **Deploy Frontend to Render**
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow** button

### Method 2: Git Push

```bash
# For Backend
git add backend/
git commit -m "Update backend: <your changes>"
git push origin main

# For Frontend
git add frontend/
git commit -m "Update frontend: <your changes>"
git push origin main

# For Both (Full Stack)
git add .
git commit -m "Update: <your changes>"
git push origin main
```

### Method 3: Render Dashboard

1. **Backend**: https://dashboard.render.com/web/srv-d49ql1i4d50c739k8ao0
2. **Frontend**: https://dashboard.render.com/web/srv-d49q6uripnbc7397nor0
3. Click **Manual Deploy** → **Deploy latest commit**

---

## Monitoring Deployments

### GitHub Actions

1. Go to **Actions** tab in GitHub repository
2. Click on the running/completed workflow
3. View logs for each step
4. Check **Summary** for deployment status

### Render Dashboard

**Backend Logs**:
- Dashboard: https://dashboard.render.com/web/srv-d49ql1i4d50c739k8ao0
- Click **Logs** to view real-time deployment logs

**Frontend Logs**:
- Dashboard: https://dashboard.render.com/web/srv-d49q6uripnbc7397nor0
- Click **Logs** to view real-time deployment logs

---

## Troubleshooting

### Issue: "RENDER_BACKEND_DEPLOY_HOOK secret not set"

**Solution**:
1. Verify secret name is exactly: `RENDER_BACKEND_DEPLOY_HOOK`
2. Check secret value is the full deploy hook URL
3. Ensure secret is added to the repository (not organization)

### Issue: "Deployment failed with HTTP status: 404"

**Solution**:
1. Verify deploy hook URL is correct
2. Check if Render service still exists
3. Regenerate deploy hook in Render dashboard

### Issue: "Build failed - Module not found"

**Backend Solution**:
```bash
# Ensure requirements.txt is up to date
cd backend
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements.txt"
git push
```

**Frontend Solution**:
```bash
# Ensure package-lock.json is committed
cd frontend
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Issue: "Tests failing in CI/CD"

**Solution**:
The workflows have `continue-on-error: true` for tests to allow deployment even if tests fail. To make tests mandatory:

1. Edit `.github/workflows/deploy-backend.yml` or `deploy-frontend.yml`
2. Remove `continue-on-error: true` from test steps
3. Fix failing tests before pushing

### Issue: "Environment variables not working"

**Solution**:
1. Go to Render service dashboard
2. Click **Environment** → **Environment Variables**
3. Add/update required variables
4. Click **Save Changes**
5. Trigger manual deploy

### Issue: "CORS errors in production"

**Solution**:
Update backend `CORS_ORIGINS` environment variable in Render:
```bash
CORS_ORIGINS=["https://your-frontend-url.onrender.com","https://your-custom-domain.com"]
```

---

## Deployment Checklist

Before deploying to production, verify:

- [ ] All environment variables set in Render
- [ ] Deploy hooks added to GitHub Secrets
- [ ] Database migrations completed
- [ ] CORS origins configured correctly
- [ ] API URL configured in frontend
- [ ] SSL/HTTPS enabled on Render
- [ ] Custom domain configured (if applicable)
- [ ] Database backups enabled
- [ ] Monitoring and alerts configured

---

## Additional Resources

- **Render Documentation**: https://render.com/docs
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/

---

## Support

For issues or questions:
1. Check Render service logs
2. Review GitHub Actions workflow logs
3. Verify environment variables
4. Check Render status page: https://status.render.com

---

**Last Updated**: November 2025
**NAWRA Version**: 1.0
**Deployment Platform**: Render
