# 🚀 CI/CD Setup Checklist

Follow these steps in order to activate your automated deployment pipeline.

---

## ✅ Step 1: Get Render Deploy Hooks (5 minutes)

### Backend Deploy Hook

1. **Open Backend Service**:
   - URL: https://dashboard.render.com/web/srv-d49ql1i4d50c739k8ao0
   - Click **Settings** (left sidebar)

2. **Create Deploy Hook**:
   - Scroll to **Deploy Hook** section
   - Click **Create Deploy Hook** (if not already created)
   - **Copy the entire URL** (e.g., `https://api.render.com/deploy/srv-xxx?key=yyy`)
   - Save this URL somewhere safe (you'll need it in Step 2)

### Frontend Deploy Hook

1. **Open Frontend Service**:
   - URL: https://dashboard.render.com/web/srv-d49q6uripnbc7397nor0
   - Click **Settings** (left sidebar)

2. **Create Deploy Hook**:
   - Scroll to **Deploy Hook** section
   - Click **Create Deploy Hook** (if not already created)
   - **Copy the entire URL**
   - Save this URL somewhere safe

### Backend URL

- Get your backend URL from Render (e.g., `https://nawra-backend-xxx.onrender.com`)
- Save this URL (needed for frontend environment variable)

**✓ Checklist**:
- [ ] Backend deploy hook URL copied
- [ ] Frontend deploy hook URL copied
- [ ] Backend URL copied

---

## ✅ Step 2: Add GitHub Secrets (3 minutes)

1. **Go to GitHub Repository**:
   - URL: https://github.com/jaleelaaa/NAWRA
   - Click **Settings** tab

2. **Navigate to Secrets**:
   - Left sidebar: **Secrets and variables** → **Actions**

3. **Add Secret 1: Backend Deploy Hook**:
   - Click **New repository secret**
   - Name: `RENDER_BACKEND_DEPLOY_HOOK`
   - Secret: Paste backend deploy hook URL from Step 1
   - Click **Add secret**

4. **Add Secret 2: Frontend Deploy Hook**:
   - Click **New repository secret**
   - Name: `RENDER_FRONTEND_DEPLOY_HOOK`
   - Secret: Paste frontend deploy hook URL from Step 1
   - Click **Add secret**

5. **Add Secret 3: Backend API URL**:
   - Click **New repository secret**
   - Name: `NEXT_PUBLIC_API_URL`
   - Secret: Paste backend URL from Step 1
   - Click **Add secret**

**✓ Checklist**:
- [ ] `RENDER_BACKEND_DEPLOY_HOOK` secret added
- [ ] `RENDER_FRONTEND_DEPLOY_HOOK` secret added
- [ ] `NEXT_PUBLIC_API_URL` secret added

---

## ✅ Step 3: Verify Setup (2 minutes)

1. **Check GitHub Actions**:
   - Go to: https://github.com/jaleelaaa/NAWRA/actions
   - You should see two workflows:
     - **Deploy Backend to Render**
     - **Deploy Frontend to Render**

2. **Verify Secrets**:
   - Go to: https://github.com/jaleelaaa/NAWRA/settings/secrets/actions
   - Confirm all 3 secrets are listed

**✓ Checklist**:
- [ ] Workflows visible in Actions tab
- [ ] All 3 secrets confirmed

---

## ✅ Step 4: Test Deployment (5 minutes)

### Option A: Manual Trigger (Recommended)

**Backend:**
1. Go to: https://github.com/jaleelaaa/NAWRA/actions
2. Click **Deploy Backend to Render**
3. Click **Run workflow** button (top right)
4. Select branch: **master**
5. Click green **Run workflow** button
6. Wait and watch the deployment logs
7. Check status - should turn green ✅

**Frontend:**
1. Go to: https://github.com/jaleelaaa/NAWRA/actions
2. Click **Deploy Frontend to Render**
3. Click **Run workflow** button
4. Select branch: **master**
5. Click green **Run workflow** button
6. Wait and watch the deployment logs
7. Check status - should turn green ✅

### Option B: Push a Test Change

```bash
# Navigate to project
cd "d:\Library-Management Project\NAWRA"

# Make a small change
echo "" >> README.md

# Commit and push
git add README.md
git commit -m "Test CI/CD pipeline"
git push origin master

# Check Actions tab to see auto-deployment
```

**✓ Checklist**:
- [ ] Backend workflow runs successfully
- [ ] Frontend workflow runs successfully
- [ ] No errors in workflow logs

---

## ✅ Step 5: Verify Live Deployment (2 minutes)

1. **Check Backend Deployment**:
   - Dashboard: https://dashboard.render.com/web/srv-d49ql1i4d50c739k8ao0
   - Look for **Latest Deploy** status
   - Should show "Live" with green indicator

2. **Check Frontend Deployment**:
   - Dashboard: https://dashboard.render.com/web/srv-d49q6uripnbc7397nor0
   - Look for **Latest Deploy** status
   - Should show "Live" with green indicator

3. **Test Your Application**:
   - Visit your frontend URL
   - Verify it's working
   - Check API connectivity

**✓ Checklist**:
- [ ] Backend shows "Live" status
- [ ] Frontend shows "Live" status
- [ ] Application is accessible and working

---

## 🎉 Congratulations!

Your CI/CD pipeline is now active! From now on:

- **Every push to `master`** triggers automatic deployment
- **Changes in `backend/**`** deploy backend only
- **Changes in `frontend/**`** deploy frontend only
- **Manual triggers** available anytime from GitHub Actions

---

## 📖 Additional Resources

- **Full Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Quick Start Guide**: [.github/DEPLOYMENT_QUICK_START.md](.github/DEPLOYMENT_QUICK_START.md)
- **Architecture Diagram**: [NAWRA_Architecture_Diagram.drawio](NAWRA_Architecture_Diagram.drawio)

---

## 🆘 Troubleshooting

### "Secret not set" error
- Double-check secret names match exactly (case-sensitive)
- Verify secrets are added to **repository** (not organization)
- Re-add the secret if needed

### "Deployment failed" error
- Check deploy hook URL is correct
- Verify Render service is active
- Check Render service logs for errors

### Workflow doesn't trigger
- Ensure you pushed to **master** branch
- Check file paths in changes (must be in `backend/` or `frontend/`)
- Try manual trigger from Actions tab

---

## 📞 Need Help?

Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide for detailed troubleshooting steps.

**Last Updated**: November 2025
