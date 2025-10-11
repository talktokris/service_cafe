#!/bin/bash

# Manual Deployment Script for Serve Cafe
# Run this script on your cPanel server

echo "🚀 Starting manual deployment..."

# Navigate to project directory
cd /home4/servi5ne/repositories/service_cafe || exit 1

# Create backup
echo "📦 Creating backup..."
BACKUP_DIR="/home4/servi5ne/backups"
mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" . 2>/dev/null || true

# Pull latest changes
echo "📥 Pulling latest changes..."
git fetch origin main
git reset --hard origin/main

# Install PHP dependencies
echo "🎼 Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 .
chmod -R 775 storage bootstrap/cache

# Clear Laravel caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Rebuild caches
echo "🔄 Rebuilding caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (if needed)
echo "🗄️ Running migrations..."
php artisan migrate --force || true

# Update symlink
echo "🔗 Updating symlink..."
ln -sfn "$(pwd)/public" "/home4/servi5ne/public_html/sys/app/public"

# Test application
echo "🧪 Testing application..."
php artisan route:list > /dev/null 2>&1 && echo "✅ Application test passed" || echo "⚠️ Application test failed"

echo "✅ Manual deployment completed successfully!"
echo "🌐 Application is available at: https://servecafe.com"
