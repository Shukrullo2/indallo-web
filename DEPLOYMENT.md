# Deployment Guide

## Option 1: Deploy to Same Server (Easiest - Recommended)

Deploy the web app to your server alongside your Django backend.

### Steps:

1. **Build the production bundle:**
```bash
cd web-app
npm run build
```

This creates a `dist/` folder with all static files.

2. **Copy to server:**
```bash
# From your local machine
scp -r dist/* user@your-server.com:/var/www/web-app/
```

Or use rsync:
```bash
rsync -avz --delete dist/ user@your-server.com:/var/www/web-app/
```

3. **SSH into server and configure Nginx:**
```bash
ssh user@your-server.com
```

4. **Create Nginx configuration** (`/etc/nginx/sites-available/indallo-web`):
```nginx
server {
    listen 80;
    server_name web.your-domain.com;  # or use a subdomain
    
    root /var/www/indallo-web;
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

5. **Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/indallo-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

6. **Set up SSL (if needed):**
```bash
sudo certbot --nginx -d web.your-domain.com
```

---

## Option 2: Deploy to Vercel (Easiest for Quick Deploy)

Vercel is free and very easy for Vue.js apps.

### Steps:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd web-app
vercel
```

3. **Follow the prompts** - it will auto-detect Vue.js and configure everything.

4. **Set environment variables** in Vercel dashboard:
   - `VITE_API_BASE_URL=https://your-api-domain.com`
   - `VITE_BOT_USERNAME=your_bot_username`

5. **Done!** Your app will be live at `your-app.vercel.app`

---

## Option 3: Deploy to Netlify

Similar to Vercel, very easy.

### Steps:

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build and deploy:**
```bash
cd web-app
npm run build
netlify deploy --prod --dir=dist
```

3. **Set environment variables** in Netlify dashboard.

---

## Option 4: GitHub Pages (Free but requires GitHub Actions)

Good for open source projects.

### Steps:

1. **Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
        working-directory: ./web-app
      - run: npm run build
        working-directory: ./web-app
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_BOT_USERNAME: ${{ secrets.VITE_BOT_USERNAME }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./web-app/dist
```

2. **Push to GitHub** and it will auto-deploy.

---

## Quick Deploy Script (Option 1)

Create a deploy script for your server:

```bash
#!/bin/bash
# deploy.sh

echo "Building production bundle..."
cd web-app
npm run build

echo "Deploying to server..."
rsync -avz --delete dist/ user@your-server.com:/var/www/web-app/

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Environment Variables

Make sure to set these in production:
- `VITE_API_BASE_URL=https://your-api-domain.com`
- `VITE_BOT_USERNAME=your_bot_username`

For static hosting (Vercel/Netlify), set these in their dashboards.
For server deployment, create a `.env.production` file or set them during build.

---

## Recommended: Option 1 (Same Server)

Since you already have infrastructure, deploying to the same server is:
- ✅ Easiest to maintain
- ✅ No additional costs
- ✅ Same domain/subdomain
- ✅ Better for CORS (same origin)

