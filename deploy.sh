#!/bin/bash

# Deployment script for Indallo Web App
# Usage: ./deploy.sh [server_user@server_host] [deploy_path]

set -e

SERVER="${1:-user@your-server.com}"
DEPLOY_PATH="${2:-/var/www/indallo-web}"

echo "🚀 Building production bundle..."
cd "$(dirname "$0")"
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📦 Deploying to $SERVER:$DEPLOY_PATH..."
rsync -avz --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    dist/ \
    "$SERVER:$DEPLOY_PATH/"

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app should be live at your configured domain"
else
    echo "❌ Deployment failed!"
    exit 1
fi

