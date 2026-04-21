=====================================================================
  immo_lamis — PROJECT SUMMARY (FINAL)
=====================================================================

PROJECT NAME        : immo_lamis
TYPE                : Secure Real Estate Listing Web Platform
SPECIFICATION       : CLOSED ✅
VERSION             : 5.1

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
  - Manage personal profile, update contact details, and change password
  - Triggers re-validation (PENDING state) if email or document is updated

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

  6.9 Profile Settings Page (auth required)
      - Update personal info (Name, Phone, Address)
      - Change password securely
      - Update Email or Document (shows warning that this will
        trigger account suspension pending re-validation)

ADMIN PANEL

  6.10 Dashboard           → all roles
  6.11 Notifications       → configurable per role
  6.12 Provider Management → configurable per role
  6.13 User Management     → configurable per role
  6.14 Category Management → configurable per role
  6.15 Listing Moderation  → configurable per role
  6.16 Permission Manager  → Super Admin only

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

  6. RE-VALIDATION ON SENSITIVE PROFILE UPDATES
     If a provider updates their email address or their business
     document via the Profile Settings page, the backend MUST instantly
     revert their AccountStatus to PENDING. Their existing listings
     can remain live, but they lose the ability to post new listings
     until an admin re-validates their profile.

---------------------------------------------------------------------
13. DEVELOPMENT TIMELINE (6-Week Sprint)
---------------------------------------------------------------------

  Week    Focus                                       Duration
  ──────────────────────────────────────────────────────────────
  1       Foundation & Security (RBAC/Auth)            7 Days
  2       Media Pipeline & Core Provider Features      7 Days
  3       Admin Moderation Panel & Dashboard           7 Days
  4       Visitor UX & Search Engine                   7 Days
  5       Bug Squashing & UI Refinement                7 Days
  6       Deployment & Final Testing                   7 Days

  CRITICAL PATH:
  - Permission Seed: Don't start UI until RolePermission table is populated
  - Watermark Performance: If Sharp slows the API, move to background job early
  - Re-validation Loop: Test email/doc change → PENDING logic thoroughly

---------------------------------------------------------------------
14. NEXT STEPS (in order)
---------------------------------------------------------------------

  Step 1  →  Seed default roles & permissions (DB)        ✅ Designed
  Step 2  →  Full database schema review & validation      ✅ Designed
  Step 3  →  Project folder structure (frontend + backend) ⏳
  Step 4  →  UI/UX wireframes (key pages)                  ⏳
  Step 5  →  Backend development                           ⏳
  Step 6  →  Frontend development                          ⏳
  Step 7  →  Integration & testing                         ⏳
  Step 8  →  Deployment                                    ⏳

=====================================================================
  immo_lamis — Specification CLOSED ✅ — Ready for Development
  Version 5.1
=====================================================================
