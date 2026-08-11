export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// context permet de personnaliser le titre/texte selon l'usage (vérification de
// compte, changement d'email, changement de mdp...) sans dupliquer toute la fonction.
export async function sendOtpEmail(to, otpCode, context = {}) {
  const {
    subject = 'Confirme ton adresse email — ProductHunt Lite',
    heading = 'Confirme ton compte',
    intro = 'Voici ton code de vérification :'
  } = context;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'ProductHunt Lite', email: process.env.EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #211F30;">${heading}</h2>
          <p>${intro}</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #7C6CF4;">${otpCode}</p>
          <p style="color: #666; font-size: 13px;">Ce code expire dans 10 minutes.</p>
        </div>
      `
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Échec de l\'envoi de l\'email');
  }

  return data;
}