=====================================================================
  immo_lamis — DETAILED PROJECT SUMMARY
=====================================================================

PROJECT NAME        : immo_lamis
TYPE                : Secure Real Estate Listing Web Platform
SPECIFICATION       : CLOSED ✅
VERSION             : 4.0

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
  - View dashboard & stats
  - Validate / reject / suspend providers
  - Manage listings (publish / unpublish / delete)
  - Manage categories (add / edit / delete)
  - Manage users (view / reset passwords)
  - Create and manage manager accounts
  - View and manage notifications
  - Access permission management page (Super Admin only)

---------------------------------------------------------------------
4. PAGES & INTERFACES
---------------------------------------------------------------------

PUBLIC PAGES (accessible by all visitors)

  4.1 Landing Page
      - Hero section: catchy title, subtitle, quick search bar
        (Location, Property type, Budget)
      - Category section: visual clickable blocks
        (Apartment, Villa, Office, etc.)
      - Latest listings: grid of last 6 validated properties
      - CTA button: "Devenir fournisseur"

  4.2 Services Page (Listings Grid)
      - Sidebar filters:
          → Category
          → Price range
          → Number of rooms
          → City
      - Listing cards showing:
          → Main photo (watermarked)
          → Price (bold)
          → Category badge
          → Location + short title
      - Pagination for navigation

  4.3 Listing Detail Page
      - Full photo gallery (watermarked images)
      - Full title, detailed description
      - Price, city, district
      - Provider info (name, phone)
      - Contact / back to listings button

  4.4 About Page
      - Platform mission statement
      - Core values: transparency, security, professionalism
      - Key statistics: total listings, active providers

  4.5 Contact Page
      - Contact form: Name, Email, Subject, Message
      - Platform coordinates: address, phone, professional email
      - Interactive Google Maps embed

PROVIDER PAGES (auth required)

  4.6 Register Page
      - Fields: First name, Last name, Email, Phone,
                Address, Password
      - Mandatory document upload (business proof)
      - Submit → redirected to pending state page

  4.7 Login Page
      - Fields: Email, Password
      - Dynamic states:
          → Pending  : orange banner displayed
          → Validated: redirect to post listing space
          → Rejected : rejection message displayed
      - Links: "Forgot password?" (handled by admin)
               "No account yet? Register"

  4.8 Post a Listing Page (validated providers only)
      - Category selector (loaded from database)
      - Fields: Title, Detailed description,
                Price (DA), City, District
      - Photo upload zone (multiple images)
      - Action buttons: Save as Draft / Publish Now

ADMIN PANEL (permission-based access)

  4.9 Dashboard
      - Total listings count
      - Pending provider requests count
      - Active providers count
      - Recent activity overview
      - Access: all admin roles

  4.10 Notifications Page
      - Full history of platform alerts:
          → New provider registration requests
          → New listing published
          → Suspended account activity
      - Mark notifications as read / unread
      - Badge/counter on sidebar for unread notifications
      - Delivery mechanism: polling (every 10 seconds)
      - Access: configurable per role

  4.11 Provider Management
      - List all registered providers with status
      - Actions: Validate / Reject / Suspend
      - Access: configurable per role

  4.12 User Management
      - List all users (providers + admin accounts)
      - Reset any user password manually
      - Create new manager/admin accounts
      - Edit or deactivate existing accounts
      - Access: configurable per role

  4.13 Category Management
      - Add new property categories
      - Edit existing categories
      - Delete categories
      - Access: configurable per role

  4.14 Listing Moderation
      - View all listings (published + drafts)
      - Actions: Publish / Unpublish / Delete
      - Access: configurable per role

  4.15 Permission Management Page
      - List all roles with their permission sets
      - Toggle permissions per role
      - Create new custom roles
      - Delete roles (triggers suspension of affected users)
      - Access: Super Admin ONLY

---------------------------------------------------------------------
5. MEDIA PIPELINE
---------------------------------------------------------------------

FLOW:
  Provider selects photos on listing form
            ↓
  [FRONTEND] browser-image-compression
    - Convert to WebP format
    - Compress to max 800KB
    - Resize to max 1920px wide
            ↓
  Compressed WebP uploaded to backend via Multer
            ↓
  [BACKEND] Sharp library
    - Apply immo_lamis watermark (logo or text)
    - Watermark position: corner or diagonal
            ↓
  Watermarked WebP saved via Storage Service Module
            ↓
  Served to visitors on listing pages

RULES:
  - Output format     : WebP only
  - Max file size     : 800KB per image
  - Max dimensions    : 1920px wide
  - Original image    : NEVER stored (only watermarked version)
  - Current storage   : Local server
  - Future storage    : Cloudinary or AWS S3 (not decided yet)
  - Storage layer     : Abstracted via a StorageService module
                        so migration to cloud only requires
                        changing that single module

---------------------------------------------------------------------
6. AUTHENTICATION & SECURITY
---------------------------------------------------------------------

  - Password hashing    : BCrypt
  - Authentication      : JWT (JSON Web Token)
  - Route protection    : NestJS Guards validate JWT + permissions
  - Roles               : visitor / provider / manager / super_admin
  - Provider access     : JWT valid + account status = "validated"
  - Admin access        : JWT valid + role checked against permissions
  - Password reset      : Admin handles manually via User Management
                          No email reset flow implemented
  - Multi-admin         : Multiple admin/manager accounts supported
  - Permission check    : Every admin route checks role permissions
                          before granting access
  - Privilege rule      : Cannot assign more permissions than own level

