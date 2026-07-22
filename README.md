# ProductHunt Lite

Clone simplifié de Product Hunt, développé avec React (frontend) et Node.js/Express/MongoDB (backend).

## Fonctionnalités

- Landing page avec produits et catégories chargés dynamiquement depuis MongoDB
- Inscription et connexion avec authentification par token JWT
- Mots de passe hashés avec bcrypt (jamais stockés en clair)
- Routes backend protégées par middleware, routes frontend protégées par redirection
- Page de détail produit
- Dashboard utilisateur (connecté)

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
    services/     centralisation des appels API
    data/         données statiques (avant migration complète vers l'API)
\`\`\`

## État du projet

Projet en cours de développement. Fonctionnalités backend en place : lecture des produits/catégories, authentification. À venir : votes, soumission de produit par l'utilisateur.