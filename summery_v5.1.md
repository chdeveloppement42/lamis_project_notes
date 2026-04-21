=====================================================================
  immo_lamis — DETAILED PROJECT SUMMARY
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
(Prisma Schema remains identical to Version 5.0)

---------------------------------------------------------------------
5. ENTITY RELATIONSHIPS
---------------------------------------------------------------------
(Entity Relationships remain identical to Version 5.0)

---------------------------------------------------------------------
6. PAGES & INTERFACES
---------------------------------------------------------------------

PUBLIC PAGES (accessible by all visitors)

  6.1 Landing Page
  6.2 Services Page (Listings Grid)
  6.3 Listing Detail Page
  6.4 About Page
  6.5 Contact Page

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
(Media Pipeline remains identical to Version 5.0)

---------------------------------------------------------------------
8. AUTHENTICATION & SECURITY
---------------------------------------------------------------------
(Authentication & Security remain identical to Version 5.0)

---------------------------------------------------------------------
9. TECH STACK
---------------------------------------------------------------------
(Tech Stack remains identical to Version 5.0)

---------------------------------------------------------------------
10. OUT OF SCOPE
---------------------------------------------------------------------
(Out of Scope remains identical to Version 5.0)

---------------------------------------------------------------------
11. OPEN POINTS
---------------------------------------------------------------------
(Open Points remain identical to Version 5.0)

---------------------------------------------------------------------
12. CRITICAL DEVELOPMENT NOTES
---------------------------------------------------------------------

  1. PERMISSION SCHEMA FIRST
  2. STORAGE ABSTRACTION FROM DAY ONE
  3. NESTJS GUARDS ON ALL ADMIN ROUTES
  4. NOTIFICATION POLLING
  5. CASL INTEGRATION
  
  6. RE-VALIDATION ON SENSITIVE PROFILE UPDATES
     If a provider updates their email address or their business
     document via the Profile Settings page, the backend MUST instantly
     revert their AccountStatus to PENDING. Their existing listings
     can remain live, but they lose the ability to post new listings
     until an admin re-validates their profile.

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
  Version 5.1
=====================================================================