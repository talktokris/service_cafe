# ✅ CI/CD Deployment Checklist - Serve Cafe

## 📋 Pre-Deployment Checklist

### **1. Environment Configuration**

-   [ ] Update `.env` file with new variables:
    ```env
    WEBHOOK_SECRET=your-webhook-secret-here
    DEPLOY_PATH=/home4/servi5ne/repositories/service_cafe
    PUBLIC_PATH=/home4/servi5ne/public_html
    ```
-   [ ] Verify existing `.env` settings:
    -   [ ] `APP_ENV=production`
    -   [ ] `APP_DEBUG=false`
    -   [ ] `APP_URL=https://servecafe.com`
    -   [ ] Database credentials correct

### **2. Git Repository Setup**

-   [ ] Initialize Git repository: `git init`
-   [ ] Add all files: `git add .`
-   [ ] Create initial commit: `git commit -m "Initial commit"`
-   [ ] Add remote origin: `git remote add origin https://github.com/yourusername/servecafe.git`
-   [ ] Push to GitHub: `git push -u origin main`

### **3. Deployment Scripts**

-   [ ] Make `deploy.sh` executable: `chmod +x deploy.sh`
-   [ ] Make `auto-deploy.sh` executable: `chmod +x auto-deploy.sh`
-   [ ] Test `deploy.sh` locally
-   [ ] Upload scripts to cPanel server

### **4. Server Configuration**

-   [ ] Create backup directory: `/home4/servi5ne/backups`
-   [ ] Create log directory: `/home4/servi5ne/logs`
-   [ ] Set up symlink: `ln -sfn /home4/servi5ne/repositories/service_cafe/public /home4/servi5ne/public_html/sys/app/public`
-   [ ] Set proper permissions: `chmod -R 755 .` and `chmod -R 775 storage bootstrap/cache`

---

## 🚀 Deployment Options

### **Option A: Manual Deployment**

-   [ ] Run `./deploy.sh` on server
-   [ ] Verify application works
-   [ ] Check logs: `tail -f /home4/servi5ne/logs/deploy.log`

### **Option B: GitHub Actions**

-   [ ] Add GitHub secrets:
    -   [ ] `CPANEL_HOST`
    -   [ ] `CPANEL_USERNAME`
    -   [ ] `CPANEL_SSH_KEY`
    -   [ ] `CPANEL_PORT`
-   [ ] Push to `main` branch to trigger deployment
-   [ ] Monitor GitHub Actions tab

### **Option C: Webhook Deployment**

-   [ ] Configure webhook in Git repository:
    -   [ ] URL: `https://servecafe.com/webhook/deploy`
    -   [ ] Secret: `your-webhook-secret-here`
    -   [ ] Events: Push events
-   [ ] Test webhook: `curl https://servecafe.com/webhook/status`

### **Option D: Cron Auto-Deploy**

-   [ ] Add to crontab: `*/5 * * * * /home4/servi5ne/repositories/service_cafe/auto-deploy.sh`
-   [ ] Monitor logs: `tail -f /home4/servi5ne/logs/auto-deploy.log`

---

## 🔍 Post-Deployment Verification

### **Application Status**

-   [ ] Application loads: `https://servecafe.com`
-   [ ] No 500 errors
-   [ ] Assets load correctly (CSS/JS)
-   [ ] Database connections work
-   [ ] Cron jobs running: `php artisan schedule:list`

### **Log Verification**

-   [ ] Deployment log created: `/home4/servi5ne/logs/deploy.log`
-   [ ] Laravel logs working: `storage/logs/laravel.log`
-   [ ] No critical errors in logs
-   [ ] Webhook logs (if using webhooks)

### **Performance Check**

-   [ ] Page load times acceptable
-   [ ] Database queries optimized
-   [ ] Cache working: `php artisan config:cache`
-   [ ] Routes cached: `php artisan route:cache`

---

## 🛠️ Troubleshooting Checklist

### **Common Issues**

-   [ ] **Permission Denied**: Run `chmod +x deploy.sh auto-deploy.sh`
-   [ ] **Git Not Found**: Install git or use manual upload
-   [ ] **Composer Not Found**: Install composer or upload vendor directory
-   [ ] **SSH Key Issues**: Generate new SSH key pair
-   [ ] **Webhook Not Working**: Check URL and secret configuration

### **Debug Commands**

-   [ ] Check Git status: `git status`
-   [ ] Check Laravel status: `php artisan route:list`
-   [ ] Check file permissions: `ls -la`
-   [ ] Check disk space: `df -h`
-   [ ] Check memory usage: `free -m`

---

## 📊 Monitoring Setup

### **Log Monitoring**

-   [ ] Set up log rotation
-   [ ] Monitor error logs
-   [ ] Set up log alerts
-   [ ] Create log dashboard

### **Status Monitoring**

-   [ ] Health check endpoint: `/webhook/status`
-   [ ] Database connection check
-   [ ] Queue worker status
-   [ ] Cron job status

### **Performance Monitoring**

-   [ ] Response time monitoring
-   [ ] Database query monitoring
-   [ ] Memory usage tracking
-   [ ] Disk space monitoring

---

## 🎯 Success Criteria

### **Deployment Success**

-   [ ] ✅ Application deploys without errors
-   [ ] ✅ All services start correctly
-   [ ] ✅ Database migrations run successfully
-   [ ] ✅ Assets build and load properly
-   [ ] ✅ Logs show successful deployment

### **Automation Success**

-   [ ] ✅ Git push triggers deployment
-   [ ] ✅ Webhooks respond correctly
-   [ ] ✅ Cron jobs run automatically
-   [ ] ✅ Backups are created
-   [ ] ✅ Rollback capability works

### **Monitoring Success**

-   [ ] ✅ All logs are generated
-   [ ] ✅ Status endpoints respond
-   [ ] ✅ Error notifications work
-   [ ] ✅ Performance metrics available
-   [ ] ✅ Health checks pass

---

## 🚨 Emergency Procedures

### **Rollback Process**

-   [ ] Stop current deployment
-   [ ] Restore from latest backup
-   [ ] Clear caches
-   [ ] Restart services
-   [ ] Verify application works

### **Emergency Contacts**

-   [ ] Server administrator contact
-   [ ] Database administrator contact
-   [ ] Development team contact
-   [ ] Hosting provider support

---

## 📝 Notes

### **Deployment Schedule**

-   **Preferred Time**: Low traffic hours
-   **Frequency**: As needed for updates
-   **Duration**: 5-10 minutes per deployment
-   **Downtime**: Minimal (symlink switching)

### **Backup Strategy**

-   **Frequency**: Before each deployment
-   **Retention**: Keep last 5 backups
-   **Location**: `/home4/servi5ne/backups`
-   **Size**: ~50-100MB per backup

### **Testing Strategy**

-   **Local Testing**: Test deployment script locally first
-   **Staging Environment**: Use subdomain for testing
-   **Production Testing**: Verify all functionality after deployment
-   **Rollback Testing**: Test rollback procedure

---

## 🎉 Completion Checklist

-   [ ] All deployment options configured
-   [ ] Monitoring and logging set up
-   [ ] Backup and rollback procedures tested
-   [ ] Team trained on deployment process
-   [ ] Documentation updated
-   [ ] Emergency procedures documented

**🎯 Your CI/CD pipeline is ready for production use!**
