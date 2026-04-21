=====================================================================
  immo_lamis — DETAILED PROJECT SUMMARY
=====================================================================

PROJECT NAME        : immo_lamis
TYPE                : Secure Real Estate Listing Web Platform
SPECIFICATION       : CLOSED ✅
VERSION             : 2.0

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
      → If rejected : shown rejection message
  - Post listings (only after validation)
  - Save listings as draft or publish immediately
  - Upload multiple photos per listing

ADMINISTRATOR (internal, multi-account)
  - Validate or reject provider registration requests
  - Suspend existing provider accounts
  - Manage all users (providers + admins)
  - Reset any user's password manually (no email flow)
  - Create and manage multiple admin accounts
  - Add / edit / delete property categories
  - Moderate listings (publish / unpublish / delete)
  - View platform-wide statistics on dashboard

---------------------------------------------------------------------
3. PAGES & INTERFACES
---------------------------------------------------------------------

PUBLIC PAGES (accessible by all visitors)

  3.1 Landing Page
      - Hero section: catchy title, subtitle, quick search bar
        (Location, Property type, Budget)
      - Category section: visual clickable blocks
        (Apartment, Villa, Office, etc.)
      - Latest listings: grid of last 6 validated properties
      - CTA button: "Devenir fournisseur"

  3.2 Services Page (Listings Grid)
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

  3.3 Listing Detail Page
      - Full photo gallery (watermarked images)
      - Full title, detailed description
      - Price, city, district
      - Provider info (name, phone)
      - Contact / back to listings button

  3.4 About Page
      - Platform mission statement
      - Core values: transparency, security, professionalism
      - Key statistics: total listings, active providers

  3.5 Contact Page
      - Contact form: Name, Email, Subject, Message
      - Platform coordinates: address, phone, professional email
      - Interactive Google Maps embed

PROVIDER PAGES (auth required)

  3.6 Register Page
      - Fields: First name, Last name, Email, Phone,
                Address, Password
      - Mandatory document upload (business proof)
      - Submit → redirected to pending state page

  3.7 Login Page
      - Fields: Email, Password
      - Dynamic states:
          → Pending  : orange banner displayed
          → Validated: redirect to post listing space
          → Rejected : rejection message displayed
      - Links: "Forgot password?" (handled by admin)
               "No account yet? Register"

  3.8 Post a Listing Page (validated providers only)
      - Category selector (loaded from database)
      - Fields: Title, Detailed description,
                Price (DA), City, District
      - Photo upload zone (multiple images)
      - Action buttons: Save as Draft / Publish Now

ADMIN PANEL (admin accounts only)

  3.9 Dashboard
      - Total listings count
      - Pending provider requests count
      - Active providers count
      - Recent activity overview

  3.10 Provider Management
      - List all registered providers with status
      - Actions: Validate / Reject / Suspend

  3.11 User Management
      - List all users (providers + admins)
      - Reset any user password manually
      - Create new admin accounts
      - Edit or deactivate existing admin accounts

  3.12 Category Management
      - Add new categories
      - Edit existing categories
      - Delete categories

  3.13 Listing Moderation
      - View all listings (published + drafts)
      - Actions: Publish / Unpublish / Delete

---------------------------------------------------------------------
4. MEDIA PIPELINE
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
5. AUTHENTICATION & SECURITY
---------------------------------------------------------------------

  - Password hashing  : BCrypt
  - Authentication    : JWT (JSON Web Token)
  - Route protection  : Middleware validates JWT + checks role
  - Roles             : visitor / provider / admin
  - Provider access   : JWT valid + account status = "validated"
  - Admin access      : JWT valid + role = "admin"
  - Password reset    : Admin handles manually via User Management
                        No email reset flow implemented
  - Multi-admin       : Multiple admin accounts fully supported,
                        managed from within the platform

---------------------------------------------------------------------
6. TECH STACK
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

---------------------------------------------------------------------
7. OUT OF SCOPE
---------------------------------------------------------------------

  - Mobile application (iOS / Android)
  - Email notifications (registration, validation, etc.)
  - Payment or booking system
  - Chat or messaging between visitor and provider
  - Email-based password reset flow

---------------------------------------------------------------------
8. OPEN POINTS
---------------------------------------------------------------------

  #   Topic                           Status
  --  ------------------------------  ----------------------------
  1   Admin panel UI full detail      ⏳ To be designed
  2   Image storage migration         ⏳ Future decision
                                      (local now, cloud later)

---------------------------------------------------------------------
9. KEY DECISIONS LOG
---------------------------------------------------------------------

  Decision                          Choice          Reason
  ------------------------------    ----------      ----------------
  Frontend framework                React.js        Ecosystem, auth
                                                    patterns, scale
  Backend framework                 Node+Express    JWT simplicity,
                                                    Multer, lean API
  Database                          PostgreSQL      Relational model
                                                    fits roles/status
  ORM                               Prisma          Type safety,
                                                    easy migrations
  Image format                      WebP            25-35% smaller
                                                    than JPEG
  Compression timing                Frontend        Save bandwidth,
                                                    reduce server load
  Watermark timing                  Backend         Control & security
  Password reset flow               Admin-managed   No email system
  Admin accounts                    Multi-account   Platform scalability
  Image storage (current)           Local           Simplicity for now
  Email notifications               ❌ Removed      Not needed

---------------------------------------------------------------------
10. NEXT STEPS (in order)
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
=====================================================================