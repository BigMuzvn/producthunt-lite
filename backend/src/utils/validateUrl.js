// Valide qu'une valeur est une URL http(s) exploitable — bloque les schémas
// dangereux (javascript:, data:, vbscript:...) et les valeurs non-URL.
export function isValidHttpUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
