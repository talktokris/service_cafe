# Deploy Serve Cafe to cPanel

Two ways to deploy: **one command from your machine** or **automatically on every push** (CI/CD).

---

## Option 1: One-command deploy (local)

From the project root, run:

```bash
npm run deploy
```

Or:

```bash
./deploy.sh
```

This will:

1. Run `npm run build` (Vite production build)
2. Upload `public/build/` and all changed files to your cPanel server via rsync

**Requirements:**

- `deploy-config.env` must exist and be filled (copy from `deploy-config.env.example`).
- You need SSH access to the server (password or SSH key in `deploy-config.env`).

**Config:** Edit `deploy-config.env` (not committed):

- `SSH_HOST=servecafe.com`
- `SSH_USER=servi5ne`
- `REMOTE_PATH=repositories/service_cafe`
- `SSH_PORT=22`
- `SSH_KEY=~/.ssh/your_key` (optional; leave empty to use password)

---

## Option 2: CI/CD — deploy on every push (GitHub Actions)

Pushing to `main` (or `master`) **automatically deploys** to cPanel. You can also run the workflow manually.

### 1. Add GitHub Secrets

In your repo: **Settings → Secrets and variables → Actions → New repository secret.**

Add:

| Secret name       | Value                          |
|-------------------|--------------------------------|
| `CPANEL_HOST`     | `servecafe.com`                |
| `CPANEL_USERNAME` | `servi5ne`                     |
| `CPANEL_SSH_KEY`  | Your **private** SSH key (full content, including `-----BEGIN ... -----`) |
| `CPANEL_PORT`     | `22` (optional; default 22)    |

**Get your private key (Mac):**  
If you use a key, copy it with:  
`cat ~/.ssh/id_rsa` (or the key file you use for servecafe). Paste the whole block into `CPANEL_SSH_KEY`.

If you only use password, you’ll need to switch to SSH key auth for GitHub Actions (cPanel supports adding your public key in **SSH Access**).

### 2. How it runs

- **On push** to `main` or `master`: workflow runs and deploys.
- **Manual run:** **Actions** tab → **Deploy to cPanel** → **Run workflow**.

On the server, the workflow:

- Pulls latest code from GitHub
- Runs `composer install` and `npm install && npm run build`
- Clears Laravel caches and removes `public/hot` so the site uses the production build
- Sets `APP_ENV=production` and `APP_DEBUG=false`

---

## Quick reference

| Goal                         | Command / action                          |
|-----------------------------|-------------------------------------------|
| Deploy from your computer   | `npm run deploy` or `./deploy.sh`        |
| Deploy on every code change | Push to `main` (after secrets are set)   |
| Deploy without pushing      | Actions → Deploy to cPanel → Run workflow |

---

## Troubleshooting

- **Blank page after deploy:** On the server, remove `public/hot` and set `APP_ENV=production`, `APP_DEBUG=false` in `.env`, then run `php artisan config:clear` and `php artisan cache:clear`. The CI/CD workflow does this automatically.
- **419 Session Expired / CSRF errors:** Run `php artisan config:clear` and `php artisan cache:clear` on the server. In `.env`, set `APP_URL` to your site URL (e.g. `https://servecafe.com`), and use `SESSION_SECURE_COOKIE=true` for HTTPS.
- **Deploy script: “Missing deploy-config.env”:** Copy `deploy-config.env.example` to `deploy-config.env` and fill in your SSH details.
- **GitHub Action fails on SSH:** Check that `CPANEL_SSH_KEY` is the full private key and that the matching public key is added in cPanel → SSH Access.
- **cPanel “Update from Remote” fails (local changes / untracked files would be overwritten):** The server repo has local changes that conflict with GitHub. To make the server match GitHub exactly, SSH in and run:
  ```bash
  ssh servi5ne@servecafe.com
  cd /home4/servi5ne/repositories/service_cafe
  git fetch origin main
  git reset --hard origin/main
  git clean -fd
  ```
  Then run your usual post-deploy steps (e.g. `composer install`, `npm run build`, `php artisan config:clear`). Any server-only edits will be lost; the repo will match GitHub.
