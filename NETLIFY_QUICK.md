# Netlify Deployment - Quick Guide

## Via Netlify Website (No CLI needed)

### 1. Go to Netlify
Visit [netlify.com](https://netlify.com) and sign up/login

### 2. Add New Site
- Click **"Add new site"** → **"Import an existing project"**
- Connect to **GitHub** (or your Git provider)
- Select your repository

### 3. Configure Build Settings
```
Base directory: web-app
Build command: npm run build  
Publish directory: web-app/dist
```

### 4. Add Environment Variables
Click "Show advanced" → Add variables:
- `VITE_API_BASE_URL` = `https://your-api-domain.com`
- `VITE_BOT_USERNAME` = `your_bot_username`

### 5. Deploy
Click **"Deploy site"** and wait ~2 minutes

### 6. Done!
Your site is live at: `https://your-site.netlify.app`

---

## Visual Guide

```
Netlify Dashboard
    ↓
Add new site
    ↓
Import from GitHub
    ↓
Select Repository
    ↓
Configure:
  Base: web-app
  Build: npm run build
  Publish: web-app/dist
    ↓
Add Environment Variables
    ↓
Deploy Site
    ↓
✅ Live!
```

---

**Need detailed steps?** See `NETLIFY_DEPLOY.md`

