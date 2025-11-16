# Fix Netlify Build Error

## The Problem
The error was caused by the `base = "web-app"` field in `netlify.toml`, which is not a valid Netlify configuration option.

## The Fix

I've updated `netlify.toml` to remove the invalid field. Now you need to configure the base directory in the Netlify dashboard.

---

## Steps to Fix in Netlify Dashboard

### 1. Go to Your Site Settings
1. Log in to [app.netlify.com](https://app.netlify.com)
2. Click on your site
3. Go to **Site settings** → **Build & deploy**

### 2. Configure Build Settings
Scroll to **"Build settings"** section and set:

**Base directory:**
```
web-app
```

**Build command:**
```
npm run build
```

**Publish directory:**
```
web-app/dist
```

### 3. Save and Redeploy
1. Click **"Save"** or the settings will auto-save
2. Go to **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Deploy site"**
4. Wait for the build to complete

---

## Alternative: Move netlify.toml

If you prefer to keep everything in config files, you can:

1. **Move `netlify.toml` to the repository root** (not in `web-app/`)
2. Update it to:
```toml
[build]
  base = "web-app"
  command = "cd web-app && npm run build"
  publish = "web-app/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

But the dashboard method is easier and recommended.

---

## Verify Build Works Locally

The build should work now. Test it:
```bash
cd web-app
npm ci
npm run build
```

If this works locally, it will work on Netlify after you configure the base directory in the dashboard.

---

## Summary

✅ **Fixed:** Removed invalid `base` field from `netlify.toml`  
⚠️ **Action Required:** Set base directory to `web-app` in Netlify dashboard  
✅ **Result:** Build should work after configuration

