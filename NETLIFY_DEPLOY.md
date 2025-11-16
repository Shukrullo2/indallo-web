# Deploy to Netlify via Website (Step-by-Step)

## Step 1: Prepare Your Code

1. **Make sure your code is on GitHub** (or GitLab/Bitbucket)
   - If not already, push your code to a GitHub repository
   - Make sure the `web-app` folder is in your repository

2. **Test build locally** (optional but recommended):
```bash
cd web-app
npm run build
```
This ensures your build works before deploying.

---

## Step 2: Sign Up / Login to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **"Sign up"** (or **"Log in"** if you have an account)
3. Choose **"Sign up with GitHub"** (recommended) or use email
4. Authorize Netlify to access your GitHub account

---

## Step 3: Create New Site

1. Once logged in, you'll see the Netlify dashboard
2. Click the **"Add new site"** button (usually top right)
3. Select **"Import an existing project"**

---

## Step 4: Connect Your Repository

1. You'll see a list of Git providers
2. Click **"GitHub"** (or your Git provider)
3. Authorize Netlify if prompted
4. You'll see a list of your repositories
5. **Search for and select** your repository that contains the `web-app` folder

---

## Step 5: Configure Build Settings

After selecting your repository, you'll see build settings. Configure:

### Basic Build Settings:

1. **Branch to deploy**: 
   - Select your main branch (usually `main` or `master`)

2. **Base directory**: 
   - Click **"Show advanced"** or **"Change"** next to base directory
   - Enter: `web-app`
   - This tells Netlify where your Vue app is located

3. **Build command**: 
   - Enter: `npm run build`
   - This is the command to build your app

4. **Publish directory**: 
   - Enter: `web-app/dist`
   - This is where the built files are located

### Your settings should look like:
```
Base directory: web-app
Build command: npm run build
Publish directory: web-app/dist
```

---

## Step 6: Add Environment Variables

**IMPORTANT**: Do this BEFORE clicking "Deploy site"!

1. Click **"Show advanced"** or look for **"Environment variables"** section
2. Click **"New variable"** or **"Add variable"**
3. Add these two variables:

   **Variable 1:**
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-api-domain.com` (your actual API URL)

   **Variable 2:**
   - Key: `VITE_BOT_USERNAME`
   - Value: `your_bot_username` (your actual bot username, without @)

4. Click **"Add variable"** after each one

---

## Step 7: Deploy!

1. Review your settings one more time
2. Click the **"Deploy site"** button
3. Netlify will start building your site
4. You'll see a build log in real-time

---

## Step 8: Wait for Build

1. The build process will:
   - Install dependencies (`npm install`)
   - Run your build command (`npm run build`)
   - Deploy the `dist` folder

2. You'll see progress in the build log
3. Wait for **"Site is live"** message (usually 1-3 minutes)

---

## Step 9: Access Your Site

1. Once deployed, Netlify will show you:
   - **Site URL**: `https://random-name-123.netlify.app`
   - This is your live site!

2. You can:
   - Click the URL to visit your site
   - Click **"Site settings"** → **"Change site name"** to customize the URL
   - Example: `https://indallo-web.netlify.app`

---

## Step 10: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow DNS configuration instructions

---

## Updating Your Site

Every time you push to your GitHub repository:
- Netlify will **automatically rebuild and redeploy** your site
- You'll see a new deploy in the **"Deploys"** tab
- The site updates automatically (usually in 1-2 minutes)

---

## Managing Environment Variables Later

If you need to change environment variables:

1. Go to your site in Netlify dashboard
2. Click **"Site settings"** → **"Environment variables"**
3. Click **"Add variable"** or edit existing ones
4. Click **"Trigger deploy"** → **"Deploy site"** to rebuild with new variables

---

## Troubleshooting

### Build Fails
- Check the build log for errors
- Make sure `Base directory` is set to `web-app`
- Verify `Build command` is `npm run build`
- Check that `Publish directory` is `web-app/dist`

### Site Shows Blank Page
- Check browser console for errors
- Verify environment variables are set correctly
- Make sure API URL is accessible (check CORS)

### Environment Variables Not Working
- Variables must start with `VITE_`
- Rebuild after adding/changing variables
- Check build log to see if variables are being used

### Routes Don't Work (404 errors)
- Netlify should auto-detect Vue.js and handle routing
- If not, add `_redirects` file in `web-app/public/`:
  ```
  /*    /index.html   200
  ```

---

## Quick Checklist

Before deploying, make sure:
- [ ] Code is pushed to GitHub
- [ ] Base directory: `web-app`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `web-app/dist`
- [ ] Environment variables added:
  - [ ] `VITE_API_BASE_URL`
  - [ ] `VITE_BOT_USERNAME`

---

## Summary

1. **Sign up** at netlify.com
2. **Add new site** → Import from GitHub
3. **Select repository**
4. **Configure**:
   - Base directory: `web-app`
   - Build: `npm run build`
   - Publish: `web-app/dist`
5. **Add environment variables**
6. **Deploy site**
7. **Done!** Your site is live

Your app will be available at: `https://your-site-name.netlify.app`

