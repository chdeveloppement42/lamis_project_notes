You are a professional software project analyst and technical writer.

I will provide you with a detailed project summary for a web application
called "immo_lamis". Your job is to generate a complete, professional,
and well-structured "Cahier des Charges" (Functional & Technical
Specification Document) in French based on that summary.

─────────────────────────────────────────────
INSTRUCTIONS
─────────────────────────────────────────────

1. LANGUAGE
   - Write the entire document in French
   - Use professional and formal language
   - Technical terms (JWT, BCrypt, WebP, etc.) stay in English

2. STRUCTURE
   The document must contain the following sections in order:

   1. Page de garde
      - Nom du projet, version, date, statut

   2. Présentation du projet
      - Contexte, objectif, concept principal

   3. Acteurs du système
      - Description de chaque acteur et ses droits

   4. Analyse fonctionnelle
      - Fonctionnalités détaillées par acteur

   5. Interfaces & Pages
      - Liste complète de toutes les pages
      - Description détaillée de chaque page
      - Distinction claire : pages publiques / fournisseur / admin

   6. Système de rôles et permissions
      - Modèle RBAC
      - Liste des rôles par défaut
      - Liste des permissions configurables
      - Règles de gestion (escalade, suppression de rôle, etc.)

   7. Pipeline Media
      - Flux complet du traitement des images
      - Règles techniques (format, taille, watermark, stockage)

   8. Sécurité & Authentification
      - Mécanismes de sécurité utilisés
      - Gestion des mots de passe
      - Protection des routes

   9. Schema de base de données
      - Modèles Prisma complets
      - Relations entre entités
      - Enums

   10. Stack technique
       - Tableau complet de toutes les technologies
       - Justification de chaque choix

   11. Hors périmètre
       - Ce qui est explicitement exclu du projet

   12. Points ouverts
       - Décisions encore en attente

   13. Notes critiques de développement
       - Règles importantes à respecter pendant le développement

   14. Prochaines étapes
       - Étapes ordonnées jusqu'au déploiement

