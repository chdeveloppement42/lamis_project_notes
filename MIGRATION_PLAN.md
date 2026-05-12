# Immo Lamis - Architecture Migration Plan

## Executive Summary

**Current State:** Monorepo with separate `backend/` and `frontend/` folders
**Target State:** Single folder full-stack application
**Deployment:** Railway (free tier) for unified deployment
**Timeline:** 2-3 hours implementation

---

## Current Architecture Analysis

### ✅ What's Working
- **Frontend:** React + Vite, deployed on Vercel
- **Backend:** NestJS API, working locally
- **Database:** Neon PostgreSQL (cloud-hosted)
- **Authentication:** JWT with refresh tokens
- **File Upload:** Cloudinary integration
- **Admin Panel:** Role-based permissions system

### ❌ Current Pain Points
- **Complex Deployment:** Separate Vercel + Oracle Cloud setup
- **Build Complexity:** Multiple package.json files
- **Environment Management:** Separate .env files for each service
- **Development:** Running two separate processes
- **Maintenance:** Updates require coordination between services

### 📊 Project Statistics
- **Frontend:** ~1916 modules, 643KB JS bundle
- **Backend:** NestJS with Prisma ORM
- **Database:** 6 tables (admin, provider, listing, category, etc.)
- **API Endpoints:** ~15+ routes
- **Components:** 50+ React components

---

## Target Architecture Design

### New Folder Structure
```
immo_lamis/
├── src/
│   ├── api/              # Backend API routes (moved from backend/src/)
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── listings/
│   │   ├── providers/
│   │   ├── notifications/
│   │   └── media/
│   ├── components/       # Frontend components (moved from frontend/src/components/)
│   ├── pages/           # Frontend pages (moved from frontend/src/pages/)
│   ├── layouts/         # Frontend layouts (moved from frontend/src/layouts/)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Shared utilities
│   ├── types/           # TypeScript types (moved from shared/)
│   ├── prisma/          # Database schema (moved from backend/prisma/)
│   └── assets/          # Static assets (moved from frontend/src/assets/)
├── public/              # Static files (moved from frontend/public/)
├── server.js            # Express server entry point (NEW)
├── index.html           # Frontend entry point (moved from frontend/)
├── package.json         # Unified dependencies (MERGED)
├── vite.config.js       # Frontend build config (moved from frontend/)
├── tailwind.config.js   # CSS config (moved from frontend/)
├── eslint.config.js     # Linting config (moved from frontend/)
├── prisma.config.ts     # Prisma config (moved from backend/)
├── tsconfig.json        # TypeScript config (moved from backend/)
└── .env                 # Unified environment variables (MERGED)
```

### Technology Stack (Unchanged)
- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Express.js (migrated from NestJS)
- **Database:** Prisma + Neon PostgreSQL
- **Authentication:** JWT with refresh tokens
- **File Storage:** Cloudinary
- **Deployment:** Railway (free tier)

### Deployment Strategy
```
┌─────────────────────────────────────┐
│  Railway (Single Service)           │
│  Full-Stack Node.js Application     │
│  https://immo-lamis.up.railway.app  │
└──────────┬──────────────────────────┘
           │
           ↓
┌─────────────────────────────────────┐
│  Database (Neon PostgreSQL)         │
│  Cloud-hosted, accessible globally  │
└─────────────────────────────────────┘
```

---

## Migration Implementation Plan

### Phase 1: Project Structure Migration

#### Step 1.1: Create New Folder Structure
```bash
# Create new directories
mkdir -p src/api src/components src/pages src/layouts src/hooks src/utils src/types src/assets
mkdir -p public prisma

# Move existing files (detailed in Step 1.2)
```

