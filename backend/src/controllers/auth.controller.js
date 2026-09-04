import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { sendOtpEmail, sendNotificationEmail, generateOtp } from '../utils/sendEmail.js';
import { validatePasswordComplexity, checkPasswordReuse, pushToPasswordHistory } from '../utils/passwordValidation.js';
import { normalizeEmail, isValidEmailFormat } from '../utils/normalizeEmail.js';
import { serverError } from '../utils/serverError.js';
import { isValidHttpUrl } from '../utils/validateUrl.js';

export const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (!isValidEmailFormat(email)) {
      return res.status(400).json({ message: 'Adresse email invalide' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    const complexityCheck = validatePasswordComplexity(password);
    if (!complexityCheck.valid) {
      return res.status(400).json({ message: complexityCheck.message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isVerified: false,
      otpCode,
      otpExpires
    });

    try {
      await sendOtpEmail(newUser.email, otpCode);
      console.log('Email OTP envoyé avec succès à', newUser.email);
    } catch (emailError) {
      console.log('ERREUR ENVOI EMAIL OTP:', emailError.message);
    }

    res.status(201).json({
      message: 'Compte créé. Un code de vérification a été envoyé par email.',
      email: newUser.email
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otpCode } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !otpCode || typeof otpCode !== 'string') {
      return res.status(400).json({ message: 'Email et code requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Ce compte est déjà vérifié' });
    }

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Code incorrect' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Ce code a expiré, demande-en un nouveau' });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion || 0 }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        githubUrl: user.githubUrl || '',
        twitterUrl: user.twitterUrl || '',
        portfolioUrl: user.portfolioUrl || '',
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
      }
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const resendOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Ce compte est déjà vérifié' });
    }

    const otpCode = generateOtp();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

  
      await sendOtpEmail(user.email, otpCode);
   

    res.status(200).json({ message: 'Nouveau code envoyé' });
  } catch (error) {
    serverError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérification du verrouillage temporaire de compte
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return res.status(423).json({
        message: `Compte temporairement verrouillé suite à trop de tentatives. Réessaie dans ${remainingMinutes} minute(s).`
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes de blocage
        user.loginAttempts = 0;
        await user.save();
        return res.status(423).json({
          message: 'Trop de tentatives incorrectes. Ton compte est verrouillé pour 15 minutes par sécurité.'
        });
      }
      await user.save();
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Réinitialisation des compteurs d'échec en cas de succès
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Compte non vérifié', needsVerification: true, email: user.email });
    }

    const token = jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion || 0 }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        githubUrl: user.githubUrl || '',
        twitterUrl: user.twitterUrl || '',
        portfolioUrl: user.portfolioUrl || '',
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
      }
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Message volontairement neutre : on ne révèle pas si l'email existe ou non
      return res.status(200).json({ message: 'Si ce compte existe, un code a été envoyé.' });
    }

    const otpCode = generateOtp();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otpCode);

    res.status(200).json({ message: 'Si ce compte existe, un code a été envoyé.' });
  } catch (error) {
    serverError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { otpCode, newPassword } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !otpCode || typeof otpCode !== 'string' || !newPassword || typeof newPassword !== 'string') {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Code incorrect' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Ce code a expiré, demande-en un nouveau' });
    }

    const complexityCheck = validatePasswordComplexity(newPassword);
    if (!complexityCheck.valid) {
      return res.status(400).json({ message: complexityCheck.message });
    }

    const reuseCheck = await checkPasswordReuse(newPassword, user, bcrypt);
    if (reuseCheck.reused) {
      return res.status(400).json({ message: reuseCheck.message });
    }

    user.passwordHistory = pushToPasswordHistory(user);
    user.password = await bcrypt.hash(newPassword, 10);
    user.otpCode = null;
    user.otpExpires = null;
    // Invalide toute session/tout token existant (utile si le compte était compromis).
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    serverError(res, error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }

    const complexityCheck = validatePasswordComplexity(newPassword);
    if (!complexityCheck.valid) {
      return res.status(400).json({ message: complexityCheck.message });
    }

    const reuseCheck = await checkPasswordReuse(newPassword, user, bcrypt);
    if (reuseCheck.reused) {
      return res.status(400).json({ message: reuseCheck.message });
    }

    user.passwordHistory = pushToPasswordHistory(user);
    user.password = await bcrypt.hash(newPassword, 10);
    // Invalide tout token émis avant ce changement (session courante incluse) ;
    // on renvoie donc un token frais pour que la session actuelle reste valide.
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    const token = jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès', token });
  } catch (error) {
    serverError(res, error);
  }
};

