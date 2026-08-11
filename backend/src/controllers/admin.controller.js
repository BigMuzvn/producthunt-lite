import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Vote from '../models/Vote.js';
import bcrypt from 'bcrypt';
import { validatePasswordComplexity, checkPasswordReuse, pushToPasswordHistory } from '../utils/passwordValidation.js';
import { sendOtpEmail, sendNotificationEmail, generateOtp } from '../utils/sendEmail.js';

export const getStats = async (req, res) => {
  try {
    const now = new Date();
    // 7 jours glissants, aujourd'hui inclus
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalClients,
      totalAdmins,
      totalProducts,
      totalCategories,
      totalVotes,
      topProducts,
      categories,
      recentUsers,
      recentProducts,
      recentUserDocs,
      recentVoteDocs
    ] = await Promise.all([
      User.countDocuments({ isAdmin: false, isSuperAdmin: false }),
      User.countDocuments({ $or: [{ isAdmin: true }, { isSuperAdmin: true }] }),
      Product.countDocuments(),
      Category.countDocuments(),
      Vote.countDocuments(),
      Product.find().sort({ votesCount: -1 }).limit(5).select('name logoUrl votesCount'),
      Category.find(),
      User.find({ isAdmin: false, isSuperAdmin: false }).sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Product.find().sort({ createdAt: -1 }).limit(5).select('name logoUrl createdAt makerId').populate('makerId', 'name'),
      User.find({ createdAt: { $gte: sevenDaysAgo } }).select('createdAt'),
      Vote.find({ createdAt: { $gte: sevenDaysAgo } }).select('createdAt')
    ]);

    // Répartition des produits par catégorie, triée de la plus utilisée à la moins utilisée
    const categoryBreakdown = await Promise.all(
      categories.map(async (c) => ({
        name: c.name,
        color: c.color,
        count: await Product.countDocuments({ categoryId: c._id })
      }))
    );
    categoryBreakdown.sort((a, b) => b.count - a.count);

    // Graphique 7 jours : un point par jour (format YYYY-MM-DD), rempli à 0 par défaut
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    function countsByDay(docs) {
      const counts = Object.fromEntries(days.map(d => [d, 0]));
      docs.forEach(doc => {
        const day = doc.createdAt.toISOString().slice(0, 10);
        if (counts[day] !== undefined) counts[day]++;
      });
      return counts;
    }

    const userCounts = countsByDay(recentUserDocs);
    const voteCounts = countsByDay(recentVoteDocs);
    const evolution = days.map(date => ({
      date,
      newUsers: userCounts[date],
      newVotes: voteCounts[date]
    }));

    res.status(200).json({
      totals: { totalClients, totalAdmins, totalProducts, totalCategories, totalVotes },
      topProducts,
      categoryBreakdown,
      recentActivity: { recentUsers, recentProducts },
      evolution
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -passwordHistory -pendingPasswordHash -pendingEmail -otpCode -otpExpires')
      .sort({ createdAt: -1 });

    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const productsCount = await Product.countDocuments({ makerId: user._id });
        return { ...user.toObject(), productsCount };
      })
    );

    res.status(200).json(usersWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.userId) {
      return res.status(400).json({ message: 'Tu ne peux pas supprimer ton propre compte ici' });
    }

    const target = await User.findById(userId);
    if (!target) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (target.isSuperAdmin) {
      return res.status(403).json({ message: 'Le super admin ne peut pas être supprimé' });
    }

    if (target.isAdmin) {
      const requester = await User.findById(req.userId);
      if (!requester.isSuperAdmin) {
        return res.status(403).json({ message: 'Seul le super admin peut supprimer un autre admin' });
      }
    }

    await Product.deleteMany({ makerId: userId });
    await Vote.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const toggleAdmin = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
    if (!requester.isSuperAdmin) {
      return res.status(403).json({ message: 'Seul le super admin peut modifier les rôles' });
    }

    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (target.isSuperAdmin) {
      return res.status(403).json({ message: 'Le super admin ne peut pas être modifié' });
    }

    target.isAdmin = !target.isAdmin;
    await target.save();

    res.status(200).json({ message: 'Rôle mis à jour', isAdmin: target.isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const adminDeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    await Vote.deleteMany({ productId });
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const adminDeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const productsUsingCategory = await Product.countDocuments({ categoryId });
    if (productsUsingCategory > 0) {
      return res.status(409).json({
        message: `Impossible : ${productsUsingCategory} produit(s) utilisent encore cette catégorie`
      });
    }

    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({ message: 'Catégorie supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
    if (!requester.isSuperAdmin) {
      return res.status(403).json({ message: 'Seul le super admin peut créer un compte admin' });
    }

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

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      isVerified: true // pas besoin d'OTP, créé directement par le super admin
    });

    res.status(201).json({
      message: 'Compte admin créé avec succès',
      user: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin
  };
}

// ─── Profil de l'admin connecté (nom / email / mdp) ───────────────────────

export const updateOwnName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Le nom ne peut pas être vide' });
    }

    const user = await User.findById(req.userId);
    user.name = name.trim();
    await user.save();

    res.status(200).json({ message: 'Nom mis à jour avec succès', user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Étape 1/2 : demande de changement d'email. L'OTP part sur la NOUVELLE adresse
// (pas l'ancienne) — ça reste valable même si l'admin a perdu l'accès à son
// ancienne boîte mail, ce qui est justement souvent la raison du changement.
export const requestEmailChangeOtp = async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;
    if (!newEmail || !currentPassword) {
      return res.status(400).json({ message: 'Nouvel email et mot de passe actuel requis' });
    }

    const user = await User.findById(req.userId);

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }

    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      return res.status(400).json({ message: 'Cette adresse est déjà ton email actuel' });
    }

    const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre compte' });
    }

    const otpCode = generateOtp();
    user.pendingEmail = newEmail.toLowerCase();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(newEmail, otpCode, {
      subject: 'Confirme ta nouvelle adresse email — ProductHunt Lite',
      heading: 'Confirme ta nouvelle adresse',
      intro: 'Voici le code pour confirmer que cette adresse t\'appartient bien :'
    });

    res.status(200).json({ message: 'Code envoyé à la nouvelle adresse' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Étape 2/2 : confirmation du changement d'email avec le code reçu.
export const confirmEmailChange = async (req, res) => {
  try {
    const { otpCode } = req.body;
    const user = await User.findById(req.userId);

    if (!user.pendingEmail || !user.otpCode) {
      return res.status(400).json({ message: 'Aucune demande de changement d\'email en cours' });
    }

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Code incorrect' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Ce code a expiré, recommence la demande' });
    }

    const oldEmail = user.email;
    const newEmail = user.pendingEmail;

    user.email = newEmail;
    user.pendingEmail = null;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    // Notification de sécurité à l'ancienne adresse email
    sendNotificationEmail(oldEmail, {
      subject: 'Alerte sécurité : Ton adresse email a été modifiée — ProductHunt Lite',
      heading: 'Modification de ton adresse email',
      message: `L'adresse email associée à ton compte administrateur a été modifiée pour <strong>${newEmail}</strong>. Si tu n'es pas à l'origine de ce changement, contacte immédiatement le support.`
    }).catch(err => console.error('Erreur lors de la notification à l\'ancienne adresse:', err));

    res.status(200).json({ message: 'Email mis à jour avec succès', user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Étape 1/2 : demande de changement de mot de passe. L'OTP part sur l'email
// ACTUEL (contrairement au changement d'email) : ici pas de raison de ne
// plus y avoir accès, donc ça reste la vérification la plus logique.
export const requestPasswordChangeOtp = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mot de passe actuel et nouveau mot de passe requis' });
    }

    const user = await User.findById(req.userId);

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

    const otpCode = generateOtp();
    user.pendingPasswordHash = await bcrypt.hash(newPassword, 10);
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otpCode, {
      subject: 'Confirme le changement de mot de passe — ProductHunt Lite',
      heading: 'Confirme le changement de mot de passe',
      intro: 'Voici le code pour valider ton nouveau mot de passe :'
    });

    res.status(200).json({ message: 'Code envoyé à ton adresse actuelle' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Étape 2/2 : confirmation du changement de mot de passe avec le code reçu.
export const confirmPasswordChange = async (req, res) => {
  try {
    const { otpCode } = req.body;
    const user = await User.findById(req.userId);

    if (!user.pendingPasswordHash || !user.otpCode) {
      return res.status(400).json({ message: 'Aucune demande de changement de mot de passe en cours' });
    }

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Code incorrect' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Ce code a expiré, recommence la demande' });
    }

    user.passwordHistory = pushToPasswordHistory(user);
    user.password = user.pendingPasswordHash;
    user.pendingPasswordHash = null;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ─── Gestion des AUTRES admins par le super admin (pas d'OTP : le super
// admin a déjà l'autorité, comme pour la création ou la suppression) ───────

export const updateOtherAdmin = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
    if (!requester.isSuperAdmin) {
      return res.status(403).json({ message: 'Seul le super admin peut modifier un autre admin' });
    }

    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Admin introuvable' });
    }
    if (target.isSuperAdmin) {
      return res.status(403).json({ message: 'Modifie le super admin depuis "Mon profil"' });
    }
    if (!target.isAdmin) {
      return res.status(400).json({ message: 'Cet utilisateur n\'est pas un admin' });
    }

    const { name, email } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Le nom ne peut pas être vide' });
      }
      target.name = name.trim();
    }

    if (email !== undefined && email.toLowerCase() !== target.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre compte' });
      }
      target.email = email.toLowerCase();
    }

    await target.save();

    res.status(200).json({ message: 'Admin mis à jour avec succès', user: publicUser(target) });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const resetOtherAdminPassword = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
    if (!requester.isSuperAdmin) {
      return res.status(403).json({ message: 'Seul le super admin peut réinitialiser le mot de passe d\'un admin' });
    }

    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Admin introuvable' });
    }
    if (target.isSuperAdmin) {
      return res.status(403).json({ message: 'Modifie le super admin depuis "Mon profil"' });
    }
    if (!target.isAdmin) {
      return res.status(400).json({ message: 'Cet utilisateur n\'est pas un admin' });
    }

    const { newPassword } = req.body;
    const complexityCheck = validatePasswordComplexity(newPassword);
    if (!complexityCheck.valid) {
      return res.status(400).json({ message: complexityCheck.message });
    }

    const reuseCheck = await checkPasswordReuse(newPassword, target, bcrypt);
    if (reuseCheck.reused) {
      return res.status(400).json({ message: reuseCheck.message });
    }

    target.passwordHistory = pushToPasswordHistory(target);
    target.password = await bcrypt.hash(newPassword, 10);
    await target.save();

    res.status(200).json({ message: 'Mot de passe de l\'admin mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};