#### Step 1.2: File Migration Mapping
| From | To | Action |
|------|----|--------|
| `backend/src/` | `src/api/` | Move all NestJS controllers/services |
| `frontend/src/components/` | `src/components/` | Move React components |
| `frontend/src/pages/` | `src/pages/` | Move React pages |
| `frontend/src/layouts/` | `src/layouts/` | Move React layouts |
| `frontend/src/assets/` | `src/assets/` | Move assets |
| `frontend/public/` | `public/` | Move static files |
| `shared/src/` | `src/types/` | Move TypeScript types |
| `backend/prisma/` | `prisma/` | Move database schema |
| `frontend/index.html` | `index.html` | Move HTML entry point |
| `frontend/vite.config.js` | `vite.config.js` | Move Vite config |
| `frontend/package.json` | `package.json` | Merge dependencies |

#### Step 1.3: Dependency Consolidation
**New `package.json` (Merged):**
```json
{
  "name": "immo-lamis",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node server.js",
    "build": "vite build",
    "start": "NODE_ENV=production node server.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "node prisma/seed.js",
    "db:migrate": "prisma migrate dev"
  },
  "dependencies": {
    // Backend dependencies (from backend/package.json)
    "@prisma/client": "^7.7.0",
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^2.10.0",
    
    // Frontend dependencies (from frontend/package.json)
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-router-dom": "^7.14.2",
    "axios": "^1.15.2",
    "lucide-react": "^1.14.0",
    "aos": "^2.3.4",
    "browser-image-compression": "^2.0.2",
    "react-select": "^5.10.2"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "vite": "^8.0.9",
    "tailwindcss": "^3.4.4",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "eslint": "^9.39.4"
  }
}
```

### Phase 2: Code Migration

#### Step 2.1: Backend Migration (NestJS → Express)
**Create `server.js` (Express Server):**
```javascript
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Import API routes (converted from NestJS controllers)
import adminRoutes from './src/api/admin/routes.js';
import authRoutes from './src/api/auth/routes.js';
import categoriesRoutes from './src/api/categories/routes.js';
import listingsRoutes from './src/api/listings/routes.js';
import providersRoutes from './src/api/providers/routes.js';
import notificationsRoutes from './src/api/notifications/routes.js';
import mediaRoutes from './src/api/media/routes.js';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static('dist')); // Serve built frontend

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/media', mediaRoutes);

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Step 2.2: Convert NestJS Controllers to Express Routes
**Example: `src/api/auth/routes.js`**
```javascript
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.admin.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
```

#### Step 2.3: Update Frontend API Calls
**Update `src/utils/api.js`:**
```javascript
// Before: axiosInstance from '../api/axiosInstance'
// After: Direct axios calls with full URLs in development
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? ''  // Relative URLs in production (same domain)
  : 'http://localhost:3000/api';  // Full URL in development

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
```

#### Step 2.4: Update Import Paths
**Update all import statements:**
```javascript
// Before
import { ListingStatus } from '../../../shared/src/listing.types';

// After  
import { ListingStatus } from '../types/listing.types';
```

### Phase 3: Configuration Updates

#### Step 3.1: Unified Environment Variables
**New `.env` (Merged):**
```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_89RfaNHOCrtw@ep-polished-sky-aldxisuu-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Authentication
JWT_SECRET="production-secret-key-change-this-randomly!"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="production-refresh-secret-change-this-randomly!"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

# File Storage
CLOUDINARY_CLOUD_NAME="dlpidcul9"
CLOUDINARY_API_KEY="589286466743416"
CLOUDINARY_API_SECRET="z9cc1_VtKx4lo8gBJQnBKWisDXM"
```

#### Step 3.2: Update Vite Configuration
**New `vite.config.js`:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
```

#### Step 3.3: Update Prisma Configuration
**Move `prisma.config.ts` to root and update:**
```typescript
import { defineConfig } from 'prisma';

export default defineConfig({
  schema: './prisma/schema.prisma',
  output: './src/types',
});
```

### Phase 4: Deployment Migration

#### Step 4.1: Railway Configuration
**Create `railway.json`:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

