import User from '../models/User.js';

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || (!user.isAdmin && !user.isSuperAdmin)) {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};