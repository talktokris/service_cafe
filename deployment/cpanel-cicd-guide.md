# CI/CD Pipeline for cPanel - Serve Cafe Project

## 🎯 Overview

This guide shows how to set up automated deployment for your Serve Cafe Laravel project on cPanel hosting.

## 📋 Prerequisites

-   cPanel hosting with SSH access
-   Git repository (GitHub/GitLab)
-   Basic understanding of Git workflows

---

## 🚀 Option 1: Simple Git-Based Deployment

### Step 1: Set Up Git Repository

```bash
# Initialize git in your project
cd /Applications/XAMPP/xamppfiles/htdocs/projects/services-cafe/service_cafe/servecafe
git init
git add .
git commit -m "Initial commit"

# Push to GitHub/GitLab
git remote add origin https://github.com/yourusername/servecafe.git
git push -u origin main
```

### Step 2: Create Deployment Script

Create `deploy.sh` in your project root:

```bash
#!/bin/bash

# Serve Cafe Deployment Script
echo "🚀 Starting Serve Cafe deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home4/servi5ne/repositories/service_cafe"
PUBLIC_DIR="/home4/servi5ne/public_html"
BACKUP_DIR="/home4/servi5ne/backups"

# Create backup
echo -e "${YELLOW}📦 Creating backup...${NC}"
mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" $PROJECT_DIR

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
cd $PROJECT_DIR
git pull origin main

# Install/Update dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
composer install --no-dev --optimize-autoloader

# Build assets (if npm is available)
if command -v npm &> /dev/null; then
    echo -e "${YELLOW}🎨 Building assets...${NC}"
    npm install
    npm run build
else
    echo -e "${YELLOW}⚠️  npm not available, using pre-built assets...${NC}"
fi

# Set permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
chmod -R 755 $PROJECT_DIR
chmod -R 775 $PROJECT_DIR/storage
chmod -R 775 $PROJECT_DIR/bootstrap/cache

# Clear Laravel caches
echo -e "${YELLOW}🧹 Clearing caches...${NC}"
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Update symlink
echo -e "${YELLOW}🔗 Updating symlink...${NC}"
ln -sfn $PROJECT_DIR/public $PUBLIC_DIR/sys/app/public

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your app is available at: https://servecafe.com${NC}"
```

### Step 3: Make Script Executable

```bash
chmod +x deploy.sh
```

### Step 4: Manual Deployment

```bash
# Run deployment script
./deploy.sh
```

---

## 🔄 Option 2: GitHub Actions + cPanel

### Step 1: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to cPanel

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout code
              uses: actions/checkout@v3

            - name: Setup PHP
              uses: shivammathur/setup-php@v2
              with:
                  php-version: "8.2"
                  extensions: mbstring, dom, fileinfo, mysql

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: "18"
                  cache: "npm"

            - name: Install PHP dependencies
              run: composer install --no-dev --optimize-autoloader

            - name: Install Node dependencies
              run: npm ci

            - name: Build assets
              run: npm run build

            - name: Deploy to cPanel
              uses: appleboy/ssh-action@v0.1.5
              with:
                  host: ${{ secrets.CPANEL_HOST }}
                  username: ${{ secrets.CPANEL_USERNAME }}
                  key: ${{ secrets.CPANEL_SSH_KEY }}
                  script: |
                      cd /home4/servi5ne/repositories/service_cafe
                      git pull origin main
                      composer install --no-dev --optimize-autoloader
                      chmod -R 755 .
                      chmod -R 775 storage bootstrap/cache
                      php artisan config:cache
                      php artisan route:cache
                      php artisan view:cache
```

### Step 2: Set Up GitHub Secrets

In your GitHub repository settings, add these secrets:

-   `CPANEL_HOST`: Your cPanel server IP
-   `CPANEL_USERNAME`: Your cPanel username
-   `CPANEL_SSH_KEY`: Your SSH private key

---

## 🐳 Option 3: Docker + cPanel (Advanced)

### Step 1: Create Dockerfile

```dockerfile
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www
RUN chmod -R 755 /var/www
RUN chmod -R 775 /var/www/storage
RUN chmod -R 775 /var/www/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
```

### Step 2: Create docker-compose.yml

```yaml
version: "3.8"

services:
    app:
        build: .
        ports:
            - "9000:9000"
        volumes:
            - ./:/var/www
        environment:
            - APP_ENV=production
            - APP_DEBUG=false
        depends_on:
            - db

    db:
        image: mysql:8.0
        environment:
            MYSQL_DATABASE: servecafe
            MYSQL_ROOT_PASSWORD: rootpassword
        volumes:
            - mysql_data:/var/lib/mysql

volumes:
    mysql_data:
```

---

## 🛠️ Option 4: Custom CI/CD with Webhooks

### Step 1: Create Webhook Endpoint

Create `routes/web.php` webhook:

```php
Route::post('/webhook/deploy', function(Request $request) {
    // Verify webhook signature (GitHub, GitLab, etc.)
    $signature = $request->header('X-Hub-Signature-256');
    $payload = $request->getContent();

    // Your webhook verification logic here

    // Execute deployment
    $output = shell_exec('cd /home4/servi5ne/repositories/service_cafe && ./deploy.sh 2>&1');

    return response()->json([
        'success' => true,
        'output' => $output
    ]);
});
```

### Step 2: Configure Repository Webhook

In your Git repository settings:

-   **Payload URL**: `https://servecafe.com/webhook/deploy`
-   **Content Type**: `application/json`
-   **Events**: Push events

---

## 📊 Option 5: Simple Cron-Based Auto-Deploy

### Step 1: Create Auto-Deploy Script

```bash
#!/bin/bash
# Auto-deploy script for cPanel

PROJECT_DIR="/home4/servi5ne/repositories/service_cafe"
LOG_FILE="/home4/servi5ne/logs/deploy.log"

cd $PROJECT_DIR

# Check for updates
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ $LOCAL != $REMOTE ]; then
    echo "$(date): New changes detected, deploying..." >> $LOG_FILE

    # Pull changes
    git pull origin main

    # Deploy
    composer install --no-dev --optimize-autoloader
    chmod -R 755 .
    chmod -R 775 storage bootstrap/cache
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

    echo "$(date): Deployment completed" >> $LOG_FILE
else
    echo "$(date): No changes detected" >> $LOG_FILE
fi
```

### Step 2: Set Up Cron Job

```bash
# Add to crontab (runs every 5 minutes)
*/5 * * * * /home4/servi5ne/repositories/service_cafe/auto-deploy.sh
```

---

## 🎯 Recommended Approach

For your cPanel setup, I recommend **Option 1 (Simple Git-Based)** because:

✅ **Easy to implement**  
✅ **No external dependencies**  
✅ **Works with cPanel limitations**  
✅ **Full control over deployment**  
✅ **Easy to debug**

## 🚀 Quick Start

1. **Choose Option 1** (Simple Git-Based)
2. **Create the `deploy.sh` script**
3. **Test manual deployment**
4. **Set up Git repository**
5. **Run deployment script**

Would you like me to help you implement any of these options?

