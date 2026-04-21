# CAHIER DES CHARGES
## Plateforme Web Immobilière — immo_lamis

---

| | |
|---|---|
| **Projet** | immo_lamis |
| **Date** | 21 Avril 2026 |
| **Statut** | Validé — Prêt pour signature |
| **Prestataire** | CH Développement |
| **Client** | ______________________________ |

---

## 1. Objet du document

Le présent document définit les fonctionnalités et le périmètre du projet **immo_lamis**, une plateforme web de publication d'annonces immobilières.

Ce document constitue l'accord entre le **client** et le **prestataire**. **Toute fonctionnalité non mentionnée ici est considérée hors périmètre** et nécessitera un avenant séparé.

---

## 2. Présentation du projet

**immo_lamis** est une plateforme web qui permet à des agences et agents immobiliers de publier des annonces de biens à destination du grand public.

**Principe fondamental :**
> Aucun fournisseur ne peut publier d'annonce sans avoir été validé manuellement par un administrateur.

**Objectifs :**
- Un espace de publication d'annonces immobilières contrôlé et de qualité
- Une recherche intuitive pour les visiteurs
- Une interface d'administration complète
- Un haut niveau de sécurité

---

## 3. Les utilisateurs de la plateforme

| Utilisateur | Description |
|---|---|
| **Visiteur** | Toute personne naviguant sur le site sans créer de compte |
| **Fournisseur** | Agence ou agent immobilier ayant créé un compte et ayant été validé par l'administration |
| **Super Admin** | Le propriétaire de la plateforme — compte unique avec accès total |
| **Manager / Modérateur** | Personnel interne avec des droits configurables |

---

## 4. Ce que peut faire chaque utilisateur

### 4.1 Le Visiteur

- Parcourir toutes les annonces publiées
- Filtrer les annonces par catégorie, prix, nombre de pièces et ville
- Consulter le détail complet d'une annonce (photos, description, prix, localisation)
- Contacter l'administration via un formulaire

### 4.2 Le Fournisseur

- Créer un compte avec un document justificatif obligatoire
- Se connecter et voir le statut de son compte :
  - 🟠 **En attente** : bannière "Compte en attente de validation"
  - 🟢 **Validé** : accès à la publication d'annonces
  - 🔴 **Rejeté** : message de rejet affiché
- Publier des annonces avec photos, description et prix
- Sauvegarder des annonces en brouillon
- Modifier ses informations personnelles et son mot de passe
- ⚠️ La modification de l'email ou du document justificatif suspend temporairement le compte jusqu'à re-validation

### 4.3 Le Super Administrateur

- Accès total et sans restriction à toute la plateforme
- Seul à pouvoir gérer les rôles et les permissions
- Création et gestion de tous les comptes du personnel
- Compte unique, impossible à supprimer ou restreindre

### 4.4 Les Managers / Modérateurs

- Droits d'accès configurables selon le rôle attribué
- Ne peuvent pas dépasser le niveau de permissions de leur créateur
- Les changements de rôle s'appliquent immédiatement

---

## 5. Les pages de la plateforme

### Pages publiques (accessibles à tous)

| Page | Contenu |
|---|---|
| **Page d'accueil** | Recherche rapide, catégories visuelles, dernières annonces, bouton "Devenir fournisseur" |
| **Liste des annonces** | Grille d'annonces avec filtres (catégorie, prix, pièces, ville) et pagination |
| **Détail d'une annonce** | Galerie photo, description complète, prix, localisation, infos du fournisseur |
| **À propos** | Présentation de la plateforme, valeurs, statistiques |
| **Contact** | Formulaire de contact, coordonnées, carte Google Maps |

### Pages fournisseur (compte requis)

| Page | Contenu |
|---|---|
| **Inscription** | Formulaire + document justificatif obligatoire |
| **Connexion** | Affichage adapté selon le statut du compte |
| **Publier une annonce** | Formulaire de création avec upload de photos |
| **Mon profil** | Modification des infos, mot de passe, email et document |

### Panel d'administration

| Page | Qui y a accès |
|---|---|
| **Tableau de bord** | Tous les administrateurs |
| **Notifications** | Selon les permissions du rôle |
| **Gestion des fournisseurs** | Selon les permissions — Valider / Rejeter / Suspendre |
| **Gestion des utilisateurs** | Selon les permissions — Créer des comptes, réinitialiser les mots de passe |
| **Gestion des catégories** | Selon les permissions — Ajouter / Modifier / Supprimer |
| **Modération des annonces** | Selon les permissions — Publier / Dépublier / Supprimer |
| **Gestion des permissions** | Super Admin uniquement |

