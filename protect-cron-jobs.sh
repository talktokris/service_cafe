#!/bin/bash

# Protect Cron Jobs Script
# This script backs up and restores cron jobs during deployment

CRON_BACKUP_FILE="/home4/servi5ne/cron_backup.txt"
PROJECT_DIR="/home4/servi5ne/repositories/service_cafe"

echo "🛡️ Protecting cron jobs during deployment..."

# Function to backup cron jobs
backup_cron_jobs() {
    echo "📦 Backing up current cron jobs..."
    crontab -l > "$CRON_BACKUP_FILE" 2>/dev/null || echo "No existing cron jobs found"
    echo "✅ Cron jobs backed up to: $CRON_BACKUP_FILE"
}

# Function to restore cron jobs
restore_cron_jobs() {
    if [ -f "$CRON_BACKUP_FILE" ]; then
        echo "🔄 Restoring cron jobs from backup..."
        crontab "$CRON_BACKUP_FILE"
        echo "✅ Cron jobs restored successfully"
    else
        echo "⚠️ No cron backup file found"
    fi
}

# Function to add essential cron jobs if missing
ensure_essential_cron_jobs() {
    echo "🔍 Checking for essential cron jobs..."
    
    # Check if activate-member-package cron exists
    if ! crontab -l 2>/dev/null | grep -q "activate-member-package"; then
        echo "⚠️ Missing activate-member-package cron job, adding it..."
        
        # Add the essential cron jobs
        (crontab -l 2>/dev/null; echo "*/15 * * * * curl -s https://servecafe.com/cron/activate-member-package") | crontab -
        (crontab -l 2>/dev/null; echo "*/15 * * * * curl -s https://servecafe.com/cron/leadership-chaque-match") | crontab -
        (crontab -l 2>/dev/null; echo "0 3 1 * * curl -s https://servecafe.com/cron/global-pool-distribution") | crontab -
        
        echo "✅ Essential cron jobs added"
    else
        echo "✅ Essential cron jobs already exist"
    fi
}

# Main execution
case "${1:-backup}" in
    "backup")
        backup_cron_jobs
        ;;
    "restore")
        restore_cron_jobs
        ensure_essential_cron_jobs
        ;;
    "check")
        echo "📋 Current cron jobs:"
        crontab -l 2>/dev/null || echo "No cron jobs found"
        ;;
    *)
        echo "Usage: $0 [backup|restore|check]"
        echo "  backup  - Backup current cron jobs"
        echo "  restore - Restore cron jobs from backup"
        echo "  check   - Show current cron jobs"
        ;;
esac
