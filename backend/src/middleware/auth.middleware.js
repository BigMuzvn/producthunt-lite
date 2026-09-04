import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non autorisé, token manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Un changement de mot de passe incrémente tokenVersion côté compte : tout
    // token signé avant ce changement (y compris un token volé) devient invalide.
    const user = await User.findById(decoded.userId).select('tokenVersion');
    if (!user || (decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ message: 'Session expirée, merci de te reconnecter' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Non autorisé, token invalide' });
  }
};