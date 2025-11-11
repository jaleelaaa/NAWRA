# NAWRA Vercel Deployment Guide

Complete step-by-step guide to deploy NAWRA to Vercel (both frontend and backend).

---

## 📋 Prerequisites

- ✅ GitHub account with NAWRA repository: https://github.com/jaleelaaa/NAWRA
- ✅ Vercel account (free): https://vercel.com/signup
- ✅ Supabase credentials ready

---

## 🚀 Part 1: Deploy Backend to Vercel

### Step 1: Sign Up / Log In to Vercel

1. Go to: https://vercel.com/signup
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your GitHub account

### Step 2: Create New Project for Backend

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Find and select: `jaleelaaa/NAWRA`
4. Click **"Import"**

### Step 3: Configure Backend Project

**General Settings:**
```
Project Name: nawra-backend
Framework Preset: Other
Root Directory: backend/
```

**Build & Development Settings:**
```
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: pip install -r requirements.txt
Development Command: (leave empty)
```

### Step 4: Add Backend Environment Variables

Click on **"Environment Variables"** and add these one by one:

#### 1. ENVIRONMENT
```
ENVIRONMENT
```
Value:
```
production
```

#### 2. SECRET_KEY
Generate a secure key by running this in your terminal:
```bash
openssl rand -hex 32
```
Copy the output and paste as the value.

Example output: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`

```
SECRET_KEY
```
Value:
```
(paste the generated key)
```

#### 3. SUPABASE_URL
```
SUPABASE_URL
```
Value:
```
https://gcthmfmxsyddplmkifbd.supabase.co
```

#### 4. SUPABASE_KEY (Anon Key)
Get this from your local `backend/.env` file or Supabase dashboard.

```
SUPABASE_KEY
```
Value:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdGhtZm14c3lkZHBsbWtpZmJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NTIyNDgsImV4cCI6MjA3ODIyODI0OH0.D1Ted0FHmQiq_JLZhCN7neMPUavirW-tAW2yuiKmkgM
```

#### 5. SUPABASE_SERVICE_KEY
Get this from your local `backend/.env` file or Supabase dashboard.

```
SUPABASE_SERVICE_KEY
```
Value:
```
(paste your service role key from backend/.env)
```

#### 6. CORS_ORIGINS
We'll update this after frontend deployment. For now use:

```
CORS_ORIGINS
```
Value:
```
http://localhost:3000,https://nawra-frontend.vercel.app
```

### Step 5: Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment to complete (~2-3 minutes)
3. Once deployed, copy your backend URL

Example backend URL:
```
https://nawra-backend-xyz123.vercel.app
```

### Step 6: Test Backend Deployment

Visit your backend URL:
```
https://nawra-backend-xyz123.vercel.app
```

You should see:
```json
{
  "message": "NAWRA Library Management System API",
  "version": "1.0.0",
  "status": "running",
  "docs": "/docs",
  "deployment": "vercel-serverless"
}
```

Check API documentation:
```
https://nawra-backend-xyz123.vercel.app/docs
```

Check health endpoint:
```
https://nawra-backend-xyz123.vercel.app/health
```

---

## 🚀 Part 2: Deploy Frontend to Vercel

### Step 1: Create New Project for Frontend

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Find and select: `jaleelaaa/NAWRA` (again)
4. Click **"Import"**

### Step 2: Configure Frontend Project

**General Settings:**
```
Project Name: nawra-frontend
Framework Preset: Next.js (auto-detected)
Root Directory: frontend/
```

**Build & Development Settings:**
```
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
Development Command: npm run dev (auto-detected)
```

### Step 3: Add Frontend Environment Variables

Click on **"Environment Variables"** and add these:

#### 1. NEXT_PUBLIC_API_URL
Use your backend URL from Part 1:

```
NEXT_PUBLIC_API_URL
```
Value:
```
https://nawra-backend-xyz123.vercel.app
```
(Replace with YOUR actual backend URL!)

#### 2. NEXT_PUBLIC_SUPABASE_URL
```
NEXT_PUBLIC_SUPABASE_URL
```
Value:
```
https://gcthmfmxsyddplmkifbd.supabase.co
```

#### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY
Get this from your local `frontend/.env.local` file.

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Value:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdGhtZm14c3lkZHBsbWtpZmJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NTIyNDgsImV4cCI6MjA3ODIyODI0OH0.D1Ted0FHmQiq_JLZhCN7neMPUavirW-tAW2yuiKmkgM
```

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment to complete (~3-4 minutes)
3. Once deployed, copy your frontend URL

Example frontend URL:
```
https://nawra-frontend-abc456.vercel.app
```

---

## 🔧 Part 3: Update CORS Configuration

Now that frontend is deployed, update backend CORS:

1. Go to your **backend project** in Vercel dashboard
2. Go to: **Settings → Environment Variables**
3. Find **CORS_ORIGINS** and click **Edit**
4. Update value to include your frontend URL:

```
CORS_ORIGINS
```
New Value:
```
https://nawra-frontend-abc456.vercel.app
```
(Replace with YOUR actual frontend URL!)

5. Click **Save**
6. Go to **Deployments** tab
7. Click **"Redeploy"** on the latest deployment

---

## ✅ Part 4: Test Your Deployment

### Test Frontend

Visit your frontend:
```
https://nawra-frontend-abc456.vercel.app
```

Navigate to login page:
```
https://nawra-frontend-abc456.vercel.app/en/login
```

### Test Login

Use test credentials:
- **Email**: `admin@nawra.om`
- **Password**: `Admin@123`

### Test Dashboard

After login, you should see:
```
https://nawra-frontend-abc456.vercel.app/en/dashboard
```

### Test API Connection

Check that dashboard loads data from backend API.

---

## 📊 Deployment URLs Summary

After deployment, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | https://nawra-frontend-abc456.vercel.app | Next.js application |
| **Backend** | https://nawra-backend-xyz123.vercel.app | FastAPI REST API |
| **API Docs** | https://nawra-backend-xyz123.vercel.app/docs | Swagger UI |
| **Health Check** | https://nawra-backend-xyz123.vercel.app/health | System status |

---

## 🔐 Security Notes

### Credentials Used in Deployment

Your Supabase credentials are:
- **URL**: `https://gcthmfmxsyddplmkifbd.supabase.co`
- **Anon Key**: (in your local `.env` files)
- **Service Role Key**: (in your local `.env` files)

