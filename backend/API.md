# Documentation de l'API — ProductHunt Lite

Base URL : `http://localhost:5000/api` (ou URL de production).

---

## 1. Santé & Utilitaires

### `GET /health`
* **Protection** : Publique
* **Description** : Vérifie l'état de disponibilité du serveur et son temps de fonctionnement.
* **Réponse 200** :
```json
{
  "status": "ok",
  "uptime": 128,
  "timestamp": "2026-08-11T11:30:00.000Z"
}
```

### `GET /api/utils/stats`
* **Protection** : Publique
* **Description** : Statistiques publiques agrégées en direct pour la landing page.
* **Réponse 200** :
```json
{
  "productsCount": 42,
  "votesCount": 350,
  "membersCount": 120
}
```

### `GET /api/utils/validate-email?email=test@example.com`
* **Protection** : Publique
* **Description** : Vérifie la validité d'un email (format, MX, disposable).

---

## 2. Authentification & Compte (`/api/auth`)

### `POST /api/auth/register`
* **Rate limit** : 15 req / 15 min
* **Body** : `{ "name": "Jean Dupont", "email": "jean@example.com", "password": "Password123" }`
* **Réponse 201** : `{ "message": "Compte créé avec succès. Vérifie ton email..." }`

### `POST /api/auth/verify-otp`
* **Rate limit** : 10 tentatives / 10 min
* **Body** : `{ "email": "jean@example.com", "otpCode": "123456" }`
* **Réponse 200** : `{ "token": "jwt_token", "user": { "_id": "...", "name": "...", "email": "..." } }`

### `POST /api/auth/login`
* **Rate limit** : 15 req / 15 min
* **Body** : `{ "email": "jean@example.com", "password": "Password123" }`
* **Réponse 200** : `{ "token": "jwt_token", "user": { "_id": "...", "name": "...", "email": "..." } }`

### `POST /api/auth/forgot-password`
* **Rate limit** : 15 req / 15 min
* **Body** : `{ "email": "jean@example.com" }`

### `POST /api/auth/reset-password`
* **Rate limit** : 15 req / 15 min
* **Body** : `{ "email": "jean@example.com", "otpCode": "123456", "newPassword": "NewPassword123" }`

### `PUT /api/auth/change-name`
* **Headers** : `Authorization: Bearer <token>`
* **Body** : `{ "name": "Nouveau Nom" }`
* **Réponse 200** : `{ "message": "Nom mis à jour avec succès", "user": { ... } }`

### `PUT /api/auth/change-email`
* **Headers** : `Authorization: Bearer <token>`
* **Body** : `{ "newEmail": "new@example.com", "currentPassword": "Password123" }`

### `PUT /api/auth/change-password`
* **Headers** : `Authorization: Bearer <token>`
* **Body** : `{ "currentPassword": "OldPassword123", "newPassword": "NewPassword123" }`

### `DELETE /api/auth/delete-account`
* **Headers** : `Authorization: Bearer <token>`
* **Body** : `{ "currentPassword": "Password123" }`

---

## 3. Produits (`/api/products`)

### `GET /api/products`
* **Protection** : Publique
* **Query Params** :
  * `sort` : `votes` (défaut) ou `recent`
  * `categoryId` : filtre par ID de catégorie
  * `search` : mot-clé de recherche (nom/tagline)
  * `page` / `limit` : pagination optionnelle

### `GET /api/products/:id`
* **Protection** : Publique

### `POST /api/products`
* **Headers** : `Authorization: Bearer <token>`
* **Body** : `{ "name": "...", "tagline": "...", "description": "...", "websiteUrl": "...", "categoryId": "...", "logoUrl": "...", "contactUrl": "..." }`

### `POST /api/products/:id/vote`
* **Headers** : `Authorization: Bearer <token>`
* **Règles** : Un seul vote par produit. Le créateur ne peut pas voter pour son propre produit.

### `DELETE /api/products/:id/vote`
* **Headers** : `Authorization: Bearer <token>`

---

## 4. Commentaires & Avis (`/api/comments`)

### `GET /api/comments/product/:productId`
* **Protection** : Publique
* **Description** : Récupère la liste des commentaires d'un produit (triés du plus récent au plus ancien, avec nom de l'auteur).

### `POST /api/comments/product/:productId`
* **Headers** : `Authorization: Bearer <token>`
* **Body** : `{ "content": "Superbe interface et idée très prometteuse !" }`
* **Notification** : Envoi automatique d'un email Brevo au créateur du produit avec l'extrait du commentaire.
* **Réponse 201** : Objet commentaire créé et enrichi.

### `DELETE /api/comments/:id`
* **Headers** : `Authorization: Bearer <token>`
* **Protection** : Auteur du commentaire ou Administrateur.

---

## 5. Administration (`/api/admin`)

*Toutes les routes requièrent le rôle Admin ou Super Admin.*

* `GET /api/admin/stats` : Vue d'ensemble, totaux et graphique 7 jours.
* `GET /api/admin/users` : Liste complète des utilisateurs (champs sensibles exclus).
* `DELETE /api/admin/users/:id` : Suppression d'un compte utilisateur.
* `POST /api/admin/users/:id/toggle-admin` : Promotion / Rétrogradation d'un admin.
* `POST /api/admin/create-admin` *(Super Admin)* : Création d'un nouvel administrateur.
* `PUT /api/admin/profile/name` *(Super Admin)* : Modification du nom.
* `POST /api/admin/profile/email/request-otp` & `confirm` *(Super Admin)* : Changement d'email sécurisé par OTP.
* `POST /api/admin/profile/password/request-otp` & `confirm` *(Super Admin)* : Changement de mot de passe sécurisé par OTP.
