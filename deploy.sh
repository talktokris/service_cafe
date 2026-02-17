#!/usr/bin/env bash
# One-command deploy: build frontend and push to cPanel.
# Usage: ./deploy.sh   or   npm run deploy
set -e
cd "$(dirname "$0")"
export BUILD=1
exec ./deploy-to-cpanel.sh
