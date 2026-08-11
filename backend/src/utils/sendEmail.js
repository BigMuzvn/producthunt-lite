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

// Notification d'information sécurité (ex: notification à l'ancienne adresse lors d'un changement d'email)
export async function sendNotificationEmail(to, context = {}) {
  const {
    subject = 'Notification de sécurité — ProductHunt Lite',
    heading = 'Information concernant votre compte',
    message = 'Une action importante a été effectuée sur votre compte.'
  } = context;

  try {
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
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #211F30;">
            <h2 style="color: #7C6CF4;">${heading}</h2>
            <p style="font-size: 15px; line-height: 1.5;">${message}</p>
            <p style="color: #888; font-size: 12px; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px;">
              Si vous n'êtes pas à l'origine de cette action, veuillez sécuriser votre compte immédiatement ou contacter notre support.
            </p>
          </div>
        `
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification email:', error.message);
  }
}

// Notification envoyée au créateur lorsqu'un palier de votes est franchi
export async function sendVoteMilestoneEmail(makerEmail, makerName, productName, votesCount) {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'ProductHunt Lite', email: process.env.EMAIL_FROM },
        to: [{ email: makerEmail }],
        subject: `🎉 Félicitations ! "${productName}" vient d'atteindre ${votesCount} votes !`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #211F30; padding: 24px; border: 1px solid #E6E4F5; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 40px;">🚀</span>
              <h2 style="color: #7C6CF4; margin-top: 8px;">Nouveau cap franchi !</h2>
            </div>
            <p>Bonjour <strong>${makerName}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Ton produit <strong>"${productName}"</strong> gagne en visibilité et vient d'atteindre le palier symbolique de 
              <strong style="color: #7C6CF4; font-size: 18px;"> ${votesCount} votes</strong> sur ProductHunt Lite !
            </p>
            <div style="background: #F8F7FF; border-left: 4px solid #7C6CF4; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #4A4660;">Continue de partager ton projet auprès de ta communauté pour grimper dans le classement !</p>
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
              L'équipe ProductHunt Lite
            </p>
          </div>
        `
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de palier de votes:', error.message);
  }
}

// Notification envoyée au créateur lorsqu'un nouveau commentaire est publié
export async function sendNewCommentEmail(makerEmail, makerName, productName, commenterName, commentExcerpt, productId) {
  try {
    const productUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/products/${productId}`;
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'ProductHunt Lite', email: process.env.EMAIL_FROM },
        to: [{ email: makerEmail }],
        subject: `💬 Nouveau commentaire de ${commenterName} sur "${productName}"`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #211F30; padding: 24px; border: 1px solid #E6E4F5; border-radius: 16px;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #7C6CF4; margin: 0 0 8px;">Nouveau retour reçu</h2>
              <p style="color: #666; font-size: 14px; margin: 0;">Sur ton produit <strong>"${productName}"</strong></p>
            </div>
            <p>Bonjour <strong>${makerName}</strong>,</p>
            <p><strong>${commenterName}</strong> a laissé un commentaire sur ton projet :</p>
            <div style="background: #F8F7FF; border: 1px solid #E6E4F5; border-radius: 8px; padding: 14px 18px; margin: 16px 0; font-style: italic; color: #211F30;">
              "${commentExcerpt}"
            </div>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${productUrl}" style="display: inline-block; background: #7C6CF4; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                Voir et répondre sur la fiche produit
              </a>
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
              L'équipe ProductHunt Lite
            </p>
          </div>
        `
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de commentaire:', error.message);
  }
}