# 🚀 CI/CD Implementation Guide - Serve Cafe Project

## 📋 Overview

This guide explains how to implement CI/CD for your Serve Cafe Laravel project and what changes need to be made to your existing setup.

---

## 🎯 Current Project Status

### ✅ What's Already Working

-   **Laravel Application**: Running on `127.0.0.1:8000`
-   **Background Agent**: Queue workers active
-   **Cron Controller**: Package activation working
-   **Database**: MySQL configured
-   **Assets**: Vite build system ready

### 🔧 What Needs to Be Changed

---

## 📁 File Changes Required

### 1. **New Files Created** ✅

```
├── deploy.sh                    # Main deployment script
├── auto-deploy.sh               # Auto-deployment script
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── routes/webhook.php           # Webhook endpoints
└── CI_CD_GUIDE.md               # This guide
```

### 2. **Existing Files to Modify**

#### **A. `.env` File Updates**

Add these new environment variables:

```env
# CI/CD Configuration
WEBHOOK_SECRET=your-webhook-secret-here
DEPLOY_PATH=/home4/servi5ne/repositories/service_cafe
PUBLIC_PATH=/home4/servi5ne/public_html

# Existing settings (keep these)
APP_NAME="Serve Cafe"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://servecafe.com
```

#### **B. `routes/web.php` Updates**

Add webhook routes to your existing routes file:

```php
// Add this to your existing routes/web.php
Route::post('/webhook/deploy', function (Request $request) {
    // Webhook deployment logic (see routes/webhook.php)
});

Route::get('/webhook/status', function () {
    return response()->json(['status' => 'active']);
});
```

#### **C. `composer.json` Updates**

Add deployment scripts to your existing composer.json:

```json
{
    "scripts": {
        "post-autoload-dump": [
            "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
            "@php artisan package:discover --ansi"
        ],
        "deploy": [
            "composer install --no-dev --optimize-autoloader",
            "php artisan config:cache",
            "php artisan route:cache",
            "php artisan view:cache"
        ],
        "deploy:production": ["@deploy", "php artisan migrate --force"]
    }
}
```

---

## 🚀 Implementation Steps

### **Step 1: Initialize Git Repository**

```bash
# In your project root directory
cd /Applications/XAMPP/xamppfiles/htdocs/projects/services-cafe/service_cafe/servecafe

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Serve Cafe Laravel application"

# Add remote repository
git remote add origin https://github.com/yourusername/servecafe.git

# Push to GitHub
git push -u origin main
```

### **Step 2: Update Environment Configuration**

```bash
# Edit your .env file
nano .env

# Add these lines:
WEBHOOK_SECRET=your-secure-webhook-secret-here
DEPLOY_PATH=/home4/servi5ne/repositories/service_cafe
PUBLIC_PATH=/home4/servi5ne/public_html
```

### **Step 3: Test Deployment Script Locally**

```bash
# Make script executable
chmod +x deploy.sh

# Test the deployment script
./deploy.sh
```

### **Step 4: Upload to cPanel Server**

```bash
# Upload these files to your cPanel server:
# - deploy.sh
# - auto-deploy.sh
# - Updated .env file

# Set permissions on server
chmod +x deploy.sh auto-deploy.sh
```

### **Step 5: Set Up GitHub Actions (Optional)**

1. **Go to GitHub Repository Settings**
2. **Navigate to Secrets and Variables → Actions**
3. **Add these secrets:**
    ```
    CPANEL_HOST: your-server-ip-address
    CPANEL_USERNAME: your-cpanel-username
    CPANEL_SSH_KEY: your-ssh-private-key
    CPANEL_PORT: 22
    ```

### **Step 6: Configure Auto-Deploy (Optional)**

```bash
# On your cPanel server, add to crontab:
crontab -e

# Add this line (runs every 5 minutes):
*/5 * * * * /home4/servi5ne/repositories/service_cafe/auto-deploy.sh
```

---

## 🔄 Deployment Workflows

### **Workflow 1: Manual Deployment**

```bash
# Run deployment script manually
./deploy.sh
```

### **Workflow 2: Git Push → Auto Deploy**

```bash
# Make changes to your code
git add .
git commit -m "Update: Added new feature"
git push origin main

# GitHub Actions automatically deploys
```

### **Workflow 3: Webhook Trigger**

```bash
# Trigger deployment via webhook
curl -X POST https://servecafe.com/webhook/deploy \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=..." \
  -d '{"ref":"refs/heads/main"}'
```

### **Workflow 4: Cron Auto-Deploy**

```bash
# Runs automatically every 5 minutes
# Checks for Git changes and deploys if found
```

