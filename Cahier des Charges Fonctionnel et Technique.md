# Cahier des Charges Fonctionnel et Technique

## 1. Page de garde
**Nom du projet :** immo_lamis (Secure Real Estate Listing Web Platform)  
**Version :** 5.1  
**Date :** 21 Avril 2026  
**Statut :** CLOSED ✅ (Spécifications validées, prêt pour le développement)  

---

## 2. Présentation du projet
**Contexte & Concept principal :** `immo_lamis` est une plateforme web sécurisée de mise en relation entre des fournisseurs immobiliers (agences ou agents) et des chercheurs de biens. Le principal élément différenciateur de la plateforme est son système de validation obligatoire par l'administration. 

**Objectif :** Créer un environnement de confiance et hautement qualitatif pour les visiteurs. Aucun fournisseur ne peut publier d'annonce sans avoir été préalablement approuvé manuellement par un administrateur.

---

## 3. Acteurs du système
* **Visiteur :** Utilisateur non authentifié naviguant sur la plateforme pour rechercher des biens immobiliers.
* **Fournisseur (Provider) :** Agence ou agent immobilier disposant d'un compte. Doit obligatoirement être validé par un administrateur avant de pouvoir interagir pleinement avec le système.
* **Super Admin :** Propriétaire de la plateforme. Il s'agit d'un compte unique, non supprimable et non restreignable, disposant de tous les droits absolus sur le système.
* **Managers / Modérateurs :** Membres du personnel interne disposant de comptes multiples. Leurs droits d'accès sont strictement définis par le rôle qui leur est assigné.

---

## 4. Analyse fonctionnelle

* **Fonctionnalités du Visiteur :**
    * Parcourir toutes les annonces publiées et validées.
    * Filtrer les annonces par catégorie, tranche de prix, nombre de pièces et ville.
    * Consulter la page détaillée d'une annonce complète.
    * Contacter l'administration de la plateforme via un formulaire de contact.
* **Fonctionnalités du Fournisseur :**
    * S'inscrire en fournissant des informations personnelles et en téléchargeant un document justificatif obligatoire.
    * Se connecter avec une gestion dynamique de l'état du compte :
        * *En attente (Pending) :* Affichage d'une bannière orange "Compte en attente de validation".
        * *Validé (Validated) :* Redirection automatique vers l'espace de publication.
        * *Rejeté (Rejected) :* Affichage du message de rejet.
    * Publier des annonces (uniquement après validation).
    * Sauvegarder des annonces en brouillon (Draft) ou les publier immédiatement.
    * Télécharger plusieurs photos par annonce.
    * **Gestion du profil (Profile Management) :**
        * Consulter et modifier ses informations personnelles (Nom, Prénom, Téléphone, Adresse).
        * Changer son mot de passe de manière autonome et sécurisée.
        * *Règle de sécurité :* La modification du document justificatif (`documentUrl`) ou de l'adresse email entraîne automatiquement le repassage du compte au statut `PENDING` (En attente), nécessitant une nouvelle validation par un administrateur.
* **Fonctionnalités du Super Admin :**
    * Accès total et sans restriction à toutes les fonctionnalités et données.
    * Accès exclusif à la page de gestion des permissions (Permission Management).
    * Création et gestion de tous les comptes administrateurs/managers.
    * Attribution des permissions jusqu'à son propre niveau.
* **Fonctionnalités des Managers / Modérateurs :**
    * Accès limité en fonction du rôle (RBAC).
    * Modification des rôles (appliquée immédiatement à tous les utilisateurs concernés).
    * Règle stricte : Un manager ne peut pas dépasser le niveau de permission du créateur de son compte.

---

## 5. Interfaces & Pages

### Pages Publiques (Accessibles à tous)
* **6.1 Landing Page :** Section Hero, catégories, dernières annonces, CTA.
* **6.2 Services Page (Grille d'annonces) :** Filtres latéraux, cartes d'annonces, pagination.
* **6.3 Listing Detail Page (Détail de l'annonce) :** Galerie photo avec watermark, description, prix, informations fournisseur.
* **6.4 About Page (À propos) :** Mission, valeurs, statistiques.
* **6.5 Contact Page :** Formulaire, coordonnées, Google Maps.

### Pages Fournisseur (Authentification requise)
* **6.6 Register Page :** Champs de base + upload du document obligatoire.
* **6.7 Login Page :** États dynamiques (pending / validated / rejected).
* **6.8 Post a Listing Page (Uniquement validé) :** Formulaire de création d'annonce, upload d'images, bascule Draft/Publish.
* **6.9 Profile Settings Page (Paramètres du profil) :**
    * Formulaire pré-rempli avec les données actuelles du fournisseur.
    * Section "Informations personnelles" (Nom, Prénom, Téléphone, Adresse).
    * Section "Sécurité" pour le changement de mot de passe.
    * Section "Document d'entreprise" avec avertissement visuel : *"Attention : La mise à jour de votre document ou de votre email suspendra temporairement vos droits de publication jusqu'à re-validation par un administrateur."*

### Panel d'Administration (Accès basé sur les permissions)
* **6.10 Dashboard :** Accessible à tous les rôles administratifs.
* **6.11 Notifications :** Accès configurable par rôle.
* **6.12 Provider Management :** Accès configurable par rôle.
* **6.13 User Management :** Accès configurable par rôle.
* **6.14 Category Management :** Accès configurable par rôle.
* **6.15 Listing Moderation :** Accès configurable par rôle.
* **6.16 Permission Manager :** Strictement réservé au Super Admin.

---

## 6. Système de rôles et permissions

**Modèle utilisé :** Full RBAC (Role-Based Access Control) intégré via la librairie CASL et les NestJS Guards. Les rôles et permissions sont stockés en base de données et configurables depuis l'interface utilisateur.

**Rôles par défaut :**
* **Super Admin :** Accès total, non modifiable.
* **Manager :** Accès étendu, modifiable.
* **Moderator :** Accès limité, modifiable.

**Gestion et règles métier :**
* Le Super Admin peut créer des rôles personnalisés.
* **Suspension automatique :** Lors de la suppression d'un rôle, tous les utilisateurs possédant ce rôle sont automatiquement suspendus (SUSPENDED).
* **Règle d'escalade :** Un manager ne peut attribuer des permissions que jusqu'à son propre niveau d'accès.
* Les modifications de permissions s'appliquent en temps réel.

**Permissions configurables :**
* `view:dashboard`, `manage:providers`, `manage:listings`, `manage:categories`, `manage:users`, `manage:admins`, `view:notifications`, `manage:permissions` (Super Admin uniquement).

---

## 7. Pipeline Media

**Flux de traitement des images :**
1.  **[Frontend]** Traitement via `browser-image-compression` : format WebP, max 800KB, max 1920px.
2.  Upload vers le backend réceptionné par `Multer`.
3.  **[Backend]** Traitement via `Sharp` pour appliquer le watermark `immo_lamis`.
4.  Sauvegarde locale du fichier via le module `StorageService`.

**Règles strictes :**
* L'image originale n'est JAMAIS stockée.
* Le stockage doit être obligatoirement abstrait via le module `StorageService`.

---

## 8. Sécurité & Authentification

* **Hachage des mots de passe :** BCrypt.
* **Mécanisme d'authentification :** JWT (JSON Web Token).
* **Protection des routes :** Utilisation de NestJS Guards couplés à CASL.
* **Gestion des mots de passe (Admin) :** Manuelle par l'administration (pas d'email).
* **Intégrité Super Admin :** Compte unique, sans restriction, impossible à supprimer.

---

## 9. Schema de base de données

```prisma
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