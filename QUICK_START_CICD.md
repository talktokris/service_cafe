# 🚀 Quick Start: CI/CD Setup for Serve Cafe on cPanel

## 📋 What You Have

Your Serve Cafe project now includes a complete CI/CD pipeline setup with:

✅ **GitHub Actions Workflow** - Automated deployments on push  
✅ **Deployment Scripts** - Manual and automated deployment  
✅ **Webhook Integration** - Deploy via webhooks  
✅ **Setup Helper Script** - Interactive configuration  
✅ **Comprehensive Documentation** - Multiple guides and checklists

---

## 🎯 Choose Your Deployment Method

### 🔵 Method 1: GitHub Actions (Recommended)

**Best for**: Automated deployments, team collaboration, full CI/CD

### 🟢 Method 2: Manual Deployment

**Best for**: Simple deployments, learning the process

### 🟡 Method 3: Auto-Deploy with Cron

**Best for**: Scheduled automatic updates

### 🟠 Method 4: Webhook Deployment

**Best for**: Custom integrations, external triggers

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Run the Setup Script

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/projects/services-cafe/service_cafe/servecafe
chmod +x setup-cicd.sh
./setup-cicd.sh
```

This script will:

-   ✅ Check prerequisites
-   ✅ Initialize Git repository
-   ✅ Configure environment variables
-   ✅ Make scripts executable
-   ✅ Guide you through setup

### Step 2: Choose Your Method

#### 🔵 GitHub Actions Setup

1. **Push to GitHub**

    ```bash
    git add .
    git commit -m "Setup CI/CD pipeline"
    git push origin main
    ```

2. **Add GitHub Secrets**

    - Go to: Repository Settings → Secrets and variables → Actions
    - Click: "New repository secret"
    - Add these secrets:

    | Secret Name       | Value                                 |
    | ----------------- | ------------------------------------- |
    | `CPANEL_HOST`     | Your cPanel server IP/hostname        |
    | `CPANEL_USERNAME` | Your cPanel username (e.g., servi5ne) |
    | `CPANEL_SSH_KEY`  | Your SSH private key (entire content) |
    | `CPANEL_PORT`     | SSH port (default: 22)                |

3. **Generate SSH Key (if needed)**

    ```bash
    # On your local machine
    ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

    # View private key (for GitHub secret)
    cat ~/.ssh/id_rsa

    # View public key (to add to cPanel)
    cat ~/.ssh/id_rsa.pub
    ```

4. **Add Public Key to cPanel**

    - Login to cPanel
    - Go to: SSH Access → Manage SSH Keys
    - Click: "Import Key" or "Add Public Key"
    - Paste your public key
    - Authorize it

5. **Test Deployment**
    - Make a small change to your code
    - Commit and push:
        ```bash
        git add .
        git commit -m "Test deployment"
        git push origin main
        ```
    - Check GitHub Actions tab to see deployment progress

#### 🟢 Manual Deployment

1. **Upload to cPanel**

    ```bash
    # Via SFTP or cPanel File Manager
    # Upload to: /home4/servi5ne/repositories/service_cafe
    ```

2. **SSH to cPanel and Run**
    ```bash
    ssh servi5ne@your-cpanel-host
    cd /home4/servi5ne/repositories/service_cafe
    ./deploy.sh
    ```

#### 🟡 Auto-Deploy with Cron

1. **SSH to cPanel**

    ```bash
    ssh servi5ne@your-cpanel-host
    ```

2. **Edit Crontab**

    ```bash
    crontab -e
    ```

3. **Add Cron Job**

    ```bash
    # Check every 5 minutes for updates
    */5 * * * * /home4/servi5ne/repositories/service_cafe/auto-deploy.sh

    # Or check every hour
    0 * * * * /home4/servi5ne/repositories/service_cafe/auto-deploy.sh
    ```

#### 🟠 Webhook Deployment

1. **Configure Webhook in GitHub**

    - Go to: Repository Settings → Webhooks → Add webhook
    - **Payload URL**: `https://servecafe.com/webhook/deploy`
    - **Content type**: `application/json`
    - **Secret**: Your `WEBHOOK_SECRET` from `.env`
    - **Events**: Just the push event
    - Click "Add webhook"

2. **Test Webhook**
    ```bash
    curl https://servecafe.com/webhook/status
    ```

---

## 🌐 cPanel Server Setup

### Initial Server Configuration

```bash
# 1. SSH to your cPanel server
ssh servi5ne@your-cpanel-host

# 2. Create necessary directories
mkdir -p /home4/servi5ne/repositories
mkdir -p /home4/servi5ne/backups
mkdir -p /home4/servi5ne/logs

# 3. Clone your repository
cd /home4/servi5ne/repositories
git clone https://github.com/yourusername/servecafe.git service_cafe
cd service_cafe

# 4. Copy .env file
cp .env.example .env
nano .env  # Edit configuration

# 5. Install dependencies
composer install --no-dev --optimize-autoloader
npm install
npm run build

# 6. Set permissions
chmod -R 755 .
chmod -R 775 storage bootstrap/cache
chmod +x deploy.sh auto-deploy.sh

# 7. Generate app key
php artisan key:generate

# 8. Run migrations
php artisan migrate --force

# 9. Create symlink to public directory
ln -sfn /home4/servi5ne/repositories/service_cafe/public \
        /home4/servi5ne/public_html/sys/app/public

# 10. Test deployment
./deploy.sh
```

---

## 🔑 Environment Variables for CI/CD

Add these to your `.env` file:

