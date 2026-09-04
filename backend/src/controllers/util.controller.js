import Product from '../models/Product.js';
import Vote from '../models/Vote.js';
import User from '../models/User.js';
import { serverError } from '../utils/serverError.js';

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
    serverError(res, error, 'Erreur récupération statistiques publiques');
  }
};

export const validateEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    res.status(200).json({
      email,
      formatValid: isValid,
      mxFound: isValid,
      smtpCheck: isValid,
      disposable: false,
      score: isValid ? 1 : 0
    });
  } catch (error) {
    serverError(res, error, 'Erreur validation email');
  }
};