#!/bin/bash

# Auto-deploy script for Serve Cafe - runs via cron
# This script checks for Git changes and automatically deploys

# Configuration
PROJECT_DIR="/home4/servi5ne/repositories/service_cafe"
LOG_FILE="/home4/servi5ne/logs/auto-deploy.log"
LOCK_FILE="/tmp/serve-cafe-deploy.lock"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" | tee -a $LOG_FILE
}

# Check if deployment is already running
if [ -f "$LOCK_FILE" ]; then
    log "⚠️  Deployment already running, skipping..."
    exit 0
fi

# Create lock file
touch $LOCK_FILE

# Ensure log directory exists
mkdir -p $(dirname $LOG_FILE)

log "🔍 Checking for updates..."

# Change to project directory
cd $PROJECT_DIR || {
    log "❌ Error: Cannot access project directory: $PROJECT_DIR"
    rm -f $LOCK_FILE
    exit 1
}

# Check if git is available
if ! command -v git &> /dev/null; then
    log "❌ Error: Git not available"
    rm -f $LOCK_FILE
    exit 1
fi

# Fetch latest changes
git fetch origin main

# Check for updates
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    log "🔄 New changes detected! Starting deployment..."
    
    # Pull changes
    git pull origin main
    
    if [ $? -eq 0 ]; then
        log "✅ Git pull successful"
        
        # Run deployment script
        if [ -f "./deploy.sh" ]; then
            log "🚀 Running deployment script..."
            ./deploy.sh
            
            if [ $? -eq 0 ]; then
                log "✅ Auto-deployment completed successfully!"
            else
                log "❌ Auto-deployment failed!"
            fi
        else
            log "❌ Error: deploy.sh not found"
        fi
    else
        log "❌ Error: Git pull failed"
    fi
else
    log "✅ No changes detected, skipping deployment"
fi

# Remove lock file
rm -f $LOCK_FILE

log "🏁 Auto-deploy check completed"

