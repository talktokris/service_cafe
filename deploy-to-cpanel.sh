#!/usr/bin/env bash
#
# Deploy changed files (and optionally build) to cPanel via SSH/rsync.
# 1. Edit deploy-config.env with your cPanel SSH details.
# 2. Run: ./deploy-to-cpanel.sh
#    Or with build first: BUILD=1 ./deploy-to-cpanel.sh
#

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load config (create from deploy-config.env.example if missing)
if [[ -f deploy-config.env ]]; then
  source deploy-config.env
else
  echo "Missing deploy-config.env. Copy deploy-config.env.example and fill in your cPanel SSH details."
  exit 1
fi

if [[ -z "$SSH_USER" || -z "$SSH_HOST" || -z "$REMOTE_PATH" ]]; then
  echo "Set SSH_USER, SSH_HOST, and REMOTE_PATH in deploy-config.env"
  exit 1
fi

if [[ "$SSH_HOST" == *your-server* || "$SSH_USER" == *your_cpanel* ]]; then
  echo "ERROR: deploy-config.env still has placeholder values."
  echo "Edit deploy-config.env and set your real cPanel details, e.g.:"
  echo "  SSH_HOST=servecafe.com"
  echo "  SSH_USER=servi5ne"
  echo "  REMOTE_PATH=repositories/service_cafe"
  exit 1
fi

SSH_PORT="${SSH_PORT:-22}"
REMOTE="${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"

# Optional: run production build before deploy (BUILD=1 ./deploy-to-cpanel.sh)
if [[ "$BUILD" == "1" || "$BUILD" == "true" ]]; then
  echo "=== Running npm run build ==="
  npm run build
  echo ""
fi

echo "=== Deploying to $SSH_USER@$SSH_HOST:$REMOTE_PATH ==="

# 1) Sync public/build (Vite output) so the site uses the latest frontend assets
if [[ -d public/build ]]; then
  echo "Uploading public/build (frontend assets)..."
  if [[ -n "$SSH_KEY" ]]; then
    rsync -avz -e "ssh -i $SSH_KEY -p $SSH_PORT" public/build/ "$REMOTE/public/build/"
  else
    rsync -avz -e "ssh -p $SSH_PORT" public/build/ "$REMOTE/public/build/"
  fi
  echo "Done public/build."
else
  echo "No public/build found. Run: npm run build (or BUILD=1 ./deploy-to-cpanel.sh)"
fi

# 2) Modified and untracked files (skip .DS_Store)
MODIFIED=$(git diff --name-only 2>/dev/null | grep -v '^\.DS_Store$' || true)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null || true)

FILES=()
while IFS= read -r f; do [[ -n "$f" ]] && FILES+=("$f"); done <<< "$MODIFIED"
while IFS= read -r f; do [[ -n "$f" ]] && FILES+=("$f"); done <<< "$UNTRACKED"

if [[ ${#FILES[@]} -gt 0 ]]; then
  echo "Uploading ${#FILES[@]} changed file(s):"
  printf '%s\n' "${FILES[@]}"
  if [[ -n "$SSH_KEY" ]]; then
    rsync -avz --relative -e "ssh -i $SSH_KEY -p $SSH_PORT" "${FILES[@]}" "$REMOTE"
  else
    rsync -avz --relative -e "ssh -p $SSH_PORT" "${FILES[@]}" "$REMOTE"
  fi
  echo "Done changed files."
fi

echo "=== Deploy finished ==="