export const changeName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    user.name = name.trim();
    await user.save();

    const publicUserData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    };

    res.status(200).json({ message: 'Nom mis à jour avec succès', user: publicUserData });
  } catch (error) {
    serverError(res, error);
  }
};

export const changeEmail = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const newEmail = normalizeEmail(req.body.newEmail);

    if (!newEmail || !currentPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (!isValidEmailFormat(newEmail)) {
      return res.status(400).json({ message: 'Adresse email invalide' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre compte' });
    }

    const oldEmail = user.email;
    user.email = newEmail;
    await user.save();

    // Notification de sécurité à l'ancienne adresse email
    sendNotificationEmail(oldEmail, {
      subject: 'Alerte sécurité : Ton adresse email a été modifiée — ProductHunt Lite',
      heading: 'Modification de ton adresse email',
      message: `L'adresse email associée à ton compte a été modifiée pour <strong>${user.email}</strong>. Si tu n'es pas à l'origine de ce changement, contacte immédiatement le support.`
    }).catch(err => console.error('Erreur lors de la notification à l\'ancienne adresse:', err));

    const publicUserData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    };

    res.status(200).json({ message: 'Email mis à jour avec succès', user: publicUserData });
  } catch (error) {
    serverError(res, error);
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: 'Mot de passe requis pour confirmer' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    await user.deleteOne();

    res.status(200).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    serverError(res, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl, githubUrl, twitterUrl, portfolioUrl } = req.body;
    const userId = req.userId || req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    for (const [field, value] of Object.entries({ avatarUrl, githubUrl, twitterUrl, portfolioUrl })) {
      if (value && !isValidHttpUrl(value)) {
        return res.status(400).json({ message: `Le lien "${field}" doit être une URL http(s) valide` });
      }
    }

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (twitterUrl !== undefined) user.twitterUrl = twitterUrl;
    if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;

    await user.save();

    const publicUserData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      githubUrl: user.githubUrl,
      twitterUrl: user.twitterUrl,
      portfolioUrl: user.portfolioUrl,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      bookmarks: user.bookmarks
    };

    res.status(200).json({ message: 'Profil mis à jour avec succès', user: publicUserData });
  } catch (error) {
    serverError(res, error);
  }
};

export const getMakerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const maker = await User.findById(id).select('-password -passwordHistory -otpCode -otpExpires -pendingEmail -pendingPasswordHash -loginAttempts -lockUntil');
    if (!maker) {
      return res.status(404).json({ message: 'Maker introuvable' });
    }

    const products = await Product.find({ makerId: id })
      .populate('categoryId', 'name color status')
      .sort({ createdAt: -1 });

    // Seuls les comptes ayant publié au moins un produit ont un profil "maker"
    // consultable publiquement : ça évite d'exposer l'email de tout inscrit
    // (simple votant/commentateur) via une simple énumération d'ID.
    if (products.length === 0) {
      return res.status(404).json({ message: 'Maker introuvable' });
    }

    const totalVotes = products.reduce((acc, p) => acc + (p.votesCount || 0), 0);

    res.status(200).json({
      maker: {
        _id: maker._id,
        name: maker.name,
        email: maker.email,
        bio: maker.bio || '',
        avatarUrl: maker.avatarUrl || '',
        githubUrl: maker.githubUrl || '',
        twitterUrl: maker.twitterUrl || '',
        portfolioUrl: maker.portfolioUrl || '',
        createdAt: maker.createdAt
      },
      products,
      stats: {
        totalProducts: products.length,
        totalVotes
      }
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId || req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    const index = user.bookmarks.indexOf(productId);
    let isBookmarked = false;

    if (index > -1) {
      user.bookmarks.splice(index, 1);
    } else {
      user.bookmarks.push(productId);
      isBookmarked = true;
    }

    await user.save();

    res.status(200).json({
      message: isBookmarked ? 'Produit ajouté à vos favoris' : 'Produit retiré de vos favoris',
      isBookmarked,
      bookmarks: user.bookmarks
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id;
    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      populate: [
        { path: 'categoryId', select: 'name color' },
        { path: 'makerId', select: 'name avatarUrl' }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    res.status(200).json({ bookmarks: user.bookmarks || [] });
  } catch (error) {
    serverError(res, error);
  }
};