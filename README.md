# ProductHunt Lite

Clone simplifié de Product Hunt, développé avec React (frontend) et Node.js/Express/MongoDB (backend).

## Fonctionnalités

- Landing page avec produits et catégories chargés dynamiquement depuis MongoDB
- Recherche de produits (nom / tagline)
- Pages dédiées : catalogue complet, filtrage par catégorie
- Fiche détail produit
- Inscription et connexion avec authentification par token JWT
- Mots de passe hashés avec bcrypt (jamais stockés en clair)
- Routes backend protégées par middleware, routes frontend protégées par redirection
- Système de vote avec retrait possible (toggle), un vote unique par utilisateur/produit (index MongoDB)
- Soumission de produit par l'utilisateur connecté, avec création de catégorie à la volée
- Modification et suppression de ses propres produits
- Dashboard utilisateur (statistiques, liste de ses produits)
- Paramètres de compte (mot de passe, email, suppression — version démonstrative, sans persistance backend)
- Pop-up de connexion contextuel avant toute action nécessitant un compte
- Interface responsive (mobile / desktop)

## Stack technique

- **Frontend** : React (Vite), React Router
- **Backend** : Node.js, Express, Mongoose
- **Base de données** : MongoDB Atlas
- **Authentification** : JWT, bcrypt

## Installation

### Backend

\`\`\`bash
cd backend
npm install
copy .env.example .env
\`\`\`

Remplir `.env` avec ses propres identifiants MongoDB Atlas, puis :

\`\`\`bash
npm run seed
npm run dev
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Structure du projet

\`\`\`
backend/
  src/
    config/       connexion MongoDB
    models/       schémas Mongoose (User, Product, Category, Vote)
    controllers/  logique métier
    routes/       définition des routes API
    middleware/   protection JWT
    seed/         script de peuplement de la base
frontend/
  src/
    pages/        pages de l'application
    components/   composants réutilisables
    hooks/        hooks personnalisés (gate d'authentification)
    services/     centralisation des appels API
    data/         données statiques restantes (témoignages, stats)
\`\`\`

## Routes API principales

| Méthode | Route | Protection | Description |
|---|---|---|---|
| POST | /api/auth/register | Publique | Inscription |
| POST | /api/auth/login | Publique | Connexion |
| GET | /api/products | Publique | Liste des produits (filtrable par catégorie/recherche) |
| GET | /api/products/:id | Publique | Détail d'un produit |
| POST | /api/products | Protégée | Créer un produit |
| PUT | /api/products/:id | Protégée | Modifier son produit |
| DELETE | /api/products/:id | Protégée | Supprimer son produit |
| POST | /api/products/:id/vote | Protégée | Voter |
| DELETE | /api/products/:id/vote | Protégée | Retirer son vote |
| GET | /api/products/mine | Protégée | Ses propres produits |
| GET | /api/products/my-votes | Protégée | Ses votes actuels |
| GET | /api/categories | Publique | Liste des catégories |
| POST | /api/categories | Protégée | Créer une catégorie |

## État du projet

MVP fonctionnel de bout en bout. Non fait à ce stade : déploiement en production (hébergement backend/frontend), persistance réelle des paramètres de compte (email/mot de passe/suppression).