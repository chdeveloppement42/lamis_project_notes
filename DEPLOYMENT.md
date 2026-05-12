# Immo Lamis - Deployment Guide

## Architecture Overview

```
┌─────────────────────┐
│  Frontend (Vercel)  │
│  React + Vite       │
│  https://your-frontend.vercel.app
└──────────┬──────────┘
           │ API calls to /api
           ↓
┌─────────────────────────────────────────────┐
│  Vercel Rewrites (API Proxy)                │
│  /api/* → https://backend-oracle.com/api/*  │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────────┐
│  Backend (Oracle Cloud Always Free VM)          │
│  NestJS + Node.js                               │
│  https://your-backend-ip:3000                   │
└──────────┬──────────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│  Database (Neon PostgreSQL)                 │
│  Cloud-hosted, accessible from anywhere     │
└─────────────────────────────────────────────┘
```

---

## Part 1: Set Up Oracle Cloud Always Free VM

### Step 1.1: Create Oracle Cloud Account
1. Go to [oracle.com/cloud/free](https://oracle.com/cloud/free)
2. Click "Start for free" → Create account (no credit card required)
3. Verify email and complete sign-up
4. Go to Dashboard → Click "Create a VM instance"

### Step 1.2: Create Compute Instance
1. **Name**: `lamis-backend`
2. **Image**: Ubuntu 22.04 (Always Free eligible)
3. **Shape**: Ampere (ARM) - Always Free
4. **Storage**: 50 GB (Free tier includes)
5. Download SSH key pair (.key file) - **SAVE THIS SAFELY**
6. Click "Create" → Wait 2-3 minutes

### Step 1.3: Configure Networking
1. Go to Networking → Virtual Cloud Networks
2. Find your VCN → Click Security Lists
3. Add Ingress Rule:
   - **Protocol**: TCP
   - **Port**: 3000, 8080
   - **Source**: 0.0.0.0/0 (allows all)
4. Save

### Step 1.4: Connect to VM
**On Windows (PowerShell):**
```powershell
# Navigate to where you downloaded the .key file
cd C:\path\to\key

# Fix permissions
icacls "your-key.key" /inheritance:r /grant:r "$env:username:(F)"

# Connect (replace IP)
ssh -i your-key.key ubuntu@your-instance-ip
```

**On Mac/Linux:**
```bash
chmod 600 your-key.key
ssh -i your-key.key ubuntu@your-instance-ip
```

---

## Part 2: Deploy Backend to Oracle Cloud

### Step 2.1: Update Backend Environment
**On your local machine**, create `backend/.env.production`:
```env
# Database - Use Neon (cloud-hosted)
DATABASE_URL="postgresql://neondb_owner:npg_89RfaNHOCrtw@ep-polished-sky-aldxisuu-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Auth
JWT_SECRET="production-secret-key-change-this-randomly!"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="production-refresh-secret-change-this-randomly!"
JWT_REFRESH_EXPIRES_IN="7d"
NODE_ENV="production"

# Server
PORT=3000
FRONTEND_URL="https://your-frontend-vercel-url.vercel.app"

# Storage
STORAGE_PROVIDER="cloudinary"
UPLOAD_DIR="./uploads"
CLOUDINARY_CLOUD_NAME="dlpidcul9"
CLOUDINARY_API_KEY="589286466743416"
CLOUDINARY_API_SECRET="z9cc1_VtKx4lo8gBJQnBKWisDXM"
```

**Commit and push:**
```bash
git add backend/.env.production
git commit -m "Add production environment for backend"
git push origin deployment
```

### Step 2.2: Install Dependencies on Oracle VM
**SSH into your VM**, then run:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone repository
git clone https://github.com/chdeveloppement42/lamis_project_notes.git
cd lamis_project_notes

# Checkout deployment branch
git checkout deployment
```

### Step 2.3: Install Backend Dependencies
```bash
cd backend

# Install with legacy-peer-deps (same as Vercel)
npm install --legacy-peer-deps

# Verify Prisma generates
npx prisma generate

# Build backend
npm run build
```

### Step 2.4: Start Backend with PM2
```bash
# Start backend (from backend directory)
pm2 start "npm run start:prod" --name "lamis-backend"

# Make it restart on reboot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs lamis-backend
```

### Step 2.5: Get Your Backend URL
```bash
# Get VM's public IP
hostname -I
# or check Oracle Cloud dashboard for "Public IP Address"
```
Your backend URL: `http://<your-oracle-ip>:3000`

---

## Part 3: Update Vercel Configuration

### Step 3.1: Update vercel.json
**Update this file locally** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://your-oracle-ip:3000/api/:path*"
    }
  ]
}
```

### Step 3.2: Push Changes
```bash
git add vercel.json
git commit -m "Update backend URL for production Oracle Cloud deployment"
git push origin deployment
```

**Vercel will auto-rebuild.** Check your deployment dashboard.

---

## Part 4: Test Everything

### Step 4.1: Test Frontend
1. Open `https://your-frontend-vercel-url.vercel.app`
2. Go to login page
3. Open DevTools → Network tab
4. Try to login with: `admin@immolamis.com` / `0000`
5. Check if API calls reach your backend (should see `/api/auth/login` requests)

