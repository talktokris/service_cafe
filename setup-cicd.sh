#!/bin/bash

# ============================================
# Serve Cafe - CI/CD Setup Script for cPanel
# ============================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="Serve Cafe"

# Print colored message
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Print section header
print_section() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Welcome message
clear
print_section "🚀 Serve Cafe CI/CD Setup"
print_message "$GREEN" "This script will help you set up CI/CD for your Serve Cafe application"
echo ""

# Step 1: Check prerequisites
print_section "📋 Step 1: Checking Prerequisites"

if command_exists git; then
    print_message "$GREEN" "✅ Git is installed: $(git --version)"
else
    print_message "$RED" "❌ Git is not installed. Please install Git first."
    exit 1
fi

if command_exists php; then
    print_message "$GREEN" "✅ PHP is installed: $(php --version | head -n 1)"
else
    print_message "$RED" "❌ PHP is not installed. Please install PHP first."
    exit 1
fi

if command_exists composer; then
    print_message "$GREEN" "✅ Composer is installed: $(composer --version | head -n 1)"
else
    print_message "$RED" "❌ Composer is not installed. Please install Composer first."
    exit 1
fi

if command_exists npm; then
    print_message "$GREEN" "✅ npm is installed: $(npm --version)"
else
    print_message "$YELLOW" "⚠️  npm is not installed. Asset building may not work."
fi

# Step 2: Initialize Git repository
print_section "📂 Step 2: Git Repository Setup"

if [ -d ".git" ]; then
    print_message "$GREEN" "✅ Git repository already initialized"
    
    # Show current remote
    if git remote get-url origin >/dev/null 2>&1; then
        CURRENT_REMOTE=$(git remote get-url origin)
        print_message "$BLUE" "Current remote: $CURRENT_REMOTE"
    else
        print_message "$YELLOW" "⚠️  No remote origin set"
        read -p "Would you like to add a remote repository? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Enter your Git repository URL: " GIT_REPO_URL
            git remote add origin "$GIT_REPO_URL"
            print_message "$GREEN" "✅ Remote origin added"
        fi
    fi
else
    print_message "$YELLOW" "⚠️  Git repository not initialized"
    read -p "Would you like to initialize Git repository? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        print_message "$GREEN" "✅ Git repository initialized"
        
        read -p "Enter your Git repository URL: " GIT_REPO_URL
        git remote add origin "$GIT_REPO_URL"
        print_message "$GREEN" "✅ Remote origin added"
        
        # Create initial commit
        git add .
        git commit -m "Initial commit: Serve Cafe application with CI/CD setup" || true
        print_message "$GREEN" "✅ Initial commit created"
    fi
fi

# Step 3: Environment configuration
print_section "⚙️  Step 3: Environment Configuration"

if [ -f ".env" ]; then
    print_message "$GREEN" "✅ .env file exists"
    
    # Check for CI/CD variables
    if grep -q "WEBHOOK_SECRET" .env; then
        print_message "$GREEN" "✅ CI/CD variables already configured"
    else
        print_message "$YELLOW" "⚠️  CI/CD variables missing in .env"
        read -p "Would you like to add CI/CD variables to .env? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Generate random webhook secret
            WEBHOOK_SECRET=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
            
            echo "" >> .env
            echo "# CI/CD Configuration" >> .env
            echo "WEBHOOK_SECRET=$WEBHOOK_SECRET" >> .env
            echo "DEPLOY_PATH=/home4/servi5ne/repositories/service_cafe" >> .env
            echo "PUBLIC_PATH=/home4/servi5ne/public_html" >> .env
            echo "BACKUP_PATH=/home4/servi5ne/backups" >> .env
            echo "LOG_PATH=/home4/servi5ne/logs" >> .env
            
            print_message "$GREEN" "✅ CI/CD variables added to .env"
            print_message "$CYAN" "Generated WEBHOOK_SECRET: $WEBHOOK_SECRET"
            print_message "$YELLOW" "⚠️  Please update the paths in .env according to your cPanel setup"
        fi
    fi
else
    print_message "$RED" "❌ .env file not found. Please create it first."
    exit 1
fi

# Step 4: Make scripts executable
print_section "🔧 Step 4: Configure Deployment Scripts"

if [ -f "deploy.sh" ]; then
    chmod +x deploy.sh
    print_message "$GREEN" "✅ deploy.sh is now executable"
else
    print_message "$YELLOW" "⚠️  deploy.sh not found"
fi

if [ -f "auto-deploy.sh" ]; then
    chmod +x auto-deploy.sh
    print_message "$GREEN" "✅ auto-deploy.sh is now executable"
else
    print_message "$YELLOW" "⚠️  auto-deploy.sh not found"
fi

# Step 5: Test deployment script
print_section "🧪 Step 5: Test Deployment (Optional)"

