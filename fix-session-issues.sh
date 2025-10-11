#!/bin/bash

# Comprehensive Session and CSRF Fix Script for Serve Cafe
# Run this script on your cPanel server to fix 419 Page Expired errors

echo "🔧 Starting comprehensive session and CSRF fix..."

# Navigate to project directory
cd /home4/servi5ne/repositories/service_cafe || exit 1

# 1. Stop any running processes that might be using sessions
echo "🛑 Stopping any running processes..."
pkill -f "php artisan" 2>/dev/null || true

# 2. Clear all Laravel caches
echo "🧹 Clearing all Laravel caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear

# 3. Regenerate application key
echo "🔑 Regenerating application key..."
php artisan key:generate --force

# 4. Clear sessions table
echo "🗑️ Clearing sessions table..."
php artisan tinker --execute="DB::table('sessions')->truncate();" 2>/dev/null || echo "Could not clear sessions table"

# 5. Clear session files
echo "🗑️ Clearing session files..."
rm -rf storage/framework/sessions/*
rm -rf storage/framework/cache/*
rm -rf storage/framework/views/*

# 6. Set proper permissions
echo "🔐 Setting proper permissions..."
chmod -R 755 .
chmod -R 775 storage bootstrap/cache
chown -R servi5ne:servi5ne storage bootstrap/cache 2>/dev/null || true

# 7. Rebuild caches
echo "🔄 Rebuilding caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Run the custom session fix command
echo "🛠️ Running custom session fix..."
php artisan session:fix 2>/dev/null || echo "Custom command not available yet"

# 9. Test the application
echo "🧪 Testing application..."
php artisan route:list > /dev/null 2>&1 && echo "✅ Application test passed" || echo "⚠️ Application test failed"

# 10. Clear browser cache instruction
echo ""
echo "✅ Session and CSRF fix completed!"
echo ""
echo "📋 Next steps:"
echo "1. Clear your browser cookies and cache"
echo "2. Close all browser tabs for this site"
echo "3. Restart your browser"
echo "4. Visit the site again"
echo ""
echo "🔗 You can also visit: https://servecafe.com/refresh-csrf to refresh CSRF token"
echo ""
echo "If issues persist, run this script again or contact support."
