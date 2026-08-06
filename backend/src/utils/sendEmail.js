export async function sendOtpEmail(to, otpCode) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'ProductHunt Lite', email: process.env.EMAIL_FROM },
      to: [{ email: to }],
      subject: 'Confirme ton adresse email — ProductHunt Lite',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #211F30;">Confirme ton compte</h2>
          <p>Voici ton code de vérification :</p>
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