# 🚀 CI/CD Setup Guide for Serve Cafe - cPanel Deployment

## 📋 Overview

This guide provides multiple CI/CD options for your Serve Cafe Laravel project on cPanel hosting, from simple to advanced.

---

## 🎯 Quick Start (Recommended)

### Option 1: Simple Git-Based Deployment

**Best for**: Getting started quickly, full control

1. **Initialize Git Repository**

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin https://github.com/yourusername/servecafe.git
    git push -u origin main
    ```

2. **Upload Files to cPanel**

    - Upload `deploy.sh` to your cPanel server
    - Upload `auto-deploy.sh` for automatic deployment
    - Set executable permissions: `chmod +x deploy.sh auto-deploy.sh`

3. **Run Manual Deployment**

    ```bash
    ./deploy.sh
    ```

4. **Set Up Auto-Deploy (Optional)**
    ```bash
    # Add to crontab (runs every 5 minutes)
    */5 * * * * /home4/servi5ne/repositories/service_cafe/auto-deploy.sh
    ```

---

## 🔄 Option 2: GitHub Actions + cPanel

**Best for**: Automated deployments on Git push

### Setup Steps:

1. **Create GitHub Repository**

    - Push your code to GitHub
    - Go to repository Settings → Secrets and variables → Actions

2. **Add Required Secrets**

    ```
    CPANEL_HOST: your-server-ip
    CPANEL_USERNAME: your-cpanel-username
    CPANEL_SSH_KEY: your-ssh-private-key
    CPANEL_PORT: 22 (optional)
    ```

3. **Enable GitHub Actions**
    - The workflow file `.github/workflows/deploy.yml` is already created
    - Push to main branch to trigger deployment

### How it Works:

-   ✅ Pushes to `main` branch trigger deployment
-   ✅ Builds assets automatically
-   ✅ Deploys to cPanel via SSH
-   ✅ Creates backups before deployment
-   ✅ Sets proper permissions

---

## 🪝 Option 3: Webhook-Based Deployment

**Best for**: Manual triggers, external integrations

### Setup Steps:

1. **Enable Webhook Route**

    ```bash
    # Add to your .env file
    WEBHOOK_SECRET=your-secret-key-here
    ```

2. **Configure Repository Webhook**

    - Go to your Git repository settings
    - Add webhook URL: `https://servecafe.com/webhook/deploy`
    - Set secret: `your-secret-key-here`
    - Select events: Push events

3. **Test Webhook**
    ```bash
    curl -X POST https://servecafe.com/webhook/deploy \
      -H "Content-Type: application/json" \
      -H "X-Hub-Signature-256: sha256=..." \
      -d '{"ref":"refs/heads/main"}'
    ```

---

## ⏰ Option 4: Cron-Based Auto-Deploy

**Best for**: Regular automatic updates

### Setup Steps:

1. **Upload Auto-Deploy Script**

    ```bash
    # Upload auto-deploy.sh to your server
    chmod +x auto-deploy.sh
    ```

2. **Set Up Cron Job**

    ```bash
    # Edit crontab
    crontab -e

    # Add this line (runs every 5 minutes)
    */5 * * * * /home4/servi5ne/repositories/service_cafe/auto-deploy.sh
    ```

3. **Monitor Logs**
    ```bash
    tail -f /home4/servi5ne/logs/auto-deploy.log
    ```

---

## 🛠️ Deployment Scripts Explained

### `deploy.sh` - Main Deployment Script

-   ✅ Creates backups
-   ✅ Pulls latest changes
-   ✅ Installs dependencies
-   ✅ Builds assets
-   ✅ Sets permissions
-   ✅ Clears/rebuilds caches
-   ✅ Updates symlinks
-   ✅ Tests application

### `auto-deploy.sh` - Auto-Deploy Script

-   ✅ Checks for Git changes
-   ✅ Runs deployment if changes found
-   ✅ Prevents concurrent deployments
-   ✅ Logs all activities

### `.github/workflows/deploy.yml` - GitHub Actions

-   ✅ Automated CI/CD pipeline
-   ✅ Builds and tests on push
-   ✅ Deploys to cPanel via SSH
-   ✅ Creates deployment packages

---

## 🔧 Configuration Files

### Environment Variables (.env)

```env
# Webhook Configuration
WEBHOOK_SECRET=your-webhook-secret-here

# Deployment Paths (update for your cPanel)
DEPLOY_PATH=/home4/servi5ne/repositories/service_cafe
PUBLIC_PATH=/home4/servi5ne/public_html
```

### Cron Job Examples

```bash
# Every 5 minutes
*/5 * * * * /path/to/auto-deploy.sh

# Every hour
0 * * * * /path/to/auto-deploy.sh

# Daily at 2 AM
0 2 * * * /path/to/auto-deploy.sh
```

---

## 📊 Monitoring & Logs

### Log Files

-   **Deployment Log**: `/home4/servi5ne/logs/deploy.log`
-   **Auto-Deploy Log**: `/home4/servi5ne/logs/auto-deploy.log`
-   **Laravel Log**: `storage/logs/laravel.log`

### Monitoring Commands

```bash
# Check deployment status
tail -f /home4/servi5ne/logs/deploy.log

# Check auto-deploy status
tail -f /home4/servi5ne/logs/auto-deploy.log

# Check webhook status
curl https://servecafe.com/webhook/status
```

---

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied**

    ```bash
    chmod +x deploy.sh auto-deploy.sh
    chmod -R 755 /path/to/project
    chmod -R 775 storage bootstrap/cache
    ```

2. **Git Not Found**

    ```bash
    # Install git on cPanel or use alternative deployment
    ```

3. **Composer Not Found**

    ```bash
    # Install composer or use pre-built vendor directory
    ```

4. **SSH Key Issues**
    ```bash
    # Generate SSH key pair
    ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
    ```

### Debug Commands

```bash
# Test deployment script
./deploy.sh

# Check Git status
git status
git log --oneline -5

# Check Laravel status
php artisan route:list
php artisan config:cache
```

---

## 🎯 Recommended Workflow

1. **Start with Option 1** (Simple Git-Based)
2. **Test manual deployment**
3. **Set up Option 4** (Cron Auto-Deploy)
4. **Upgrade to Option 2** (GitHub Actions) when ready

---

## 📞 Support

If you encounter issues:

1. Check log files
2. Verify file permissions
3. Test individual components
4. Check cPanel SSH access

---

## 🎉 Success!

Once set up, your deployment process will be:

-   ✅ **Automated** - No manual intervention needed
-   ✅ **Reliable** - Backups and error handling
-   ✅ **Fast** - Optimized for cPanel
-   ✅ **Monitored** - Full logging and status tracking

Your Serve Cafe application will automatically deploy whenever you push changes to your repository! 🚀

