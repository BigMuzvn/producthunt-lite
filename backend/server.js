import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import categoryRoutes from './src/routes/category.routes.js';
import productRoutes from './src/routes/product.routes.js';
import utilRoutes from './src/routes/util.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import errorHandler from './src/middleware/errorHandler.middleware.js';

dotenv.config();

// Validation des variables d'environnement requises au démarrage
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'BREVO_API_KEY', 'EMAIL_FROM'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error(`❌ Erreur fatale : variables d'environnement manquantes : ${missingVars.join(', ')}`);
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 8) {
  console.error('❌ Erreur de sécurité : JWT_SECRET doit contenir au moins 8 caractères.');
  process.exit(1);
}

connectDB();

const app = express();

// Sécurisation des en-têtes HTTP
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Configuration CORS dynamique (compatible multi-origines, Vercel, localhost et credentials: true)
const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://127.0.0.1:5173';
const allowedOrigins = rawOrigins.split(',').map(origin => origin.trim().toLowerCase());

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (ex: curl, mobile, serveur)
    if (!origin) return callback(null, true);

    const originLower = origin.toLowerCase();
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(originLower);
    // Uniquement les déploiements (prod + previews) DE CE projet Vercel précis
    // (ex: producthunt-lite.vercel.app, producthunt-lite-git-main-xxx.vercel.app) —
    // pas n'importe quel *.vercel.app, qui est trivial à obtenir gratuitement par
    // n'importe qui et briserait l'intérêt d'une allowlist d'origines.
    const isOwnVercelDeployment = /^https:\/\/producthunt-lite(-[a-z0-9.-]+)?\.vercel\.app$/.test(originLower);

    if (allowedOrigins.includes('*') || allowedOrigins.includes(originLower) || isLocalhost || isOwnVercelDeployment) {
      return callback(null, origin);
    }

    return callback(null, false);
  },
  credentials: true
}));

import path from 'path';
import notificationRoutes from './src/routes/notification.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes de base et santé
app.get('/', (req, res) => {
  res.json({ message: 'phclone-lite API is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Routes API avec support du préfixe /api et des accès directs
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes);

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/comments', commentRoutes);
app.use('/comments', commentRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);

app.use('/api/upload', uploadRoutes);
app.use('/upload', uploadRoutes);

app.use('/api/utils', utilRoutes);
app.use('/utils', utilRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Middleware centralisé de gestion d'erreurs (doit être le dernier middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));