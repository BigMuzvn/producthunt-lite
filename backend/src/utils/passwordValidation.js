// Nombre de mots de passe précédents à conserver dans l'historique
// (en plus du mot de passe actuel, qui est toujours vérifié à part).
export const PASSWORD_HISTORY_LIMIT = 5;

// Règles de complexité "standard raisonnable" :
// longueur minimale + diversité minimale, sans exiger de caractère spécial
// (souvent plus contraignant qu'utile en pratique).
export function validatePasswordComplexity(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une lettre minuscule' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une lettre majuscule' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }
  return { valid: true, message: null };
}

// Vérifie que newPassword (en clair) n'est ni le mot de passe actuel de l'utilisateur,
// ni l'un des PASSWORD_HISTORY_LIMIT mots de passe précédents (stockés hashés).
// bcrypt est passé en paramètre pour éviter un import circulaire/redondant.
export async function checkPasswordReuse(newPassword, user, bcrypt) {
  const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
  if (isSameAsCurrent) {
    return { reused: true, message: 'Ce mot de passe est identique à votre mot de passe actuel' };
  }

  for (const oldHash of user.passwordHistory) {
    const isSameAsOld = await bcrypt.compare(newPassword, oldHash);
    if (isSameAsOld) {
      return { reused: true, message: 'Ce mot de passe a déjà été utilisé récemment, choisissez-en un autre' };
    }
  }

  return { reused: false, message: null };
}

// Prépare la nouvelle valeur de passwordHistory : on ajoute l'ancien hash
// (celui qui va être remplacé) en tête, puis on tronque à la limite.
export function pushToPasswordHistory(user) {
  const updatedHistory = [user.password, ...user.passwordHistory];
  return updatedHistory.slice(0, PASSWORD_HISTORY_LIMIT);
}