### Important Security Practices

1. ✅ Never commit `.env` files to GitHub (already configured)
2. ✅ Use different keys for dev/staging/production (recommended)
3. ✅ Rotate secrets regularly (quarterly recommended)
4. ✅ Enable 2FA on Vercel and GitHub accounts
5. ✅ Monitor Vercel deployment logs for suspicious activity

---

## ⚠️ Known Limitations (Vercel Serverless)

### 1. No Background Tasks
- Vercel serverless functions are stateless
- The Supabase keep-alive task (in `main.py`) **won't work** on Vercel
- Backend uses `app.py` which doesn't include keep-alive
- **Impact**: Supabase Free tier may still pause after 1 week of inactivity

### 2. Cold Starts
- First request after inactivity may take 3-5 seconds
- Subsequent requests are fast

### 3. Function Timeout
- Vercel free tier: 10 second timeout per function
- Should be sufficient for NAWRA's operations

---

## 🐛 Troubleshooting

### Frontend shows "API connection failed"

**Check:**
1. Backend is deployed and running
2. `NEXT_PUBLIC_API_URL` in frontend env points to correct backend URL
3. CORS is configured correctly in backend

**Fix:**
1. Verify backend health: `https://your-backend.vercel.app/health`
2. Check Vercel logs: Dashboard → Project → Logs
3. Update `CORS_ORIGINS` in backend env variables
4. Redeploy backend

### Login fails with 401 Unauthorized

**Check:**
1. Supabase credentials are correct
2. Backend can connect to Supabase
3. Check backend health endpoint

**Fix:**
1. Verify `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_KEY` in backend env
2. Test credentials in local development first
3. Check Vercel logs for specific error messages

### Backend returns 500 Internal Server Error

**Check:**
1. All environment variables are set correctly
2. Supabase project is active (not paused)
3. Check Vercel function logs

**Fix:**
1. Go to Vercel Dashboard → Project → Logs
2. Look for Python errors
3. Verify all required packages in `requirements.txt`

### Build fails during deployment

**Check:**
1. Root directory is set correctly (`frontend/` or `backend/`)
2. All dependencies are in package.json / requirements.txt
3. No syntax errors in code

**Fix:**
1. Check deployment logs in Vercel
2. Test build locally: `npm run build` (frontend) or `pip install -r requirements.txt` (backend)
3. Fix any errors and push to GitHub

---

## 📈 Monitoring Your Deployment

### Vercel Dashboard

Monitor your deployment:
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Check:
   - **Deployments**: Build status and history
   - **Logs**: Real-time function logs
   - **Analytics**: Usage and performance
   - **Speed Insights**: Page load performance

### Supabase Dashboard

Monitor database:
1. Go to: https://app.supabase.com
2. Select your project
3. Check:
   - **Database**: Active connections
   - **Logs**: Query logs and errors
   - **API**: Request statistics

---

## 🔄 Redeployment

### When to Redeploy

Redeploy when:
- Environment variables change
- Code is updated in GitHub (auto-redeploys)
- Configuration changes

### How to Redeploy

**Automatic (Recommended):**
1. Push code to GitHub
2. Vercel auto-deploys

**Manual:**
1. Go to Vercel Dashboard → Project
2. Go to Deployments tab
3. Click three dots on latest deployment
4. Click **"Redeploy"**

---

## 📞 Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **NAWRA GitHub**: https://github.com/jaleelaaa/NAWRA
- **Supabase Docs**: https://supabase.com/docs

---

## ✨ Next Steps After Deployment

1. **Test All Features**: Login, dashboard, user management, etc.
2. **Run E2E Tests**: Update Playwright config with production URL
3. **Set Up Custom Domain** (Optional): Configure in Vercel dashboard
4. **Add Monitoring**: Set up Sentry or error tracking
5. **Document Deployment**: Update README with live URLs
6. **Share**: Get feedback from users!

---

**🎉 Congratulations!**

Your NAWRA Library Management System is now live on Vercel!

**Frontend**: https://nawra-frontend.vercel.app
**Backend**: https://nawra-backend.vercel.app
**API Docs**: https://nawra-backend.vercel.app/docs

---

**Last Updated**: 2025-11-11
**Version**: 1.0.0
