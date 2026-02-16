#!/usr/bin/env bash
# Run this on the server via SSH to fix blank page (Vite dev URLs).
# Usage: ssh servi5ne@servecafe.com "cd /home4/servi5ne/repositories/service_cafe && bash -s" < server-fix-vite.sh
# Or: upload this file, then on server: cd /home4/servi5ne/repositories/service_cafe && bash server-fix-vite.sh

set -e
echo "=== Fix Vite production build on server ==="

# 1. Remove Vite "hot" file if present (makes Laravel use dev server URLs)
HOT_FILE="public/hot"
if [ -f "$HOT_FILE" ]; then
  rm -f "$HOT_FILE"
  echo "Removed $HOT_FILE (was forcing dev server URLs)"
else
  echo "No $HOT_FILE found (ok)"
fi

# 2. Ensure .env has production settings (create backup)
if [ -f .env ]; then
  sed -i.bak 's/^APP_ENV=.*/APP_ENV=production/' .env
  sed -i.bak 's/^APP_DEBUG=.*/APP_DEBUG=false/' .env
  echo "Updated .env: APP_ENV=production, APP_DEBUG=false"
else
  echo "Warning: .env not found"
fi

# 3. Clear Laravel caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
echo "Caches cleared"

echo "=== Done. Hard-refresh https://servecafe.com ==="
