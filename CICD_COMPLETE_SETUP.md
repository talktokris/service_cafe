# ✅ Complete CI/CD Setup for Serve Cafe - cPanel Hosting

## 🎉 Congratulations! Your CI/CD Pipeline is Ready

This document summarizes everything that has been set up for automated deployment of your Serve Cafe application.

---

## 📦 What's Included

### 1. GitHub Actions Workflow

-   **File**: `.github/workflows/deploy.yml`
-   **Purpose**: Automated deployment on Git push
-   **Features**: Build, test, deploy, backup, rollback

### 2. Deployment Scripts

-   **deploy.sh**: Main deployment script
-   **auto-deploy.sh**: Automated deployment checker
-   **setup-cicd.sh**: Interactive setup helper

### 3. Webhook Integration

-   **File**: `routes/webhook.php`
-   **Endpoints**: `/webhook/deploy`, `/webhook/status`
-   **Security**: Signature verification with WEBHOOK_SECRET

### 4. Documentation

-   **QUICK_START_CICD.md**: Quick start guide (start here!)
-   **CICD_SETUP_GUIDE.md**: Detailed setup instructions
-   **CI_CD_GUIDE.md**: Complete implementation guide
-   **DEPLOYMENT_CHECKLIST.md**: Step-by-step checklist
-   **deployment/cpanel-cicd-guide.md**: cPanel-specific guide
-   **.github/README.md**: GitHub Actions documentation

### 5. Configuration Files

-   **.gitignore**: Updated with deployment exclusions
-   **Environment variables**: Ready for CI/CD configuration

---

## 🚀 Quick Start (Choose One Method)

### Method A: GitHub Actions (Recommended) ⭐

**Perfect for**: Teams, automated deployments, professional workflow

```bash
# 1. Push to GitHub
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main

# 2. Add GitHub Secrets (in repository settings)
# - CPANEL_HOST
# - CPANEL_USERNAME
# - CPANEL_SSH_KEY
# - CPANEL_PORT

# 3. Done! Every push will auto-deploy
```

**Time**: 10 minutes | **Difficulty**: Easy

---

### Method B: Manual Deployment

**Perfect for**: Simple deployments, learning, testing

```bash
# On cPanel server
cd /home4/servi5ne/repositories/service_cafe
./deploy.sh
```

**Time**: 2 minutes | **Difficulty**: Very Easy

---

### Method C: Cron Auto-Deploy

**Perfect for**: Scheduled updates, hands-free operation

```bash
# Add to crontab on cPanel
*/5 * * * * /home4/servi5ne/repositories/service_cafe/auto-deploy.sh
```

**Time**: 5 minutes | **Difficulty**: Easy

---

### Method D: Webhook Deployment

**Perfect for**: Custom triggers, external integrations

```bash
# Configure webhook in GitHub repository
# URL: https://servecafe.com/webhook/deploy
# Secret: [from .env WEBHOOK_SECRET]
```

**Time**: 5 minutes | **Difficulty**: Medium

---

## 🎯 Recommended Setup Path

### For Teams & Production

```
Step 1: Run setup-cicd.sh
   ↓
Step 2: Set up GitHub Actions (Method A)
   ↓
Step 3: Configure monitoring
   ↓
Step 4: Test deployment
   ↓
Done! 🎉
```

### For Solo Developers

```
Step 1: Upload code to cPanel
   ↓
Step 2: Use manual deployment (Method B)
   ↓
Step 3: Optionally add cron auto-deploy (Method C)
   ↓
Done! 🎉
```

---

## 📋 Setup Checklist

### Initial Setup

-   [ ] Run `./setup-cicd.sh` to configure
-   [ ] Update `.env` with deployment paths
-   [ ] Make scripts executable (`chmod +x *.sh`)
-   [ ] Push code to GitHub

### GitHub Actions Setup

-   [ ] Generate SSH key pair
-   [ ] Add public key to cPanel
-   [ ] Add secrets to GitHub repository
-   [ ] Test deployment with a push

### Server Setup

-   [ ] Create directories on cPanel
    -   [ ] `/home4/servi5ne/repositories/service_cafe`
    -   [ ] `/home4/servi5ne/backups`
    -   [ ] `/home4/servi5ne/logs`
-   [ ] Clone repository
-   [ ] Install dependencies
-   [ ] Run initial deployment
-   [ ] Set up symlink

### Testing

-   [ ] Test manual deployment
-   [ ] Test GitHub Actions deployment
-   [ ] Test webhook endpoint
-   [ ] Check logs for errors
-   [ ] Verify application works

---

## 🔧 Configuration Guide

### Environment Variables (.env)

Add these to your `.env` file:

```env
# CI/CD Configuration
WEBHOOK_SECRET=your-secure-random-secret
DEPLOY_PATH=/home4/servi5ne/repositories/service_cafe
PUBLIC_PATH=/home4/servi5ne/public_html
BACKUP_PATH=/home4/servi5ne/backups
LOG_PATH=/home4/servi5ne/logs
```

### Generate Secure Secrets

```bash
# Generate webhook secret
openssl rand -base64 32 | tr -d /=+ | cut -c -32

# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "deploy@servecafe.com"
```

