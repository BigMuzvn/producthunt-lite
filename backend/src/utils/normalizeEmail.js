// Normalise un email utilisateur en chaîne sûre pour une requête Mongo.
// Retourne null si la valeur n'est pas une chaîne (bloque les tentatives
// d'injection NoSQL du type { "$ne": null } passées comme "email").
export function normalizeEmail(email) {
  if (typeof email !== 'string') return null;
  const trimmed = email.toLowerCase().trim();
  return trimmed || null;
}

// Vérification de format simple (pas de résolution DNS/MX) : suffit à bloquer
// les chaînes qui ne ressemblent même pas à un email, sans dépendance externe.
const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmailFormat(email) {
  return typeof email === 'string' && EMAIL_FORMAT_RE.test(email);
}
