# ProductHunt Lite

Clone moderne et complet de Product Hunt, développé avec React (frontend) et Node.js / Express / MongoDB (backend).

## Fonctionnalités

### 🌟 Utilisateurs & Communauté
- **Landing page interactive** avec produits, catégories et statistiques réelles chargées dynamiquement depuis MongoDB.
- **Recherche & Filtrage** de produits par mot-clé et par catégorie.
- **Tri des produits** : par popularité (votes) et par date de publication (plus récents).
- **Fiche détaillée** avec description complète, tags et redirection vers le site du produit.
- **Système de vote** sécurisé avec toggle (vote/dévote), protection contre l'auto-vote du créateur et index unique MongoDB.
- **Soumission & Gestion de produits** : création, modification et suppression de ses propres produits par l'utilisateur connecté.
- **Dashboard utilisateur** : récapitulatif de ses produits et statistiques personnelles.
- **Paramètres de compte complets** : modification du nom, changement d'email sécurisé avec notification d'alerte, changement de mot de passe avec règles de complexité et historique anti-réutilisation, suppression définitive du compte.

### 🔐 Authentification & Sécurité
- **Inscription avec vérification OTP par email** (Brevo / Nodemailer).
- **Connexion sécurisée par JWT** et mots de passe hashés avec bcrypt (facteur de coût 10).
- **Flux complet de récupération de mot de passe** par code OTP à 6 chiffres.
- **Rate limiting ciblé** (`express-rate-limit`) contre les attaques par force brute et le spam d'emails OTP.
- **En-têtes de sécurité HTTP** (`helmet`) et politique CORS dynamique par variable d'environnement.
- **Validation des variables d'environnement** au démarrage du serveur.

### 🛡️ Administration (Admin & Super Admin)
- **Tableau de bord d'administration complet** : statistiques globales, graphique d'activité sur 7 jours et répartition par catégorie.
- **Gestion des utilisateurs** : promotion/rétrogradation d'administrateurs, suppression d'utilisateurs.
- **Modération** des produits et des catégories.
- **Espace Super Admin** : création de nouveaux administrateurs, réinitialisation de mots de passe d'admins, et mise à jour de profil sécurisée par OTP.

## Stack technique

- **Frontend** : React 19, Vite, React Router 7, Vanilla CSS (Design system soigné & responsive)
- **Backend** : Node.js, Express 5, Mongoose 9, Helmet, Express-Rate-Limit
- **Base de données** : MongoDB Atlas
- **Emails transactionnels** : Brevo API (SMTP transactionnel)
- **Authentification** : JWT, bcrypt

## Installation

### Backend

```bash
cd backend
npm install
copy .env.example .env
```

Remplir `.env` avec ses identifiants MongoDB Atlas et ses clés Brevo, puis :

```bash
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Structure du projet

```
backend/
  src/
    config/       Connexion MongoDB
    models/       Schémas Mongoose (User, Product, Category, Vote)
    controllers/  Logique métier (Auth, Admin, Product, Category, Util)
    routes/       Définition des routes API
    middleware/   Protection JWT, vérification Admin et Rate Limiters
    utils/        Validation mot de passe, envoi d'emails Brevo
    seed/         Script de peuplement initial de la base
frontend/
  src/
    pages/        Pages (Landing, Products, Detail, Categories, Dashboard, Admin, Auth...)
    components/   Composants réutilisables & modales
    hooks/        Hooks d'authentification et de navigation
    services/     Appels API centralisés
    data/         Données statiques de référence (témoignages, FAQ, étapes)
```

## Routes API principales

| Méthode | Route | Protection | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Publique (Rate limit) | Inscription utilisateur |
| POST | `/api/auth/verify-otp` | Publique (Rate limit) | Validation du code OTP d'inscription |
| POST | `/api/auth/login` | Publique (Rate limit) | Connexion JWT |
| POST | `/api/auth/forgot-password` | Publique (Rate limit) | Demande de code de récupération |
| POST | `/api/auth/reset-password` | Publique (Rate limit) | Réinitialisation de mot de passe par OTP |
| PUT | `/api/auth/change-name` | Protégée | Modifier son nom de profil |
| PUT | `/api/auth/change-email` | Protégée | Modifier son adresse email |
| PUT | `/api/auth/change-password` | Protégée | Modifier son mot de passe |
| DELETE | `/api/auth/delete-account` | Protégée | Supprimer son compte |
| GET | `/api/products` | Publique | Liste des produits (tri par `votes` ou `recent`, recherche) |
| GET | `/api/products/:id` | Publique | Détail d'un produit |
| POST | `/api/products` | Protégée | Créer un produit |
| PUT | `/api/products/:id` | Protégée | Modifier son produit |
| DELETE | `/api/products/:id` | Protégée | Supprimer son produit |
| POST | `/api/products/:id/vote` | Protégée | Voter pour un produit (anti auto-vote) |
| DELETE | `/api/products/:id/vote` | Protégée | Retirer son vote |
| GET | `/api/categories` | Publique | Liste des catégories |
| GET | `/api/utils/stats` | Publique | Statistiques publiques de la plateforme |
| GET | `/api/admin/stats` | Admin | Statistiques avancées et graphiques |
| GET | `/api/admin/users` | Admin | Liste de tous les utilisateurs |