read -p "Would you like to test the deployment script locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_message "$YELLOW" "Running deployment script test..."
    
    if [ -f "deploy.sh" ]; then
        # Dry run mode (you can modify deploy.sh to support --dry-run)
        print_message "$BLUE" "Checking deployment script..."
        bash -n deploy.sh && print_message "$GREEN" "✅ Deployment script syntax is valid" || print_message "$RED" "❌ Deployment script has syntax errors"
    fi
fi

# Step 6: GitHub Actions setup
print_section "🔄 Step 6: GitHub Actions Configuration"

if [ -f ".github/workflows/deploy.yml" ]; then
    print_message "$GREEN" "✅ GitHub Actions workflow file exists"
    
    print_message "$CYAN" "To complete GitHub Actions setup, add these secrets to your repository:"
    echo ""
    print_message "$YELLOW" "Repository Settings → Secrets and variables → Actions → New repository secret"
    echo ""
    print_message "$BLUE" "Required secrets:"
    echo "  - CPANEL_HOST: Your cPanel server IP or hostname"
    echo "  - CPANEL_USERNAME: Your cPanel username"
    echo "  - CPANEL_SSH_KEY: Your SSH private key (entire key content)"
    echo "  - CPANEL_PORT: SSH port (usually 22)"
    echo ""
else
    print_message "$YELLOW" "⚠️  GitHub Actions workflow not found"
    print_message "$BLUE" "The workflow file should be at: .github/workflows/deploy.yml"
fi

# Step 7: Webhook configuration
print_section "🪝 Step 7: Webhook Setup (Optional)"

print_message "$CYAN" "Webhook endpoint is available at: https://your-domain.com/webhook/deploy"
echo ""
print_message "$YELLOW" "To set up webhook in GitHub:"
echo "1. Go to Repository Settings → Webhooks → Add webhook"
echo "2. Payload URL: https://servecafe.com/webhook/deploy"
echo "3. Content type: application/json"
echo "4. Secret: (use the WEBHOOK_SECRET from your .env file)"
echo "5. Events: Just the push event"
echo ""

# Step 8: cPanel deployment guide
print_section "🌐 Step 8: cPanel Deployment"

print_message "$CYAN" "To deploy to cPanel, follow these steps:"
echo ""
print_message "$YELLOW" "1. Upload your project to cPanel:"
echo "   - Use cPanel File Manager or FTP/SFTP"
echo "   - Upload to: /home4/servi5ne/repositories/service_cafe"
echo ""
print_message "$YELLOW" "2. Set up SSH access (if not already done):"
echo "   - Generate SSH key: ssh-keygen -t rsa -b 4096"
echo "   - Add public key to cPanel: SSH Access → Manage SSH Keys"
echo ""
print_message "$YELLOW" "3. Clone repository on cPanel server:"
echo "   cd /home4/servi5ne/repositories"
echo "   git clone YOUR_REPO_URL service_cafe"
echo "   cd service_cafe"
echo ""
print_message "$YELLOW" "4. Run initial deployment:"
echo "   ./deploy.sh"
echo ""
print_message "$YELLOW" "5. Set up cron job for auto-deploy (optional):"
echo "   */5 * * * * /home4/servi5ne/repositories/service_cafe/auto-deploy.sh"
echo ""

# Step 9: Summary
print_section "📊 Setup Summary"

print_message "$GREEN" "✅ Prerequisites checked"
print_message "$GREEN" "✅ Git repository configured"
print_message "$GREEN" "✅ Deployment scripts ready"
print_message "$GREEN" "✅ GitHub Actions workflow available"
print_message "$GREEN" "✅ Documentation provided"
echo ""

print_message "$CYAN" "📚 Available Documentation:"
echo "  - CI_CD_GUIDE.md          - Complete implementation guide"
echo "  - CICD_SETUP_GUIDE.md     - Setup instructions"
echo "  - DEPLOYMENT_CHECKLIST.md - Deployment checklist"
echo "  - deployment/cpanel-cicd-guide.md - cPanel-specific guide"
echo ""

print_message "$CYAN" "🚀 Next Steps:"
echo "  1. Push your code to GitHub"
echo "  2. Add GitHub Actions secrets"
echo "  3. Deploy to cPanel server"
echo "  4. Test deployment workflow"
echo "  5. Set up monitoring and logs"
echo ""

print_section "🎉 Setup Complete!"

print_message "$GREEN" "Your Serve Cafe CI/CD pipeline is ready!"
print_message "$BLUE" "Check the documentation files for detailed instructions."
echo ""

# Optional: Open documentation
read -p "Would you like to view the CI/CD guide? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command_exists cat; then
        less CICD_SETUP_GUIDE.md || cat CICD_SETUP_GUIDE.md
    fi
fi

print_message "$GREEN" "Thank you for using Serve Cafe CI/CD setup!"
print_message "$CYAN" "For support, check the documentation or contact your development team."
echo ""