3. FORMATTING RULES
   - Use clear markdown headers (##, ###)
   - Use tables where comparisons or lists are needed
   - Use code blocks for all Prisma schema models
   - Use bullet points for feature lists
   - Each section must be separated by a horizontal rule (---)
   - Document must start with a title block and version number

4. TONE & QUALITY
   - This is a professional deliverable, not a casual summary
   - Every section must be complete — do not skip or summarize
   - Be precise and unambiguous — this document will be used
     by developers to build the application
   - Do not add features or decisions that are not in the summary
   - Do not remove any feature or decision from the summary

5. IMPORTANT RULES
   - Do not invent anything — only use what is in the summary
   - If something is marked as "to be decided" keep it as such
   - Respect all decisions marked as final in the summary
   - The permission system must reflect Full RBAC + CASL pattern
   - The single Super Admin rule must be clearly stated
   - The StorageService abstraction must be mentioned explicitly

─────────────────────────────────────────────
NOW GENERATE THE CAHIER DES CHARGES
based on the following project summary:
=====================================================================
  immo_lamis — DETAILED PROJECT SUMMARY
=====================================================================

PROJECT NAME        : immo_lamis
TYPE                : Secure Real Estate Listing Web Platform
SPECIFICATION       : CLOSED ✅
VERSION             : 5.0

---------------------------------------------------------------------
1. CORE CONCEPT
---------------------------------------------------------------------
immo_lamis is a web platform that connects real estate providers
(agencies / agents) with property seekers. The platform's core
differentiator is a mandatory admin validation system — no provider
can publish any listing without being manually approved first.
This creates a curated, trustworthy environment for visitors.

---------------------------------------------------------------------
2. ACTORS & ROLES
---------------------------------------------------------------------

VISITOR (no account required)
  - Browse all published and validated listings
  - Filter by: category, price range, rooms, city
  - View full listing detail page
  - Contact the platform via the contact form

PROVIDER (account required + admin validation)
  - Register with personal info + mandatory document upload
  - Login with dynamic state handling:
      → If pending  : orange banner "Compte en attente de validation"
      → If validated: redirect to listing publication space
      → If rejected : rejection message displayed
  - Post listings (only after validation)
  - Save listings as draft or publish immediately
  - Upload multiple photos per listing

SUPER ADMIN (single account — platform owner)
  - Full unrestricted access to everything
  - Only one Super Admin exists — cannot be deleted or restricted
  - Only one who can access Permission Management page
  - Creates and manages all admin/manager accounts
  - Can assign permissions up to their own level only

MANAGERS / MODERATORS (multiple accounts)
  - Internal staff accounts with configurable permissions
  - Access level defined by their assigned role
  - Cannot exceed the permission level of their creator
  - Role changes apply immediately to all users holding that role

---------------------------------------------------------------------
3. ROLES & PERMISSION SYSTEM
---------------------------------------------------------------------

PATTERN         : Full RBAC (Role-Based Access Control)
LIBRARY         : CASL (integrated with NestJS Guards)
SCHEMA APPROACH : Roles and permissions stored in database,
                  linked via join table (RolePermission),
                  fully configurable from UI

ROLE STRUCTURE
  - Platform ships with preset default roles:
      → Super Admin   (full access, not editable)
      → Manager       (broad access, editable)
      → Moderator     (limited access, editable)
  - Super Admin can create custom roles with custom names
  - Each role has a set of toggleable permissions
  - Changes to a role apply immediately to all users with that role

PERMISSION MANAGEMENT PAGE (Super Admin only)
  - Lists all existing roles
  - Each role shows its full permission set as toggles
  - Super Admin can:
      → Create new roles
      → Edit permissions of existing roles
      → Delete roles
  - When a role is deleted:
      → All users holding that role are automatically SUSPENDED
      → They must be reassigned a new role to regain access

PERMISSION ESCALATION RULE
  - A manager can only assign permissions UP TO their own level
  - No user can create another user with more permissions than themselves

CONFIGURABLE PERMISSIONS (per role)
  - view:dashboard
  - manage:providers        (validate / reject / suspend)
  - manage:listings         (publish / unpublish / delete)
  - manage:categories       (add / edit / delete)
  - manage:users            (view / reset passwords)
  - manage:admins           (create / edit / deactivate admin accounts)
  - view:notifications
  - manage:permissions      (Super Admin only)

---------------------------------------------------------------------
4. DATABASE SCHEMA (Prisma)
---------------------------------------------------------------------

// ─── ENUMS ───────────────────────────────────────────────────────

enum AccountStatus {
  PENDING
  VALIDATED
  REJECTED
  SUSPENDED
}

enum ListingStatus {
  DRAFT
  PUBLISHED
  UNPUBLISHED
}

enum UserType {
  PROVIDER
  ADMIN
}

// ─── ROLE ────────────────────────────────────────────────────────

model Role {
  id          Int              @id @default(autoincrement())
  name        String           @unique
  isDefault   Boolean          @default(false)
  isSuperAdmin Boolean         @default(false)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  permissions RolePermission[]
  admins      Admin[]
}

// ─── PERMISSION ───────────────────────────────────────────────────

model Permission {
  id          Int              @id @default(autoincrement())
  action      String           @unique
  description String?
  createdAt   DateTime         @default(now())

  roles       RolePermission[]
}

// ─── ROLE PERMISSION (Join Table) ────────────────────────────────

model RolePermission {
  id           Int        @id @default(autoincrement())
  role         Role       @relation(fields: [roleId], references: [id])
  roleId       Int
  permission   Permission @relation(fields: [permissionId], references: [id])
  permissionId Int
  createdAt    DateTime   @default(now())

  @@unique([roleId, permissionId])
}

// ─── ADMIN ───────────────────────────────────────────────────────

model Admin {
  id          Int       @id @default(autoincrement())
  firstName   String
  lastName    String
  email       String    @unique
  password    String
  isSuperAdmin Boolean  @default(false)
  status      AccountStatus @default(VALIDATED)
  role        Role      @relation(fields: [roleId], references: [id])
  roleId      Int
  createdBy   Admin?    @relation("AdminCreatedBy", fields: [createdById], references: [id])
  createdById Int?
  createdAdmins Admin[] @relation("AdminCreatedBy")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  notifications Notification[]
}

// ─── PROVIDER ────────────────────────────────────────────────────

model Provider {
  id           Int           @id @default(autoincrement())
  firstName    String
  lastName     String
  email        String        @unique
  password     String
  phone        String
  address      String
  documentUrl  String
  status       AccountStatus @default(PENDING)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  listings     Listing[]
}

// ─── CATEGORY ────────────────────────────────────────────────────

model Category {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  slug        String    @unique
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  listings    Listing[]
}

// ─── LISTING ─────────────────────────────────────────────────────

model Listing {
  id          Int           @id @default(autoincrement())
  title       String
  description String
  price       Float
  city        String
  district    String
  status      ListingStatus @default(DRAFT)
  provider    Provider      @relation(fields: [providerId], references: [id])
  providerId  Int
  category    Category      @relation(fields: [categoryId], references: [id])
  categoryId  Int
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  images      ListingImage[]
}

// ─── LISTING IMAGE ────────────────────────────────────────────────

model ListingImage {
  id          Int      @id @default(autoincrement())
  url         String
  isMain      Boolean  @default(false)
  listing     Listing  @relation(fields: [listingId], references: [id])
  listingId   Int
  createdAt   DateTime @default(now())
}

// ─── NOTIFICATION ────────────────────────────────────────────────

model Notification {
  id          Int      @id @default(autoincrement())
  type        String
  message     String
  isRead      Boolean  @default(false)
  admin       Admin    @relation(fields: [adminId], references: [id])
  adminId     Int
  createdAt   DateTime @default(now())
}

---------------------------------------------------------------------
5. ENTITY RELATIONSHIPS
---------------------------------------------------------------------

  Admin ──────────────── Role
                          │
                    RolePermission
                          │
                      Permission

  Provider ──────────── Listing ──────── Category
                          │
                      ListingImage

  Admin ─────────────── Notification

  Admin ─────────────── Admin (self-relation: createdBy)

---------------------------------------------------------------------
6. PAGES & INTERFACES
---------------------------------------------------------------------

PUBLIC PAGES (accessible by all visitors)

  6.1 Landing Page
      - Hero section: catchy title, subtitle, quick search bar
        (Location, Property type, Budget)
      - Category section: visual clickable blocks
      - Latest listings: grid of last 6 validated properties
      - CTA button: "Devenir fournisseur"

  6.2 Services Page (Listings Grid)
      - Sidebar filters: category, price, rooms, city
      - Listing cards: photo, price, badge, location, title
      - Pagination

  6.3 Listing Detail Page
      - Full photo gallery (watermarked)
      - Title, description, price, location
      - Provider info + contact button

  6.4 About Page
      - Mission, values, statistics

  6.5 Contact Page
      - Form + coordinates + Google Maps

PROVIDER PAGES

  6.6 Register Page
      - Fields + mandatory document upload

  6.7 Login Page
      - Dynamic states: pending / validated / rejected

  6.8 Post a Listing Page (validated only)
      - Category, title, description, price, city, district
      - Photo upload + draft/publish toggle

ADMIN PANEL

  6.9  Dashboard           → all roles
  6.10 Notifications       → configurable per role
  6.11 Provider Management → configurable per role
  6.12 User Management     → configurable per role
  6.13 Category Management → configurable per role
  6.14 Listing Moderation  → configurable per role
  6.15 Permission Manager  → Super Admin only

---------------------------------------------------------------------
7. MEDIA PIPELINE
---------------------------------------------------------------------

  Provider selects photos
          ↓
  [FRONTEND] browser-image-compression
    → WebP format / max 800KB / max 1920px
          ↓
  Multer receives upload
          ↓
  [BACKEND] Sharp applies immo_lamis watermark
          ↓
  StorageService saves watermarked WebP locally
          ↓
  Served to visitors

  RULES:
  - WebP only
  - Max 800KB / max 1920px
  - Original NEVER stored
  - Storage abstracted via StorageService module
    (swap to Cloudinary/S3 by changing one module only)

---------------------------------------------------------------------
8. AUTHENTICATION & SECURITY
---------------------------------------------------------------------

  - Password hashing    : BCrypt
  - Authentication      : JWT
  - Route protection    : NestJS Guards + CASL
  - Password reset      : Admin-managed only
  - Privilege rule      : Cannot assign more than own level
  - Super Admin         : Single, fully unrestricted, undeletable

---------------------------------------------------------------------
9. TECH STACK
---------------------------------------------------------------------

  Layer               Technology
  ──────────────────────────────────────────────────────
  Frontend            React.js + React Router
  Backend             NestJS
  Permission Library  CASL (NestJS integration)
  Database            PostgreSQL
  ORM                 Prisma
  Authentication      JWT + BCrypt
  File Upload         Multer
  Image Processing    Sharp (watermark — backend)
  Image Compression   browser-image-compression (frontend)
  Image Format        WebP
  Maps                Google Maps API
  Notifications       Polling (10s interval)
  Storage             Local → StorageService module
                      (evolvable to Cloudinary / S3)

---------------------------------------------------------------------
10. OUT OF SCOPE
---------------------------------------------------------------------

  - Mobile app
  - Email notifications
  - Payment or booking system
  - Chat between visitor and provider
  - Email-based password reset
  - WebSocket / real-time notifications

---------------------------------------------------------------------
11. OPEN POINTS
---------------------------------------------------------------------

  #   Topic                           Status
  ──────────────────────────────────────────────────────
  1   Admin panel UI full detail      ⏳ To be designed
  2   Image storage migration         ⏳ Future decision

---------------------------------------------------------------------
12. CRITICAL DEVELOPMENT NOTES
---------------------------------------------------------------------

  1. PERMISSION SCHEMA FIRST
     Design and seed roles/permissions before any backend code.
     Every admin route depends on this.

  2. STORAGE ABSTRACTION FROM DAY ONE
     All image operations go through StorageService only.
     Never write direct filesystem calls across the codebase.

  3. NESTJS GUARDS ON ALL ADMIN ROUTES
     Every admin endpoint must go through a Permission Guard
     that checks role + required permission. No exceptions.

  4. NOTIFICATION POLLING
     10 second interval. Active only when admin is logged in.
     Must stop on logout.

  5. CASL INTEGRATION
     CASL handles all permission checking logic inside Guards.
     Reduces boilerplate and keeps permission logic centralized.

---------------------------------------------------------------------
13. NEXT STEPS (in order)
---------------------------------------------------------------------

  Step 1  →  Seed default roles & permissions (DB)        ✅ Designed
  Step 2  →  Full database schema review & validation      ✅ Designed
  Step 3  →  Project folder structure (frontend + backend)
  Step 4  →  UI/UX wireframes (key pages)
  Step 5  →  Backend development
  Step 6  →  Frontend development
  Step 7  →  Integration & testing
  Step 8  →  Deployment

=====================================================================
  immo_lamis — Specification CLOSED ✅ — Ready for Development
  Version 5.0
=====================================================================
─────────────────────────────────────────────