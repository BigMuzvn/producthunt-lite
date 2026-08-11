import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpEmail, sendNotificationEmail, generateOtp } from '../utils/sendEmail.js';
import { validatePasswordComplexity, checkPasswordReuse, pushToPasswordHistory } from '../utils/passwordValidation.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
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
      email,
      password: hashedPassword,
      isVerified: false,
      otpCode,
      otpExpires
    });

    try {
      await sendOtpEmail(newUser.email, otpCode);
      console.log('Email envoyé avec succès à', newUser.email);
    } catch (emailError) {
      console.log('ERREUR ENVOI EMAIL:', emailError.message);
    }

    res.status(201).json({
      message: 'Compte créé. Un code de vérification a été envoyé par email.',
      email: newUser.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
  token,
  user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin }
});
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

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
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

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
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
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
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
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
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
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
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const existingUser = await User.findOne({ email: newEmail.toLowerCase().trim() });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre compte' });
    }

    const oldEmail = user.email;
    user.email = newEmail.toLowerCase().trim();
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
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
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
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};