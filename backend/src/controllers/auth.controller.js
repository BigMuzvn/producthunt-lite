import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
      user: { id: user._id, name: user.name, email: user.email }
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Compte non vérifié', needsVerification: true, email: user.email });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};