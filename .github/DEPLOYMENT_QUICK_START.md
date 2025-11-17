# Quick Start: Render Deployment Setup

## 🚀 5-Minute Setup Guide

### Step 1: Get Deploy Hooks from Render

**Backend** (Service: `srv-d49ql1i4d50c739k8ao0`):
1. Go to: https://dashboard.render.com/web/srv-d49ql1i4d50c739k8ao0
2. Settings → Deploy Hook → Copy URL

**Frontend** (Service: `srv-d49q6uripnbc7397nor0`):
1. Go to: https://dashboard.render.com/web/srv-d49q6uripnbc7397nor0
2. Settings → Deploy Hook → Copy URL

---

### Step 2: Add Secrets to GitHub

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`
2. Click **New repository secret**
3. Add these secrets:

| Name | Value |
|------|-------|
| `RENDER_BACKEND_DEPLOY_HOOK` | Backend deploy hook URL from Step 1 |
| `RENDER_FRONTEND_DEPLOY_HOOK` | Frontend deploy hook URL from Step 1 |
| `NEXT_PUBLIC_API_URL` | Your backend URL (e.g., `https://nawra-backend.onrender.com`) |

---

### Step 3: Test the Deployment

**Option A: Push to GitHub**
```bash
git add .
git commit -m "Setup CI/CD"
git push origin main
```

**Option B: Manual Trigger**
1. Go to: GitHub → Actions tab
2. Select workflow
3. Click "Run workflow"

---

### Step 4: Monitor Deployment

**GitHub Actions**:
- https://github.com/YOUR_USERNAME/YOUR_REPO/actions

**Render Dashboards**:
- Backend: https://dashboard.render.com/web/srv-d49ql1i4d50c739k8ao0
- Frontend: https://dashboard.render.com/web/srv-d49q6uripnbc7397nor0

---

## ✅ That's it!

Your CI/CD pipeline is now active. Every push to `main` will automatically deploy to Render.

---

## Quick Commands

```bash
# Deploy backend only
git add backend/
git commit -m "Update backend"
git push origin main

# Deploy frontend only
git add frontend/
git commit -m "Update frontend"
git push origin main

# Deploy both
git add .
git commit -m "Update full stack"
git push origin main
```

---

## Need Help?

See the full [DEPLOYMENT.md](../DEPLOYMENT.md) guide for detailed instructions and troubleshooting.
