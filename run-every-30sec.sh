#!/bin/bash

# Script to run activate-member-package every 30 seconds
# Run this script in the background on your server

echo "🚀 Starting 30-second interval runner for activate-member-package..."

while true; do
    # Run the activation
    curl -s https://servecafe.com/cron/activate-member-package > /dev/null 2>&1
    
    # Log the execution (optional)
    echo "$(date): Activated member package check" >> /home4/servi5ne/activation_log.txt
    
    # Wait 30 seconds
    sleep 30
done
