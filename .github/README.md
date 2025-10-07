# GitHub Actions CI/CD Workflow

## Overview

This directory contains the GitHub Actions workflow for automated deployment of the Serve Cafe application to cPanel hosting.

## Workflow File

-   **File**: `workflows/deploy.yml`
-   **Trigger**: Push to `main` or `master` branch, pull requests, manual dispatch
-   **Purpose**: Automated deployment to cPanel hosting

## Setup Instructions

### Prerequisites

1. GitHub repository with your code
2. cPanel hosting with SSH access
3. SSH key pair for authentication

### Step 1: Generate SSH Key Pair

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Save to default location or specify custom path
# Default: ~/.ssh/id_rsa
```

### Step 2: Add Public Key to cPanel

1. Login to your cPanel account
2. Navigate to **SSH Access**
3. Click **Manage SSH Keys**
4. Click **Import Key** or **Add Public Key**
5. Paste the contents of your public key (`~/.ssh/id_rsa.pub`)
6. Click **Authorize** to activate the key

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name       | Description                      | Example                                 |
| ----------------- | -------------------------------- | --------------------------------------- |
| `CPANEL_HOST`     | cPanel server IP or hostname     | `123.456.789.0` or `server.example.com` |
| `CPANEL_USERNAME` | cPanel username                  | `servi5ne`                              |
| `CPANEL_SSH_KEY`  | SSH private key (entire content) | Contents of `~/.ssh/id_rsa`             |
| `CPANEL_PORT`     | SSH port (optional)              | `22` (default)                          |

#### How to Get SSH Private Key

```bash
# View and copy your private key
cat ~/.ssh/id_rsa
```

**Important**: Copy the entire key including:

```
-----BEGIN OPENSSH PRIVATE KEY-----
...key content...
-----END OPENSSH PRIVATE KEY-----
```

### Step 4: Configure Server Paths

Update the paths in the workflow file if your cPanel structure is different:

```yaml
cd /home4/servi5ne/repositories/service_cafe # Update this path
```

Common cPanel paths:

-   `/home/username/repositories/project`
-   `/home/username/public_html/project`
-   `/home2/username/repositories/project`

### Step 5: Test the Workflow

1. Make a small change to your code
2. Commit and push:
    ```bash
    git add .
    git commit -m "Test deployment workflow"
    git push origin main
    ```
3. Go to **Actions** tab in GitHub
4. Watch the deployment progress

## Workflow Features

### ✅ What the Workflow Does

1. **Checkout Code** - Gets latest code from repository
2. **Setup PHP** - Installs PHP 8.2 with required extensions
3. **Setup Node.js** - Installs Node.js 20 for asset building
4. **Cache Dependencies** - Caches Composer and npm packages
5. **Install Dependencies** - Installs PHP and Node packages
6. **Build Assets** - Compiles frontend assets using Vite
7. **Run Tests** - Executes PHPUnit tests (optional)
8. **Deploy to cPanel** - Deploys via SSH
9. **Post-Deployment** - Clears caches, runs migrations

### 🔄 Deployment Process on cPanel

The workflow executes these steps on your cPanel server:

1. Creates backup of current version
2. Pulls latest changes from Git
3. Installs Composer dependencies
4. Builds frontend assets (if npm available)
5. Sets correct file permissions
6. Clears Laravel caches
7. Rebuilds Laravel caches
8. Runs database migrations
9. Updates public directory symlink
10. Cleans up old backups
11. Tests application

### 📊 Monitoring

#### View Workflow Runs

-   Go to **Actions** tab in GitHub
-   Click on a workflow run to see details
-   Check each step for success/failure

#### View Logs

```bash
# SSH to your cPanel server
ssh username@server-ip

# View deployment logs
tail -f /home4/servi5ne/logs/deploy.log

# View Laravel logs
tail -f /home4/servi5ne/repositories/service_cafe/storage/logs/laravel.log
```

## Customization

### Change Deployment Branch

Edit `.github/workflows/deploy.yml`:

```yaml
on:
    push:
        branches: [production] # Change from 'main' to your branch
```

### Skip Tests

Comment out or remove the test step:

```yaml
# - name: 🧪 Run tests
#   run: php artisan test
```

### Add Environment-Specific Steps

Add custom steps for your environment:

```yaml
- name: Custom Step
  run: |
      # Your custom commands here
      php artisan custom:command