---

## 🛠️ Configuration Changes

### **A. Server Configuration**

#### **cPanel File Structure**

```
/home4/servi5ne/
├── repositories/
│   └── service_cafe/          # Your Laravel app
│       ├── deploy.sh          # Deployment script
│       ├── auto-deploy.sh     # Auto-deploy script
│       └── .env              # Environment config
├── public_html/
│   ├── sys/
│   │   └── app/
│   │       └── public/       # Symlink to Laravel public
│   └── index.php            # Redirect to app
└── backups/                 # Deployment backups
```

#### **Symlink Configuration**

```bash
# Create symlink (if not exists)
ln -sfn /home4/servi5ne/repositories/service_cafe/public \
        /home4/servi5ne/public_html/sys/app/public
```

### **B. Database Configuration**

#### **Migration Updates**

```bash
# Run migrations after deployment
php artisan migrate --force

# Clear and rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### **C. Asset Configuration**

#### **Vite Build Process**

```bash
# Build assets for production
npm run build

# This creates:
# - public/build/manifest.json
# - public/build/assets/app-*.js
# - public/build/assets/app-*.css
```

---

## 📊 Monitoring & Logs

### **Log Files to Monitor**

```bash
# Deployment logs
tail -f /home4/servi5ne/logs/deploy.log

# Auto-deploy logs
tail -f /home4/servi5ne/logs/auto-deploy.log

# Laravel logs
tail -f storage/logs/laravel.log

# Webhook logs (in Laravel logs)
tail -f storage/logs/laravel.log | grep webhook
```

### **Status Check Commands**

```bash
# Check webhook status
curl https://servecafe.com/webhook/status

# Check cron job status
crontab -l

# Check Git status
git status
git log --oneline -5

# Check Laravel status
php artisan route:list
php artisan config:cache
```

---

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **1. Permission Denied**

```bash
# Fix file permissions
chmod +x deploy.sh auto-deploy.sh
chmod -R 755 /path/to/project
chmod -R 775 storage bootstrap/cache
```

#### **2. Git Not Found**

```bash
# Install git or use alternative deployment
# Option: Upload files manually via cPanel File Manager
```

#### **3. Composer Not Found**

```bash
# Install composer or use pre-built vendor directory
# Option: Upload vendor directory from local build
```

#### **4. SSH Key Issues**

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Add public key to cPanel
# Keep private key for GitHub Actions
```

#### **5. Webhook Not Working**

```bash
# Check webhook URL
curl https://servecafe.com/webhook/status

# Check Laravel logs
tail -f storage/logs/laravel.log | grep webhook

# Verify webhook secret in .env
```

---

## 🎯 Recommended Implementation Order

### **Phase 1: Basic Setup** (Start Here)

1. ✅ Initialize Git repository
2. ✅ Update `.env` file
3. ✅ Test `deploy.sh` locally
4. ✅ Upload scripts to cPanel

### **Phase 2: Manual Deployment**

1. ✅ Test manual deployment
2. ✅ Verify application works
3. ✅ Check logs and permissions

### **Phase 3: Automated Deployment**

1. ✅ Set up GitHub Actions
2. ✅ Configure webhooks
3. ✅ Set up cron auto-deploy

### **Phase 4: Monitoring**

1. ✅ Set up log monitoring
2. ✅ Create status check endpoints
3. ✅ Set up error notifications

---

## 📞 Support & Next Steps

### **Immediate Actions**

1. **Initialize Git repository**
2. **Update `.env` file with new variables**
3. **Test deployment script locally**
4. **Upload to cPanel and test**

### **Advanced Features**

1. **Set up GitHub Actions**
2. **Configure webhook endpoints**
3. **Set up monitoring and alerts**
4. **Create deployment dashboards**

### **Success Indicators**

-   ✅ Git repository initialized
-   ✅ Deployment script works
-   ✅ Application deploys successfully
-   ✅ Logs are generated
-   ✅ Webhooks respond correctly

---

## 🎉 Expected Results

After implementing this CI/CD pipeline:

-   🚀 **Automated Deployments** - Push to Git → Auto deploy
-   📦 **Backup System** - Automatic backups before deployment
-   🔄 **Rollback Capability** - Easy rollback to previous versions
-   📊 **Monitoring** - Full deployment logging and status tracking
-   🛡️ **Error Handling** - Comprehensive error handling and recovery
-   ⚡ **Fast Deployments** - Optimized for cPanel environment

Your Serve Cafe application will have a professional CI/CD pipeline that automatically deploys changes whenever you push to your Git repository! 🎯
