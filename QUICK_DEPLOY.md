# Quick Deployment - Choose Your Platform

## 🚀 Fastest: Vercel (2 minutes)

```bash
cd web-app
npm install -g vercel
vercel
```

1. Follow prompts
2. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL`
   - `VITE_BOT_USERNAME`
3. Done! Your app is live.

---

## 🚂 Railway (5 minutes)

```bash
cd web-app
npm install -g @railway/cli
railway login
railway init
railway variables set VITE_API_BASE_URL=https://your-api.com
railway variables set VITE_BOT_USERNAME=your_bot
railway up
```

---

## 🌐 Netlify (3 minutes)

```bash
cd web-app
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

Add environment variables in Netlify dashboard.

---

## 📦 Manual Server Deploy

```bash
# 1. Build
cd web-app
npm run build

# 2. Copy to server
rsync -avz --delete dist/ user@server.com:/var/www/web-app/

# 3. Configure Nginx (on server)
# See DEPLOY_STEPS.md for Nginx config
```

---

## ⚙️ Environment Variables Required

Set these **before building** (or in platform dashboard):

```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_BOT_USERNAME=your_bot_username
```

---

**Need detailed steps?** See `DEPLOY_STEPS.md`