### Step 4.2: Test Backend Directly
```bash
# From your machine
curl http://your-oracle-ip:3000/health
```

### Step 4.3: Monitor Backend Logs
```bash
# SSH into Oracle VM
pm2 logs lamis-backend
```

---

## Part 5: HTTPS (Optional but Recommended)

### Option A: Use Nginx Reverse Proxy with Let's Encrypt

**On Oracle VM:**
```bash
# Install Nginx
sudo apt install -y nginx

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain if you have one)
sudo certbot certonly --standalone -d your-domain.com

# Create Nginx config
sudo nano /etc/nginx/sites-available/lamis-backend
```

**Paste this:**
```nginx
server {
    listen 443 ssl http2;
    server_name your-oracle-ip;  # or your domain

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable:**
```bash
sudo ln -s /etc/nginx/sites-available/lamis-backend /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

Then update `vercel.json` to use HTTPS:
```json
"destination": "https://your-oracle-ip:443/api/:path*"
```

---

## Part 6: Environment Variables Reference

### Backend (.env.production)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Random secret for token signing
- `FRONTEND_URL` - Your Vercel frontend URL (for CORS)
- `CLOUDINARY_*` - Already configured, keep as is

### Frontend (.env.production)
```env
VITE_API_URL=/api
```
This tells frontend to use relative URLs, which Vercel rewrites to your backend.

---

## Part 7: Troubleshooting

### Backend not connecting?
```bash
# SSH to Oracle VM and check
pm2 logs lamis-backend
pm2 status

# Restart if needed
pm2 restart lamis-backend
```

### API calls still failing?
1. Check Network tab in DevTools
2. Verify CORS headers from backend
3. Update `FRONTEND_URL` in backend `.env.production`

### Database connection issues?
```bash
# SSH to Oracle VM
cd ~/lamis_project_notes/backend
npx prisma db push  # Sync schema
npm run db:seed     # Seed initial data
```

### Neon Database limits?
- Always Free tier: 512 MB storage, good for small apps
- If needed, upgrade or use managed PostgreSQL

---

## Quick Reference: Deployment Checklist

- [ ] Oracle Cloud VM created and running
- [ ] Node.js and PM2 installed on Oracle VM
- [ ] Repository cloned on Oracle VM
- [ ] Backend dependencies installed (`npm install --legacy-peer-deps`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Backend built (`npm run build`)
- [ ] Backend started with PM2 (`pm2 start "npm run start:prod"`)
- [ ] Backend URL obtained (public IP)
- [ ] `vercel.json` updated with backend URL
- [ ] Frontend `.env.production` set to `VITE_API_URL=/api`
- [ ] Changes committed and pushed to `deployment` branch
- [ ] Vercel rebuilt successfully
- [ ] Login tested on production frontend
- [ ] API requests reaching backend

---

## Maintenance

### Daily Operations
```bash
# Monitor backend
pm2 logs lamis-backend

# Restart if needed
pm2 restart lamis-backend

# Check Oracle VM resources
free -h
df -h
```

### Update Backend
```bash
# SSH to Oracle VM
cd ~/lamis_project_notes
git pull origin deployment
cd backend
npm install --legacy-peer-deps
npm run build
pm2 restart lamis-backend
```

### Backup Database
```bash
# PostgreSQL dumps via Neon dashboard
# Or set up automated backups in Neon UI
```

---

**Need help? Check logs with `pm2 logs lamis-backend` on the Oracle VM.**
