import rateLimit from 'express-rate-limit';

// Limiteur pour les tentatives d'authentification (login, register, forgot-password, reset-password)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // max 15 requêtes par IP par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Trop de tentatives depuis cette adresse IP. Veuillez réessayer après 15 minutes.'
  }
});

// Limiteur pour les demandes d'envoi / renvoi d'OTP (évite l'épuisement du quota Brevo et le spam email)
export const otpRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 envois par IP par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Trop de demandes de code OTP. Veuillez patienter avant de réessayer.'
  }
});

// Limiteur pour la vérification / confirmation d'OTP (anti brute-force du code à 6 chiffres)
export const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // max 10 essais par IP par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Trop de tentatives de validation de code. Veuillez réessayer plus tard.'
  }
});

// Limiteur pour la création de catégorie (feature ouverte à tout utilisateur connecté
// lors de la soumission d'un produit) : évite le spam de catégories bidon.
export const categoryCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 créations par IP par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Trop de créations de catégorie. Veuillez réessayer plus tard.'
  }
});
