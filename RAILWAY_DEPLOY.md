# Deploy to Railway

Railway is a great platform for deploying Vue.js apps. Here's how to deploy:

## Quick Deploy Steps

### 1. Install Railway CLI (Optional)
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Initialize Project
```bash
cd web-app
railway init
```

### 4. Set Environment Variables
In Railway dashboard or via CLI:
```bash
railway variables set VITE_API_BASE_URL=https://your-api-domain.com
railway variables set VITE_BOT_USERNAME=your_bot_username
```

**Important:** Railway needs these at BUILD time, so set them before deploying.

### 5. Deploy
```bash
railway up
```

Or connect your GitHub repo and Railway will auto-deploy on push.

---

## Via Railway Dashboard (Easiest)

1. **Go to** [railway.app](https://railway.app)
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"** (or upload the `web-app` folder)
5. **Set Root Directory** to `web-app` (if deploying from monorepo)
6. **Add Environment Variables:**
   - `VITE_API_BASE_URL=https://your-api-domain.com`
   - `VITE_BOT_USERNAME=your_bot_username`
7. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Start Command: `npx serve -s dist -l $PORT`
8. **Deploy!**

Railway will automatically:
- Install dependencies
- Run the build
- Serve the `dist/` folder
- Give you a URL like `your-app.railway.app`

---

## Alternative: Other Similar Services

### Vercel (Easiest - Recommended)
```bash
npm install -g vercel
cd web-app
vercel
```
Set environment variables in Vercel dashboard.

### Netlify
```bash
npm install -g netlify-cli
cd web-app
npm run build
netlify deploy --prod --dir=dist
```

### Render
1. Connect GitHub repo
2. Select "Static Site"
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables

### Cloudflare Pages
1. Connect GitHub repo
2. Framework preset: Vue
3. Build command: `npm run build`
4. Build output: `dist`
5. Add environment variables

---

## Environment Variables for All Platforms

Make sure to set these **before building**:
- `VITE_API_BASE_URL=https://your-api-domain.com`
- `VITE_BOT_USERNAME=your_bot_username`

**Note:** Vite environment variables must be set at BUILD time, not runtime.

---

## Railway vs Others

| Service | Free Tier | Ease | Best For |
|---------|-----------|------|----------|
| **Vercel** | ✅ Generous | ⭐⭐⭐⭐⭐ | Vue/React apps |
| **Railway** | ✅ $5 credit | ⭐⭐⭐⭐ | Full-stack apps |
| **Netlify** | ✅ Generous | ⭐⭐⭐⭐⭐ | Static sites |
| **Render** | ✅ Free tier | ⭐⭐⭐⭐ | Simple deploys |
| **Cloudflare Pages** | ✅ Unlimited | ⭐⭐⭐⭐ | Fast CDN |

**Recommendation:** Use **Vercel** - it's the easiest and best optimized for Vue.js.

