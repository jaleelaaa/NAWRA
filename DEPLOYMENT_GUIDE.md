# NAWRA Library Management System - Vercel Deployment Guide

## 🚀 Quick Deploy Using Vercel Dashboard (Recommended)

### Step 1: Access Vercel Dashboard
1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account (if not already signed in)

### Step 2: Import GitHub Repository

#### Deploy Frontend (Next.js)
1. Click **"Add New"** → **"Project"**
2. Select **"Import Git Repository"**
3. Find and select: `jaleelaaa/NAWRA`
4. Click **"Import"**

#### Configure Frontend Build Settings
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### Add Frontend Environment Variables
Click **"Environment Variables"** and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://gcthmfmxsyddplmkifbd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdGhtZm14c3lkZHBsbWtpZmJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NTIyNDgsImV4cCI6MjA3ODIyODI0OH0.D1Ted0FHmQiq_JLZhCN7neMPUavirW-tAW2yuiKmkgM
```

**Note**: You'll update `NEXT_PUBLIC_API_URL` after deploying the backend.

5. Click **"Deploy"**
6. Wait for deployment to complete (2-5 minutes)
7. Copy your frontend URL (e.g., `https://nawra-frontend.vercel.app`)

---

#### Deploy Backend (FastAPI)
1. Go back to Vercel Dashboard
2. Click **"Add New"** → **"Project"**
3. Select the same repository: `jaleelaaa/NAWRA`
4. Click **"Import"**

#### Configure Backend Build Settings
```
Framework Preset: Other
Root Directory: backend
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: pip install -r requirements.txt
```

#### Add Backend Environment Variables
Click **"Environment Variables"** and add:

```env
SUPABASE_URL=https://gcthmfmxsyddplmkifbd.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdGhtZm14c3lkZHBsbWtpZmJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NTIyNDgsImV4cCI6MjA3ODIyODI0OH0.D1Ted0FHmQiq_JLZhCN7neMPUavirW-tAW2yuiKmkgM
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdGhtZm14c3lkZHBsbWtpZmJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY1MjI0OCwiZXhwIjoyMDc4MjI4MjQ4fQ.MrKrCefmQpPYZHXBccXeUapUhqmg9VSz2QHXYqzL9vY
ENVIRONMENT=production
SECRET_KEY=your-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

**Important**: Update `CORS_ORIGINS` with your actual frontend URL.

5. Click **"Deploy"**
6. Wait for deployment to complete (2-5 minutes)
7. Copy your backend URL (e.g., `https://nawra-backend.vercel.app`)

---

### Step 3: Update Frontend Environment Variables
1. Go to your **Frontend project** in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_API_URL` and set it to your backend URL:
   ```
   NEXT_PUBLIC_API_URL=https://nawra-backend.vercel.app
   ```
4. Click **"Save"**
5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment

---

### Step 4: Update Backend CORS Settings
1. Go to your **Backend project** in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Edit `CORS_ORIGINS` and set it to your frontend URL:
   ```
   CORS_ORIGINS=https://nawra-frontend.vercel.app
   ```
4. Click **"Save"**
5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment

---

### Step 5: Test Your Deployment

#### Test Backend API
1. Visit: `https://your-backend-url.vercel.app`
   - Should show: `{"message": "NAWRA Library Management System API"}`
2. Visit: `https://your-backend-url.vercel.app/api/health`
   - Should show database connection status
3. Visit: `https://your-backend-url.vercel.app/docs`
   - Should display FastAPI interactive documentation

#### Test Frontend Application
1. Visit: `https://your-frontend-url.vercel.app/en/login`
2. Login with test credentials:
   - **Email**: admin@nawra.om
   - **Password**: Admin@123456
3. Navigate to dashboard
4. Switch between English and Arabic
5. Test all navigation links

---

## 🔧 Alternative: Deploy Using Vercel CLI

If you prefer using the command line:

