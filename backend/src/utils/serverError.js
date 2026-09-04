// Réponse d'erreur 500 uniforme : le message générique part toujours au client,
// le détail technique (error.message) uniquement hors production — évite de
// fuiter des détails internes (erreurs Mongoose, chemins, etc.) une fois déployé.
export function serverError(res, error, message = 'Erreur serveur') {
  return res.status(500).json({
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : error?.message
  });
}