#### Step 4.2: Environment Variables on Railway
Set these in Railway dashboard:
- `DATABASE_URL` (from Neon)
- `JWT_SECRET` (generate random)
- `JWT_REFRESH_SECRET` (generate random)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY` 
- `CLOUDINARY_API_SECRET`
- `NODE_ENV=production`

#### Step 4.3: Database Migration
```bash
# On Railway (after deployment)
railway run npx prisma db push
railway run npm run db:seed
```

### Phase 5: Testing & Validation

#### Step 5.1: Local Testing Checklist
- [ ] `npm run dev` starts both frontend and backend
- [ ] Frontend loads at `http://localhost:5173`
- [ ] API calls work (`/api/auth/login`, etc.)
- [ ] Database connections work
- [ ] File uploads work
- [ ] Authentication flow works
- [ ] Admin panel accessible

#### Step 5.2: Production Testing Checklist
- [ ] Railway deployment succeeds
- [ ] Frontend loads at Railway URL
- [ ] API endpoints respond correctly
- [ ] Database seeded properly
- [ ] Authentication works
- [ ] File uploads work
- [ ] Admin login: `admin@immolamis.com` / `0000`

### Phase 6: Rollback Plan

#### Emergency Rollback Steps
1. **Switch back to `main` branch:**
   ```bash
   git checkout main
   git branch -D migration-single-folder
   ```

2. **Redeploy current architecture:**
   - Push to `deployment` branch
   - Follow original Oracle Cloud + Vercel guide

3. **Data preservation:**
   - Database remains on Neon (unchanged)
   - No data loss during migration

---

## Implementation Timeline

### Day 1: Structure Migration (2 hours)
- [ ] Create new folder structure
- [ ] Move all files according to mapping
- [ ] Update import paths
- [ ] Test basic file structure

### Day 2: Code Migration (3 hours)
- [ ] Convert NestJS to Express routes
- [ ] Update frontend API calls
- [ ] Merge package.json dependencies
- [ ] Update configurations

### Day 3: Testing & Deployment (2 hours)
- [ ] Local testing of unified app
- [ ] Railway deployment setup
- [ ] Production testing
- [ ] Rollback testing

---

## Risk Assessment

### High Risk Items
- **API Route Conversion:** NestJS → Express (complex logic migration)
- **Authentication Flow:** JWT handling changes
- **File Upload:** Multer integration changes

### Mitigation Strategies
- **Incremental Migration:** Convert one API module at a time
- **Dual Testing:** Keep old structure working during migration
- **Backup Branch:** Create `migration-backup` branch before starting

### Success Criteria
- [ ] All API endpoints working
- [ ] Frontend renders correctly
- [ ] Authentication works
- [ ] Database operations work
- [ ] File uploads work
- [ ] Railway deployment succeeds
- [ ] No functionality regressions

---

## Benefits of New Architecture

### Development Experience
- ✅ **Single Command:** `npm run dev` starts everything
- ✅ **Unified Debugging:** One process to debug
- ✅ **Simplified Dependencies:** One package.json
- ✅ **Easier Onboarding:** New developers see single codebase

### Deployment Benefits
- ✅ **Free Hosting:** Railway free tier (512MB RAM, 1GB storage)
- ✅ **Zero Config:** Automatic scaling and SSL
- ✅ **Single Deployment:** Push once, deploy everything
- ✅ **Better Performance:** No API proxy latency

### Maintenance Advantages
- ✅ **Atomic Updates:** Frontend/backend deploy together
- ✅ **Consistent Environments:** Same Node.js version
- ✅ **Simplified Monitoring:** Single service to monitor
- ✅ **Easier Rollbacks:** Single deployment to revert

---

## Next Steps

1. **Create Migration Branch:**
   ```bash
   git checkout -b migration-single-folder
   ```

2. **Start Implementation:**
   - Follow Phase 1: Project Structure Migration
   - Test after each major change

3. **Daily Checkpoints:**
   - End of Day 1: File structure complete
   - End of Day 2: Code migration complete
   - End of Day 3: Deployment ready

**Ready to start? This migration will significantly simplify your development and deployment workflow.** 🚀</content>
<parameter name="filePath">c:\Users\pc1\Desktop\lamis_project_notes\MIGRATION_PLAN.md