#!/bin/bash

# Serve Cafe Deployment Script for cPanel
echo "🚀 Starting Serve Cafe deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - Update these paths for your cPanel
PROJECT_DIR="/home4/servi5ne/repositories/service_cafe"
PUBLIC_DIR="/home4/servi5ne/public_html"
BACKUP_DIR="/home4/servi5ne/backups"
LOG_FILE="/home4/servi5ne/logs/deploy.log"

# Create directories if they don't exist
mkdir -p $BACKUP_DIR
mkdir -p $(dirname $LOG_FILE)

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" | tee -a $LOG_FILE
}

log "🚀 Starting Serve Cafe deployment..."

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    log "❌ Error: Not in Laravel project directory"
    exit 1
fi

# Create backup
log "📦 Creating backup..."
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
if [ -d "$PROJECT_DIR" ]; then
    tar -czf "$BACKUP_FILE" $PROJECT_DIR 2>/dev/null
    if [ $? -eq 0 ]; then
        log "✅ Backup created: $BACKUP_FILE"
    else
        log "⚠️  Warning: Backup creation failed"
    fi
else
    log "⚠️  Warning: Project directory not found, skipping backup"
fi

# Pull latest changes (if git is available)
if command -v git &> /dev/null; then
    log "📥 Pulling latest changes..."
    git pull origin main 2>/dev/null
    if [ $? -eq 0 ]; then
        log "✅ Git pull successful"
    else
        log "⚠️  Warning: Git pull failed or no changes"
    fi
else
    log "⚠️  Warning: Git not available, skipping pull"
fi

# Install/Update PHP dependencies
log "📦 Installing PHP dependencies..."
if command -v composer &> /dev/null; then
    composer install --no-dev --optimize-autoloader --no-interaction
    if [ $? -eq 0 ]; then
        log "✅ Composer dependencies installed"
    else
        log "❌ Error: Composer installation failed"
        exit 1
    fi
else
    log "❌ Error: Composer not available"
    exit 1
fi

# Build assets (if npm is available)
if command -v npm &> /dev/null; then
    log "🎨 Building assets..."
    npm install --silent
    npm run build
    if [ $? -eq 0 ]; then
        log "✅ Assets built successfully"
    else
        log "⚠️  Warning: Asset build failed, using existing assets"
    fi
else
    log "⚠️  Warning: npm not available, using pre-built assets"
fi

# Set permissions
log "🔐 Setting permissions..."
chmod -R 755 .
chmod -R 775 storage
chmod -R 775 bootstrap/cache
log "✅ Permissions set"

# Clear Laravel caches
log "🧹 Clearing Laravel caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
log "✅ Caches cleared"

# Rebuild caches
log "🔄 Rebuilding caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
log "✅ Caches rebuilt"

# Update symlink (if using symlink deployment)
if [ -d "$PUBLIC_DIR" ]; then
    log "🔗 Updating symlink..."
    ln -sfn "$(pwd)/public" "$PUBLIC_DIR/sys/app/public"
    log "✅ Symlink updated"
fi

# Test the application
log "🧪 Testing application..."
if php artisan route:list > /dev/null 2>&1; then
    log "✅ Application test passed"
else
    log "❌ Error: Application test failed"
    exit 1
fi

# Clean up old backups (keep last 5)
log "🧹 Cleaning up old backups..."
ls -t $BACKUP_DIR/backup-*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm
log "✅ Old backups cleaned"

log "🎉 Deployment completed successfully!"
log "🌐 Your app should be available at: https://servecafe.com"
log "📊 Deployment log saved to: $LOG_FILE"

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your app is available at: https://servecafe.com${NC}"
echo -e "${BLUE}📊 Check deployment log: $LOG_FILE${NC}"