```

### Change PHP/Node Versions

```yaml
- name: Setup PHP
  with:
      php-version: "8.3" # Change PHP version

- name: Setup Node.js
  with:
      node-version: "21" # Change Node version
```

## Troubleshooting

### Common Issues

#### 1. SSH Connection Failed

**Error**: `Permission denied (publickey)`

**Solution**:

-   Verify SSH key is added to cPanel
-   Check private key is correctly copied to GitHub secrets
-   Ensure key is authorized in cPanel

#### 2. Permission Denied on Server

**Error**: `Permission denied` when executing commands

**Solution**:

```bash
# SSH to server and fix permissions
chmod -R 755 /home4/servi5ne/repositories/service_cafe
chmod -R 775 /home4/servi5ne/repositories/service_cafe/storage
chmod -R 775 /home4/servi5ne/repositories/service_cafe/bootstrap/cache
```

#### 3. Composer Install Failed

**Error**: `composer: command not found`

**Solution**:

-   Install Composer on cPanel server
-   Or upload `vendor` directory pre-built

#### 4. Git Not Found

**Error**: `git: command not found`

**Solution**:

-   Contact hosting provider to install Git
-   Or use alternative deployment method

#### 5. Build Assets Failed

**Error**: `npm: command not found`

**Solution**:

-   Build assets locally before deployment
-   Upload pre-built `public/build` directory
-   Or install Node.js on cPanel server

### Debug Mode

Enable debug mode in workflow:

```yaml
- name: Debug Info
  run: |
      echo "Current directory: $(pwd)"
      echo "Files: $(ls -la)"
      echo "Git status: $(git status)"
      echo "PHP version: $(php -v)"
```

## Security Best Practices

### ✅ Do's

-   ✅ Use SSH keys instead of passwords
-   ✅ Keep secrets in GitHub Secrets
-   ✅ Use strong webhook secrets
-   ✅ Regularly rotate SSH keys
-   ✅ Review workflow logs
-   ✅ Set proper file permissions

### ❌ Don'ts

-   ❌ Never commit SSH keys to repository
-   ❌ Don't share GitHub secrets
-   ❌ Don't use weak passwords
-   ❌ Don't skip security updates
-   ❌ Don't expose sensitive data in logs

## Performance Optimization

### Cache Strategy

The workflow uses caching for:

-   Composer dependencies
-   npm packages

This significantly reduces deployment time.

### Parallel Processing

Multiple steps run in parallel where possible:

-   Dependency installation
-   Asset building

### Optimization Tips

1. **Use `npm ci` instead of `npm install`** - Faster, more reliable
2. **Cache dependencies** - Reduces download time
3. **Skip unnecessary steps** - Only run what's needed
4. **Optimize asset building** - Use production mode

## Backup & Rollback

### Automatic Backups

The workflow creates a backup before each deployment:

-   Location: `/home4/servi5ne/backups/`
-   Format: `backup-YYYYMMDD-HHMMSS.tar.gz`
-   Retention: Last 5 backups

### Manual Rollback

```bash
# SSH to server
ssh username@server-ip

# Navigate to project
cd /home4/servi5ne/repositories/service_cafe

# Restore from backup
tar -xzf /home4/servi5ne/backups/backup-YYYYMMDD-HHMMSS.tar.gz -C .
```

## Alternative Deployment Methods

If GitHub Actions doesn't work for you, try:

1. **Manual Deployment** - Run `deploy.sh` on server
2. **Webhook Deployment** - Use Laravel webhook endpoint
3. **Cron Auto-Deploy** - Set up cron job with `auto-deploy.sh`
4. **FTP/SFTP Upload** - Upload files manually

See main documentation for details.

## Support

For more information, check:

-   `QUICK_START_CICD.md` - Quick start guide
-   `CICD_SETUP_GUIDE.md` - Detailed setup
-   `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
-   `deployment/cpanel-cicd-guide.md` - cPanel guide

## Workflow Status Badge

Add this badge to your README.md:

```markdown
![Deploy to cPanel](https://github.com/yourusername/servecafe/workflows/Deploy%20to%20cPanel/badge.svg)
```

Replace `yourusername` with your GitHub username and `servecafe` with your repository name.

---

**Happy Deploying! 🚀**
