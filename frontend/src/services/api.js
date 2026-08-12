const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export async function apiFetch(endpoint, options = {}) {
  try {
    const cleanUrl = `${API_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const response = await fetch(cleanUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      throw new Error(`Le serveur backend est en cours de démarrage ou non connecté. Si vous venez de déployer sur Render, patientez 1 minute le temps que le serveur sorte de veille.`);
    }

    if (!response.ok) {
      throw new Error(data?.message || `Erreur serveur (${response.status})`);
    }

    return data;
  } catch (err) {
    if (err.name === 'SyntaxError') {
      throw new Error("Impossible de joindre l'API (Vérifiez la connexion réseau et l'URL du serveur backend).");
    }
    throw err;
  }
}