### GitHub Secrets

| Secret          | How to Get           | Example              |
| --------------- | -------------------- | -------------------- |
| CPANEL_HOST     | cPanel server info   | `server.example.com` |
| CPANEL_USERNAME | Your cPanel username | `servi5ne`           |
| CPANEL_SSH_KEY  | `cat ~/.ssh/id_rsa`  | Private key content  |
| CPANEL_PORT     | Usually 22           | `22`                 |

---

## 🌐 cPanel Server Setup

### Complete Server Setup Script

```bash
# SSH to cPanel
ssh servi5ne@your-server.com

# Create directory structure
mkdir -p /home4/servi5ne/{repositories,backups,logs}

# Clone repository
cd /home4/servi5ne/repositories
git clone https://github.com/yourusername/servecafe.git service_cafe
cd service_cafe

# Setup environment
cp .env.example .env
nano .env  # Configure

# Install dependencies
composer install --no-dev --optimize-autoloader
npm install
npm run build

# Set permissions
chmod -R 755 .
chmod -R 775 storage bootstrap/cache
chmod +x deploy.sh auto-deploy.sh

# Initialize Laravel
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# Create symlink
ln -sfn $(pwd)/public /home4/servi5ne/public_html/sys/app/public

# Test
./deploy.sh
```

---

## 📊 Deployment Workflow

### What Happens When You Push to GitHub

```
1. You push code to GitHub
   ↓
2. GitHub Actions triggers
   ↓
3. Workflow checks out code
   ↓
4. Installs dependencies
   ↓
5. Builds assets
   ↓
6. Runs tests
   ↓
7. Connects to cPanel via SSH
   ↓
8. Creates backup
   ↓
9. Pulls latest code
   ↓
10. Installs dependencies on server
   ↓
11. Sets permissions
   ↓
12. Clears & rebuilds caches
   ↓
13. Runs migrations
   ↓
14. Tests application
   ↓
15. Deployment complete! 🎉
```

**Total Time**: 2-5 minutes per deployment

---

## 🧪 Testing Your Setup

### Test 1: Local Setup

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/projects/services-cafe/service_cafe/servecafe
./setup-cicd.sh
```

**Expected**: Interactive setup completes successfully

### Test 2: Manual Deployment

```bash
./deploy.sh
```

**Expected**: Deployment completes without errors

### Test 3: GitHub Actions

```bash
git add .
git commit -m "Test deployment"
git push origin main
```

**Expected**: Green checkmark in GitHub Actions tab

### Test 4: Webhook

```bash
curl https://servecafe.com/webhook/status
```

**Expected**: `{"status":"active","timestamp":"..."}`

### Test 5: Application

```bash
curl https://servecafe.com
```

**Expected**: Application loads successfully

---

## 📈 Monitoring & Maintenance

### View Logs

```bash
# Deployment logs
tail -f /home4/servi5ne/logs/deploy.log

# Auto-deploy logs
tail -f /home4/servi5ne/logs/auto-deploy.log

# Laravel logs
tail -f /home4/servi5ne/repositories/service_cafe/storage/logs/laravel.log

# Real-time monitoring
watch -n 5 'tail -20 /home4/servi5ne/logs/deploy.log'
```

### Check Status

```bash
# Application status
php artisan route:list
php artisan schedule:list

# Git status
git status
git log --oneline -5

# Cron jobs
crontab -l