### 1. Login to Vercel
```bash
vercel login
```
Follow the browser authentication flow.

### 2. Deploy Frontend
```bash
cd "D:\Library-Management Project\NAWRA\frontend"
vercel --prod
```
Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: nawra-frontend
- **Directory**: ./
- **Override settings**: No

### 3. Deploy Backend
```bash
cd "D:\Library-Management Project\NAWRA\backend"
vercel --prod
```
Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: nawra-backend
- **Directory**: ./
- **Override settings**: No

### 4. Add Environment Variables via CLI
```bash
# For frontend
cd "D:\Library-Management Project\NAWRA\frontend"
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# For backend
cd "D:\Library-Management Project\NAWRA\backend"
vercel env add SUPABASE_URL production
vercel env add SUPABASE_KEY production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add ENVIRONMENT production
vercel env add SECRET_KEY production
vercel env add ALGORITHM production
vercel env add ACCESS_TOKEN_EXPIRE_MINUTES production
vercel env add CORS_ORIGINS production
```

### 5. Redeploy After Adding Environment Variables
```bash
# Redeploy frontend
cd "D:\Library-Management Project\NAWRA\frontend"
vercel --prod

# Redeploy backend
cd "D:\Library-Management Project\NAWRA\backend"
vercel --prod
```

---

## 📋 Post-Deployment Checklist

- [ ] Frontend deploys successfully
- [ ] Backend deploys successfully
- [ ] Backend API health check passes
- [ ] Frontend can connect to backend API
- [ ] Login functionality works
- [ ] Dashboard loads with correct data
- [ ] Language switching (EN/AR) works correctly
- [ ] RTL/LTR layout switches properly
- [ ] All charts display correctly
- [ ] Scrolling banner animation works
- [ ] Pie chart shows multiple colors
- [ ] All navigation links work

---

## 🐛 Troubleshooting

### Frontend Issues

**Issue**: Frontend shows "Network Error"
- **Solution**: Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend is deployed and healthy

**Issue**: Arabic/RTL not working
- **Solution**: Clear browser cache and hard reload (Ctrl+Shift+R)

**Issue**: Build fails
- **Solution**: Check build logs in Vercel dashboard
- Ensure all dependencies are listed in package.json

### Backend Issues

**Issue**: Backend shows 500 error
- **Solution**: Check environment variables are set correctly
- Visit `/api/health` endpoint to check database connection

**Issue**: CORS error in browser console
- **Solution**: Update `CORS_ORIGINS` in backend environment variables
- Include your exact frontend URL (no trailing slash)

**Issue**: Database connection fails
- **Solution**: Verify Supabase credentials
- Check Supabase project is active and accessible

### General Issues

**Issue**: Changes not reflected after git push
- **Solution**: Vercel auto-deploys on push to master
- Check Deployments tab to see if build succeeded
- Force redeploy if needed

**Issue**: Environment variables not updating
- **Solution**: After changing environment variables, always redeploy
- Environment variables only apply to new builds

---

## 🔐 Security Recommendations for Production

1. **Change SECRET_KEY**: Generate a strong random secret key
   ```bash
   openssl rand -hex 32
   ```

2. **Use Environment-Specific Keys**: Don't use development keys in production

3. **Enable Supabase RLS**: Set up Row Level Security policies in Supabase

4. **Set up Custom Domain**: Configure custom domain in Vercel for professional URLs

5. **Enable HTTPS Only**: Vercel provides this by default

6. **Monitor Logs**: Regularly check Vercel logs for errors or security issues

---

## 📞 Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Test backend `/api/health` endpoint
5. Check Supabase dashboard for database issues

---

## 🎉 Deployment Complete!

Your NAWRA Library Management System is now live on Vercel!

- **Frontend**: `https://your-frontend-url.vercel.app`
- **Backend**: `https://your-backend-url.vercel.app`
- **API Docs**: `https://your-backend-url.vercel.app/docs`

Share your deployment URLs with your team and start managing your library! 📚
