import Product from '../models/Product.js';
import Vote from '../models/Vote.js';
import User from '../models/User.js';

export const getPublicStats = async (req, res) => {
  try {
    const [totalProducts, totalVotes, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Vote.countDocuments(),
      User.countDocuments({ isVerified: true })
    ]);

    res.status(200).json({
      productsCount: totalProducts,
      votesCount: totalVotes,
      membersCount: totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération statistiques publiques', error: error.message });
  }
};

export const validateEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const apiKey = process.env.MAILBOXLAYER_API_KEY;
    const url = `https://api.apilayer.net/mailboxlayer/api/check?access_key=${apiKey}&email=${encodeURIComponent(email)}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json({
      email: data.email,
      formatValid: data.format_valid,
      mxFound: data.mx_found,
      smtpCheck: data.smtp_check,
      disposable: data.disposable,
      score: data.score
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur validation email', error: error.message });
  }
};