```env
# CI/CD Configuration
WEBHOOK_SECRET=your-secure-webhook-secret-here
DEPLOY_PATH=/home4/servi5ne/repositories/service_cafe
PUBLIC_PATH=/home4/servi5ne/public_html
BACKUP_PATH=/home4/servi5ne/backups
LOG_PATH=/home4/servi5ne/logs
```

### Generate Secure Webhook Secret

```bash
# Generate random secret
openssl rand -base64 32 | tr -d /=+ | cut -c -32
```

---

## 📊 Monitoring & Logs

### View Deployment Logs

```bash
# SSH to cPanel
ssh servi5ne@your-cpanel-host

# View deployment log
tail -f /home4/servi5ne/logs/deploy.log

# View auto-deploy log
tail -f /home4/servi5ne/logs/auto-deploy.log

# View Laravel log
tail -f /home4/servi5ne/repositories/service_cafe/storage/logs/laravel.log
```

### Check Deployment Status

```bash
# Check webhook status
curl https://servecafe.com/webhook/status

# Check application routes
php artisan route:list

# Check cron jobs
crontab -l
```

---

## 🧪 Testing Your Deployment

### Test 1: Manual Deployment

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/projects/services-cafe/service_cafe/servecafe
./deploy.sh
```

### Test 2: GitHub Actions

```bash
# Make a change
echo "# Test" >> README.md
git add .
git commit -m "Test GitHub Actions deployment"
git push origin main

# Check GitHub Actions tab
```

### Test 3: Webhook

```bash
# Trigger webhook manually
curl -X POST https://servecafe.com/webhook/deploy \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$(echo -n '{}' | openssl dgst -sha256 -hmac 'your-webhook-secret' | cut -d' ' -f2)" \
  -d '{}'
```

---

## 🚨 Troubleshooting

### Issue: Permission Denied

```bash
chmod +x deploy.sh auto-deploy.sh setup-cicd.sh
```

### Issue: Git Pull Fails

```bash
# Reset to remote state
git fetch origin main
git reset --hard origin/main
```

### Issue: Composer Not Found

```bash
# Install composer
cd ~
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
sudo mv composer.phar /usr/local/bin/composer
```

### Issue: GitHub Actions Failing

1. Check GitHub Actions logs
2. Verify secrets are correct
3. Check SSH connection:
    ```bash
    ssh -i ~/.ssh/id_rsa servi5ne@your-cpanel-host
    ```

### Issue: Webhook Not Working

1. Check webhook URL is correct
2. Verify webhook secret matches `.env`
3. Check Laravel logs for errors
4. Test webhook endpoint:
    ```bash
    curl https://servecafe.com/webhook/status
    ```

---

## 📚 Documentation Files

| File                              | Purpose                       |
| --------------------------------- | ----------------------------- |
| `QUICK_START_CICD.md`             | This file - Quick start guide |
| `CICD_SETUP_GUIDE.md`             | Detailed setup instructions   |
| `CI_CD_GUIDE.md`                  | Complete implementation guide |
| `DEPLOYMENT_CHECKLIST.md`         | Step-by-step checklist        |
| `deployment/cpanel-cicd-guide.md` | cPanel-specific guide         |
| `setup-cicd.sh`                   | Interactive setup script      |

---

## ✅ Deployment Workflow

### Recommended Workflow

```
1. Develop locally → 2. Test → 3. Commit → 4. Push to GitHub
                                                   ↓
5. GitHub Actions triggers → 6. Builds assets → 7. Deploys to cPanel
                                                   ↓
8. Application live → 9. Monitor logs → 10. Success! 🎉
```

### What Happens During Deployment

1. **Backup** - Creates backup of current version
2. **Pull** - Gets latest code from Git
3. **Dependencies** - Installs Composer packages
4. **Assets** - Builds frontend assets
5. **Permissions** - Sets correct file permissions
6. **Cache** - Clears and rebuilds Laravel caches
7. **Migrations** - Runs database migrations (optional)
8. **Symlink** - Updates public directory symlink
9. **Test** - Verifies application is working
10. **Cleanup** - Removes old backups

---

## 🎉 Success Indicators

✅ **Deployment Successful** when you see:

-   GitHub Actions shows green checkmark
-   Application loads at https://servecafe.com
-   No errors in logs
-   New features are visible
-   Database changes applied

---

## 🆘 Need Help?

### Documentation

-   Read the comprehensive guides in the project
-   Check DEPLOYMENT_CHECKLIST.md for step-by-step process

### Logs

-   Check deployment logs: `/home4/servi5ne/logs/deploy.log`
-   Check Laravel logs: `storage/logs/laravel.log`
-   Check GitHub Actions logs in GitHub

### Common Commands

```bash
# View logs
tail -f /home4/servi5ne/logs/deploy.log

# Manual deployment
./deploy.sh

# Clear caches
php artisan cache:clear
php artisan config:clear

# Check status
php artisan route:list
git status
```

---

## 🚀 Next Steps

1. ✅ Complete initial setup
2. ✅ Test deployment
3. ✅ Configure monitoring
4. ✅ Train team on deployment process
5. ✅ Document custom configurations
6. ✅ Set up backup strategy
7. ✅ Configure error notifications

---

## 🎯 Your CI/CD Pipeline is Ready!

**Congratulations!** You now have a professional CI/CD pipeline for your Serve Cafe application.

Every time you push to GitHub, your application will automatically deploy to your cPanel server with:

-   🔄 Automated deployments
-   📦 Automatic backups
-   🧪 Testing and validation
-   📊 Comprehensive logging
-   🔄 Easy rollback capability

**Happy Deploying! 🚀**
