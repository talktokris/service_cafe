# Cache Clearing Commands for cPanel Terminal

## Individual Commands

```bash
# Navigate to your project directory (adjust path if needed)
cd ~/repositories/service_cafe

# Clear all Laravel caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Clear compiled class file
php artisan clear-compiled

# Rebuild optimized autoloader (optional but recommended)
composer dump-autoload

# If you want to clear and rebuild config/route cache (for production)
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache
```

## One-Liner Version (Run All at Once)

```bash
cd ~/repositories/service_cafe && php artisan cache:clear && php artisan config:clear && php artisan route:clear && php artisan view:clear && php artisan clear-compiled && composer dump-autoload
```

## What These Commands Clear

- ✅ Application cache
- ✅ Configuration cache
- ✅ Route cache
- ✅ View cache
- ✅ Compiled classes
- ✅ Composer autoloader cache

## Web-Based Cache Clearing (PHP Script)

A PHP script is available at `public/clear-cache.php` that can be accessed via browser to clear all caches.

### Usage

1. **First, set a secret key** in `public/clear-cache.php`:
   - Open the file and change `SECRET_KEY` to a strong random string
   - Example: `define('SECRET_KEY', 'your-strong-random-secret-key-here');`

2. **Access via URL**:
   ```
   https://yourdomain.com/clear-cache.php?key=YOUR_SECRET_KEY
   ```

3. **The script will automatically**:
   - Clear application cache
   - Clear configuration cache
   - Clear route cache
   - Clear view cache
   - Clear compiled classes
   - Rebuild composer autoloader

### Security Note

⚠️ **IMPORTANT**: Always change the `SECRET_KEY` in the PHP file before using it in production. Never commit the actual secret key to version control.

## Notes

- If you're in production and using cached config/routes, clear them first (as shown above), then optionally rebuild with `php artisan config:cache` and `php artisan route:cache` after clearing.
- Make sure you're in the correct project directory before running these commands.