# Disk space
df -h
du -sh /home4/servi5ne/repositories/service_cafe
```

### Maintenance Tasks

```bash
# Clean old backups (keeps last 5)
ls -t /home4/servi5ne/backups/*.tar.gz | tail -n +6 | xargs rm

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize
php artisan optimize
composer dump-autoload -o
```

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Issue 1: Permission Denied

```bash
# Fix permissions
chmod +x deploy.sh auto-deploy.sh setup-cicd.sh
chmod -R 755 /home4/servi5ne/repositories/service_cafe
chmod -R 775 storage bootstrap/cache
```

#### Issue 2: GitHub Actions Fails

1. Check GitHub Actions logs
2. Verify secrets are correct
3. Test SSH connection manually
4. Check cPanel firewall settings

#### Issue 3: Webhook Not Working

```bash
# Check webhook endpoint
curl https://servecafe.com/webhook/status

# Check Laravel logs
tail -f storage/logs/laravel.log | grep webhook

# Verify secret in .env
grep WEBHOOK_SECRET .env
```

#### Issue 4: Deployment Fails

```bash
# Check logs
tail -f /home4/servi5ne/logs/deploy.log

# Test deployment manually
cd /home4/servi5ne/repositories/service_cafe
./deploy.sh

# Check dependencies
composer install
npm install
```

#### Issue 5: Application Not Accessible

```bash
# Check symlink
ls -la /home4/servi5ne/public_html/sys/app/public

# Recreate symlink
ln -sfn /home4/servi5ne/repositories/service_cafe/public \
        /home4/servi5ne/public_html/sys/app/public

# Check permissions
chmod -R 755 public
```

---

## 🔐 Security Best Practices

### ✅ Recommendations

-   ✅ Use SSH keys, not passwords
-   ✅ Keep GitHub secrets secure
-   ✅ Rotate keys regularly (every 90 days)
-   ✅ Use strong webhook secrets
-   ✅ Enable 2FA on GitHub
-   ✅ Review deployment logs
-   ✅ Keep Laravel & dependencies updated
-   ✅ Set proper file permissions
-   ✅ Use HTTPS for all endpoints
-   ✅ Keep `.env` file secure

### ❌ Avoid

-   ❌ Committing secrets to repository
-   ❌ Sharing SSH keys
-   ❌ Using weak passwords
-   ❌ Skipping security updates
-   ❌ Exposing sensitive data in logs
-   ❌ Running as root user
-   ❌ Disabling security features

---

## 📚 Documentation Reference

| Document                            | Purpose              | When to Use              |
| ----------------------------------- | -------------------- | ------------------------ |
| **QUICK_START_CICD.md**             | Quick start guide    | First time setup         |
| **CICD_SETUP_GUIDE.md**             | Detailed setup       | Step-by-step guidance    |
| **CI_CD_GUIDE.md**                  | Implementation guide | Understanding the system |
| **DEPLOYMENT_CHECKLIST.md**         | Checklist            | Before each deployment   |
| **deployment/cpanel-cicd-guide.md** | cPanel guide         | cPanel-specific help     |
| **.github/README.md**               | GitHub Actions       | Workflow configuration   |
| **CICD_COMPLETE_SETUP.md**          | This file            | Overview & reference     |

---

## 🎯 Success Metrics

### Your Setup is Successful When:

✅ GitHub Actions shows green checkmark  
✅ Application loads at https://servecafe.com  
✅ No errors in deployment logs  
✅ Backups are created automatically  
✅ Deployments take < 5 minutes  
✅ Team can deploy without SSH access  
✅ Rollback works when needed  
✅ Monitoring shows all systems operational

---

## 🔄 Deployment Commands Quick Reference

### Local Development

```bash
# Setup CI/CD
./setup-cicd.sh

# Test deployment locally
./deploy.sh

# Commit and push
git add .
git commit -m "Your message"
git push origin main
```

### On cPanel Server

```bash
# Manual deployment
./deploy.sh

# View logs
tail -f /home4/servi5ne/logs/deploy.log

# Clear caches
php artisan cache:clear
php artisan config:cache

# Check status
php artisan route:list
git status
```

### GitHub Actions

```bash
# View workflow status
# Go to: Repository → Actions tab

# Re-run failed workflow
# Click on failed run → Re-run all jobs

# Cancel running workflow
# Click on running workflow → Cancel workflow
```

---

## 🆘 Getting Help

### Self-Help Resources

1. **Check Logs**: Most issues are visible in logs
2. **Read Documentation**: Comprehensive guides available
3. **Test Components**: Test each part separately
4. **Review Checklist**: Follow deployment checklist

### Support Channels

1. **Documentation**: Check all MD files in project
2. **GitHub Issues**: Review closed issues for solutions
3. **cPanel Support**: Contact hosting provider
4. **Laravel Documentation**: https://laravel.com/docs

---

## 🚀 Next Steps

### Immediate (Do Now)

1. ✅ Run `./setup-cicd.sh`
2. ✅ Choose deployment method
3. ✅ Complete initial setup
4. ✅ Test deployment

### Short Term (This Week)

1. ✅ Set up monitoring
2. ✅ Configure backups
3. ✅ Train team members
4. ✅ Document customizations

### Long Term (Ongoing)

1. ✅ Monitor deployments
2. ✅ Optimize workflow
3. ✅ Update documentation
4. ✅ Review security regularly

---

## 🎉 Congratulations!

You now have a **professional-grade CI/CD pipeline** for your Serve Cafe application!

### What You've Achieved:

🚀 **Automated Deployments** - Push to deploy  
📦 **Automatic Backups** - Safety net for rollbacks  
🔄 **Multiple Deployment Options** - Flexible workflow  
📊 **Comprehensive Logging** - Full visibility  
🛡️ **Security Best Practices** - Secure by default  
📚 **Complete Documentation** - All information available  
🧪 **Testing & Validation** - Quality assurance  
⚡ **Fast Deployments** - 2-5 minutes per deploy

### Your Development Workflow is Now:

```
Code → Commit → Push → Automatic Deployment → Live! 🎉
```

**No more manual uploads!**  
**No more FTP!**  
**No more complicated deployment processes!**

Just code, commit, and push. Your application will automatically deploy to production with all safety checks in place.

---

## 📞 Final Notes

-   **Keep secrets secure**: Never commit `.env` or SSH keys
-   **Test before deploying**: Use local testing first
-   **Monitor logs**: Check logs after each deployment
-   **Keep backups**: Verify backups are created
-   **Update regularly**: Keep dependencies updated
-   **Document changes**: Update docs when you modify workflow

---

**Happy Coding & Deploying! 🚀**

Your Serve Cafe application is now ready for professional deployment with a complete CI/CD pipeline!

---

_Last Updated: October 2025_  
_Version: 1.0_  
_Project: Serve Cafe MLM System_
