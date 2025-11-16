# Copy Instructions for Live Testing

## Build Location
The production build is located at:
```
web-app/dist/
```

## Quick Copy Commands

### Option 1: Using SCP (Secure Copy)
```bash
# From the project root
cd web-app
scp -r dist/* user@your-server.com:/path/to/services/
```

### Option 2: Using RSYNC (Recommended - faster, handles updates)
```bash
# From the project root
cd web-app
rsync -avz --delete dist/ user@your-server.com:/path/to/services/
```

### Option 3: Manual Copy via SFTP
1. Use an SFTP client (FileZilla, Cyberduck, etc.)
2. Connect to your server
3. Navigate to `web-app/dist/` on your local machine
4. Copy all files to `/path/to/services/` on the server

## What to Copy
Copy **all contents** of the `dist/` folder:
- `index.html`
- `assets/` folder (contains all JS, CSS, and other assets)

## After Copying

### Configure Nginx (if needed)
Make sure your Nginx serves the `index.html` for all routes (SPA routing):

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Set Correct Base URL
The app uses environment variables. Make sure your server has:
- `VITE_API_BASE_URL=https://your-api-domain.com`
- `VITE_BOT_USERNAME=your_bot_username`

If you need to change these, rebuild with:
```bash
VITE_API_BASE_URL=https://your-api-domain.com VITE_BOT_USERNAME=your_bot_username npm run build
```

## Quick Deploy Script
```bash
# Edit deploy.sh with your server details, then:
./deploy.sh user@your-server.com /path/to/services
```

