# Step-by-Step Deployment Guide

## Prerequisites

1. **Build the app locally first** (to test):
```bash
cd web-app
npm run build
```

2. **Set your environment variables** - Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your values
```

---

## Option 1: Deploy to Railway (Recommended for Quick Deploy)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login
```bash
railway login
```

### Step 3: Initialize Project
```bash
cd web-app
railway init
```

### Step 4: Set Environment Variables
```bash
railway variables set VITE_API_BASE_URL=https://your-api-domain.com
railway variables set VITE_BOT_USERNAME=your_bot_username
```

### Step 5: Deploy
```bash
railway up
```

**OR** via Dashboard:
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `web-app`
5. Add environment variables in Settings → Variables
6. Deploy automatically happens on push

---

## Option 2: Deploy to Vercel (Easiest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
cd web-app
vercel
```

### Step 4: Set Environment Variables
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `VITE_API_BASE_URL` = `https://your-api-domain.com`
   - `VITE_BOT_USERNAME` = `your_bot_username`
5. Redeploy (or it auto-deploys on next push)

**OR** via Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Set root directory to `web-app`
5. Add environment variables
6. Deploy

---

## Option 3: Deploy to Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login
```bash
netlify login
```

### Step 3: Build and Deploy
```bash
cd web-app
npm run build
netlify deploy --prod --dir=dist
```

### Step 4: Set Environment Variables
1. Go to [app.netlify.com](https://app.netlify.com)
2. Select your site
3. Go to Site settings → Environment variables
4. Add your variables
5. Trigger a new deploy

**OR** via Dashboard:
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Set:
   - Base directory: `web-app`
   - Build command: `npm run build`
   - Publish directory: `web-app/dist`
5. Add environment variables
6. Deploy

---

## Option 4: Deploy to Your Own Server

### Step 1: Build the App
```bash
cd web-app
npm run build
```

### Step 2: Copy to Server
```bash
# Using SCP
scp -r dist/* user@your-server.com:/var/www/web-app/

# OR using RSYNC (recommended)
rsync -avz --delete dist/ user@your-server.com:/var/www/web-app/
```

### Step 3: Configure Nginx
Create `/etc/nginx/sites-available/web-app`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/web-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Step 4: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/web-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Set up SSL (Optional but Recommended)
```bash
sudo certbot --nginx -d your-domain.com
```

---

## Option 5: Deploy to Render

### Step 1: Go to Render Dashboard
Visit [render.com](https://render.com) and sign up/login

### Step 2: Create New Static Site
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `indallo-web` (or your choice)
   - **Branch**: `main` (or your branch)
   - **Root Directory**: `web-app`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

### Step 3: Add Environment Variables
In the Environment section, add:
- `VITE_API_BASE_URL` = `https://your-api-domain.com`
- `VITE_BOT_USERNAME` = `your_bot_username`

### Step 4: Deploy
Click "Create Static Site" - Render will automatically deploy

---

## Option 6: Deploy to Cloudflare Pages

### Step 1: Go to Cloudflare Dashboard
Visit [dash.cloudflare.com](https://dash.cloudflare.com)

### Step 2: Create Pages Project
1. Go to Pages → Create a project
2. Connect your GitHub repository
3. Configure:
   - **Project name**: `indallo-web`
   - **Production branch**: `main`
   - **Framework preset**: `Vue`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `web-app`

### Step 3: Add Environment Variables
In Build settings → Environment variables, add:
- `VITE_API_BASE_URL` = `https://your-api-domain.com`
- `VITE_BOT_USERNAME` = `your_bot_username`

### Step 4: Deploy
Click "Save and Deploy"

---

## Important Notes

### Environment Variables
⚠️ **CRITICAL**: Vite environment variables must be set **BEFORE** building. They are embedded at build time, not runtime.

For platforms that build automatically:
- Set variables in the platform's dashboard **before** first deploy
- Or set them in the build command: `VITE_API_BASE_URL=... npm run build`

### Build Command
All platforms need:
```bash
npm run build
```

### Output Directory
All platforms should serve from:
```
dist/
```

### SPA Routing
Make sure your platform handles client-side routing (all routes serve `index.html`). Most platforms auto-detect this, but verify.

---

## Quick Comparison

| Platform | Free Tier | Setup Time | Best For |
|----------|-----------|------------|----------|
| **Vercel** | ✅ Generous | 2 min | Vue.js apps |
| **Railway** | ✅ $5 credit | 5 min | Full control |
| **Netlify** | ✅ Generous | 3 min | Static sites |
| **Render** | ✅ Free tier | 5 min | Simple deploys |
| **Cloudflare Pages** | ✅ Unlimited | 5 min | Fast CDN |
| **Own Server** | ❌ Server cost | 15 min | Full control |

---

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify Node.js version (18+ recommended)
- Check build logs for specific errors

### App Shows Blank Page
- Check browser console for errors
- Verify API_BASE_URL is correct
- Check CORS settings on your API server

### Routes Don't Work (404)
- Ensure SPA routing is configured
- Check that all routes serve `index.html`

### Environment Variables Not Working
- Rebuild after setting variables
- Variables must start with `VITE_`
- Check they're set in the platform dashboard

---

## Recommended: Vercel

**Fastest deployment:**
```bash
cd web-app
npm install -g vercel
vercel
# Follow prompts, add env vars in dashboard
```

Done in 2 minutes! 🚀