---------------------------------------------------------------------
7. TECH STACK
---------------------------------------------------------------------

  Layer               Technology            Reason
  -------             ------------------    ------------------------
  Frontend            React.js              Ecosystem, protected
                      + React Router        routes, role-based UI
  Backend             NestJS                Built-in Guards for
                                            role/permission system,
                                            clean structure, scales
                                            well with complexity
  Database            PostgreSQL            Relational model fits
                                            roles, permissions,
                                            listings perfectly
  ORM                 Prisma                Type safety, clean
                                            migrations, works
                                            seamlessly with NestJS
  Authentication      JWT + BCrypt          Industry standard,
                                            stateless auth
  File Upload         Multer                Simple, works well
                                            with NestJS
  Image Processing    Sharp                 Fast watermarking
                      (backend)             on the server
  Image Compression   browser-image-        Reduces upload size
                      compression           before hitting server
                      (frontend)
  Image Format        WebP                  25-35% smaller than
                                            JPEG, modern standard
  Maps Integration    Google Maps API       Contact page embed
  Notifications       Polling               10s interval, simple,
                      (frontend)            sufficient for admin
                                            use case
  Image Storage       Local (abstracted     StorageService module
                      via StorageService)   makes future migration
                                            to cloud seamless

---------------------------------------------------------------------
8. ARCHITECTURE DECISIONS
---------------------------------------------------------------------

  Decision                          Choice              Reason
  ------------------------------    ----------------    ------------
  Frontend framework                React.js            Ecosystem,
                                                        auth patterns
  Backend framework                 NestJS              Built-in Guards,
                                                        clean structure,
                                                        scales with
                                                        permission system
  Database                          PostgreSQL          Relational model
                                                        fits all entities
  ORM                               Prisma              Type safety,
                                                        easy migrations
  Image format                      WebP                Smaller size,
                                                        modern standard
  Compression timing                Frontend            Save bandwidth,
                                                        reduce server load
  Watermark timing                  Backend             Control & security
  Password reset flow               Admin-managed       No email system
  Admin accounts                    Multi-account       Scalability
  Permission system                 Role-based          Flexible & clean
  Roles                             Preset + custom     Balance of
                                                        simplicity/control
  Role deletion behavior            Auto-suspend users  Safety first
  Privilege escalation              Blocked             Security rule
  Super Admin                       Single account      Platform integrity
  Notifications delivery            Polling (10s)       Sufficient for
                                                        admin use case,
                                                        avoids WebSocket
                                                        complexity
  Email notifications               ❌ Removed          Not needed
  Image storage (current)           Local               Simplicity
  Storage abstraction               StorageService      Future-proof
                                    module              cloud migration

---------------------------------------------------------------------
9. OUT OF SCOPE
---------------------------------------------------------------------

  - Mobile application (iOS / Android)
  - Email notifications (registration, validation, etc.)
  - Payment or booking system
  - Chat or messaging between visitor and provider
  - Email-based password reset flow
  - Real-time WebSocket notifications (polling used instead)

---------------------------------------------------------------------
10. OPEN POINTS
---------------------------------------------------------------------

  #   Topic                               Status
  --  ----------------------------------  --------------------------
  1   Admin panel UI full detail          ⏳ To be designed
  2   Image storage migration             ⏳ Future decision
                                          (local now, cloud later)
  3   Permission schema design            ⚠️ Must be done before
                                          any backend code is written

---------------------------------------------------------------------
11. CRITICAL NOTES FOR DEVELOPMENT
---------------------------------------------------------------------

  1. PERMISSION SCHEMA FIRST
     The role-based permission system is the most complex part
     of this project. The database schema for roles and permissions
     must be fully designed before writing any backend code.
     Getting this wrong early will be very costly to fix later.

  2. STORAGE ABSTRACTION FROM DAY ONE
     Never write direct file system calls scattered across the
     codebase. All image save/delete/retrieve operations must go
     through a single StorageService module. This is the only way
     to migrate to Cloudinary or S3 later without touching every
     file in the project.

  3. NESTJS GUARDS FOR ALL ADMIN ROUTES
     Every admin route must go through a Permission Guard that
     checks the user's role and verifies the required permission
     is enabled for that role. This must be consistent across
     all endpoints — no exceptions.

  4. POLLING INTERVAL
     Notification polling set at 10 seconds. Only active when
     an admin user is logged in. Must stop polling on logout.

---------------------------------------------------------------------
12. NEXT STEPS (in order)
---------------------------------------------------------------------

  Step 1  →  Permission & roles database schema design
  Step 2  →  Full database schema (all Prisma models + ERD)
  Step 3  →  Project folder structure (frontend + backend)
  Step 4  →  UI/UX wireframes (key pages)
  Step 5  →  Backend development (API + auth + media pipeline)
  Step 6  →  Frontend development (pages + protected routes)
  Step 7  →  Integration & testing
  Step 8  →  Deployment

=====================================================================
  immo_lamis — Specification CLOSED ✅ — Ready for Development
  Version 4.0
=====================================================================