---

## 6. Gestion des rôles et permissions

- La plateforme est livrée avec 3 rôles par défaut : **Super Admin**, **Manager**, **Modérateur**
- Le Super Admin peut créer des rôles supplémentaires personnalisés
- Chaque rôle dispose d'un ensemble de permissions activables/désactivables
- La suppression d'un rôle entraîne la **suspension automatique** de tous les comptes associés

### Permissions disponibles

| Permission | Ce qu'elle permet |
|---|---|
| Tableau de bord | Voir les statistiques de la plateforme |
| Gestion fournisseurs | Valider, rejeter ou suspendre des fournisseurs |
| Gestion annonces | Publier, dépublier ou supprimer des annonces |
| Gestion catégories | Ajouter, modifier ou supprimer des catégories |
| Gestion utilisateurs | Consulter les comptes et réinitialiser les mots de passe |
| Gestion administrateurs | Créer, modifier ou désactiver des comptes admin |
| Notifications | Consulter les alertes de la plateforme |
| Gestion permissions | Gérer les rôles (**Super Admin uniquement**) |

---

## 7. Gestion des photos

- Les photos uploadées par les fournisseurs sont automatiquement **compressées** et **converties** dans un format optimisé pour le web
- Un **filigrane** (watermark) "immo_lamis" est appliqué automatiquement sur chaque image
- L'image originale n'est jamais conservée — seule la version protégée est stockée

---

## 8. Sécurité

- Les mots de passe sont chiffrés et jamais stockés en clair
- L'accès aux pages protégées est vérifié à chaque requête
- La réinitialisation de mot de passe est gérée manuellement par l'administration
- Chaque page d'administration vérifie les permissions de l'utilisateur
- Le Super Admin est le seul à ne pouvoir être ni supprimé ni restreint

---

## 9. Ce qui n'est PAS inclus dans ce projet

Les fonctionnalités suivantes sont **explicitement exclues**. Leur ajout futur nécessitera un avenant.

| # | Fonctionnalité exclue |
|---|---|
| 1 | Application mobile (iOS / Android) |
| 2 | Notifications par email |
| 3 | Système de paiement ou réservation en ligne |
| 4 | Messagerie / chat entre visiteur et fournisseur |
| 5 | Réinitialisation de mot de passe par email |

---

## 10. Planning prévisionnel

| Semaine | Objectif |
|---|---|
| **1** | Mise en place de la base, sécurité et système de connexion |
| **2** | Inscription des fournisseurs et gestion des photos |
| **3** | Panel d'administration complet |
| **4** | Pages visiteur, recherche et filtres |
| **5** | Tests, corrections et finitions |
| **6** | Mise en ligne |

**Durée totale estimée : 6 semaines**

> Ce planning est indicatif et peut être ajusté en accord avec les deux parties.

---

## 11. Livrables

Le prestataire s'engage à livrer :
- ✅ La plateforme web complète et fonctionnelle
- ✅ Le compte Super Admin initial configuré
- ✅ Le code source complet du projet
- ✅ La documentation de mise en ligne

---

## 12. Obligations du client

Le client s'engage à :
- Fournir les textes des pages (À propos, Contact, etc.)
- Fournir le logo et les éléments visuels pour le filigrane
- Être disponible pour les phases de validation
- Donner un retour dans un délai raisonnable

---

## 13. Garantie

Le prestataire assure une période de garantie de **______ jours** après la livraison pour la correction de tout dysfonctionnement lié aux fonctionnalités décrites dans ce document.

---

## 14. Modifications

Toute demande d'ajout ou de modification non prévue dans ce document fera l'objet d'un **avenant signé par les deux parties**, avec une estimation de coût et de délai supplémentaires.

---

## 15. Validation et signatures

La signature de ce document vaut acceptation de l'ensemble des spécifications et conditions décrites.

---

### Pour le Prestataire

| | |
|---|---|
| **Nom et prénom** | ______________________________ |
| **Fonction** | ______________________________ |
| **Date** | ______________________________ |
| **Signature** | |
| | |
| | |
| | ______________________________ |

---

### Pour le Client

| | |
|---|---|
| **Nom et prénom** | ______________________________ |
| **Fonction** | ______________________________ |
| **Date** | ______________________________ |
| **Signature** | |
| | |
| | |
| | ______________________________ |

---

> **Mention obligatoire :** *"Lu et approuvé"*

---

*Document établi le 21 Avril 2026 — Projet immo_lamis*
*CH Développement — Tous droits réservés*
