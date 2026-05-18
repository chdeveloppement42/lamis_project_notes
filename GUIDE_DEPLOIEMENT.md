# Guide de Déploiement — Immo Lamis

Ce guide explique comment installer et déployer votre plateforme immobilière Immo Lamis sur Vercel.

## 1. Prérequis

Avant de commencer, vous devez avoir :
- Un compte **Vercel** (gratuit ou Pro).
- Un compte **Neon.tech** (pour la base de données PostgreSQL).
- Un compte **Cloudinary** (pour le stockage des images).
- **Node.js 18+** installé sur votre machine (uniquement pour la configuration initiale).

---

## 2. Configuration de l'environnement

1. Copiez le fichier `.env.example` et renommez-le en `.env`.
2. Remplissez les variables suivantes dans le fichier `.env` :

| Variable | Description | Source |
| :--- | :--- | :--- |
| `DATABASE_URL` | Lien de connexion PostgreSQL | Console Neon.tech |
| `JWT_SECRET` | Une phrase aléatoire longue et sécurisée | Générez-la vous-même |
| `JWT_REFRESH_SECRET`| Une autre phrase aléatoire différente | Générez-la vous-même |
| `CLOUDINARY_CLOUD_NAME`| Nom de votre cloud | Tableau de bord Cloudinary |
| `CLOUDINARY_API_KEY` | Clé API | Tableau de bord Cloudinary |
| `CLOUDINARY_API_SECRET`| Secret API | Tableau de bord Cloudinary |

---

## 3. Installation et Initialisation

Ouvrez un terminal dans le dossier du projet et exécutez les commandes suivantes :

```bash
# 1. Installer les dépendances
npm install

# 2. Préparer la base de données (Création des tables)
npx prisma migrate deploy

# 3. Générer le client de base de données
npx prisma generate

# 4. Ajouter les données initiales (Rôles, Administrateur par défaut)
# Note : Cette étape crée le compte Super Admin initial.
npm run db:seed
```

---

## 4. Déploiement sur Vercel

### Option A : Via GitHub (Recommandé)
1. Créez un dépôt privé sur GitHub et poussez-y ce code.
2. Sur Vercel, cliquez sur **"Add New"** > **"Project"** et importez votre dépôt.
3. Dans **"Environment Variables"**, ajoutez TOUTES les variables présentes dans votre fichier `.env`.
4. Cliquez sur **"Deploy"**.

### Option B : Via Vercel CLI
1. Installez la CLI : `npm install -g vercel`
2. Connectez-vous : `vercel login`
3. Déployez : `vercel --prod` (répondez aux questions et ajoutez les variables d'environnement quand demandé).

---

## 5. Maintenance

- **Images** : Les images sont automatiquement optimisées (WebP) et marquées d'un filigrane (Watermark) avant d'être envoyées sur Cloudinary.
- **Sécurité** : Le code source est protégé par obfuscation. Toute tentative de modification directe du code dans `build/` ou `dist/` pourrait corrompre l'application.

---

> [!TIP]
> **Support** : En cas de problème de connexion à la base de données, vérifiez que l'adresse IP de Vercel est autorisée (ou que le mode "Allow all" est activé temporairement sur Neon) et que le paramètre `sslmode=require` est présent dans votre `DATABASE_URL`.
