=====================================================================
  immo_lamis — DETAILED PROJECT SUMMARY
=====================================================================

PROJECT NAME        : immo_lamis
TYPE                : Secure Real Estate Listing Web Platform
SPECIFICATION       : CLOSED ✅
VERSION             : 3.0

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
  - Manages roles and permissions (only Super Admin can do this)
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
  Watermarked WebP saved to local storage
            ↓
  Served to visitors on listing pages

RULES:
  - Output format     : WebP only
  - Max file size     : 800KB per image
  - Max dimensions    : 1920px wide
  - Original image    : NEVER stored (only watermarked version)
  - Current storage   : Local server
  - Future storage    : Cloudinary or AWS S3 (not decided yet)

---------------------------------------------------------------------
6. AUTHENTICATION & SECURITY
---------------------------------------------------------------------

  - Password hashing    : BCrypt
  - Authentication      : JWT (JSON Web Token)
  - Route protection    : Middleware validates JWT + checks role
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

  Layer               Technology
  -------             ----------------------------------
  Frontend            React.js + React Router
  Backend             Node.js + Express
  Database            PostgreSQL
  ORM                 Prisma
  Authentication      JWT + BCrypt
  File Upload         Multer
  Image Processing    Sharp (watermark — backend)
  Image Compression   browser-image-compression (frontend)
  Image Format        WebP
  Maps Integration    Google Maps API
  Image Storage       Local filesystem (evolvable to cloud)
  Notifications       Polling or WebSocket (decided during dev)

---------------------------------------------------------------------
8. OUT OF SCOPE
---------------------------------------------------------------------

  - Mobile application (iOS / Android)
  - Email notifications (registration, validation, etc.)
  - Payment or booking system
  - Chat or messaging between visitor and provider
  - Email-based password reset flow

---------------------------------------------------------------------
9. OPEN POINTS
---------------------------------------------------------------------

  #   Topic                               Status
  --  ----------------------------------  --------------------------
  1   Admin panel UI full detail          ⏳ To be designed
  2   Image storage migration             ⏳ Future decision
                                          (local now, cloud later)
  3   Notification delivery mechanism     ⏳ To decide during dev
      (polling vs websocket)

---------------------------------------------------------------------
10. KEY DECISIONS LOG
---------------------------------------------------------------------

  Decision                          Choice              Reason
  ------------------------------    ----------------    ------------
  Frontend framework                React.js            Ecosystem,
                                                        auth patterns
  Backend framework                 Node.js + Express   JWT simplicity,
                                                        lean API
  Database                          PostgreSQL          Relational model
                                                        fits roles
  ORM                               Prisma              Type safety,
                                                        migrations
  Image format                      WebP                25-35% smaller
                                                        than JPEG
  Compression timing                Frontend            Save bandwidth
  Watermark timing                  Backend             Control & security
  Password reset flow               Admin-managed       No email system
  Admin accounts                    Multi-account       Scalability
  Permission system                 Role-based          Flexible & clean
  Roles                             Preset + custom     Balance of
                                                        simplicity/control
  Role deletion behavior            Auto-suspend users  Safety first
  Privilege escalation              Blocked             Security rule
  Super Admin                       Single account      Platform integrity
  Notifications                     In-app only         No email system
  Email notifications               ❌ Removed          Not needed
  Image storage (current)           Local               Simplicity

---------------------------------------------------------------------
11. NEXT STEPS (in order)
---------------------------------------------------------------------

  Step 1  →  Database schema (Prisma models + ERD)
  Step 2  →  Project folder structure (frontend + backend)
  Step 3  →  UI/UX wireframes (key pages)
  Step 4  →  Backend development (API + auth + media pipeline)
  Step 5  →  Frontend development (pages + protected routes)
  Step 6  →  Integration & testing
  Step 7  →  Deployment

=====================================================================
  immo_lamis — Specification CLOSED ✅ — Ready for Development
  Version 3.0
=====================================================================