import User from '../models/User.js';
import Product from '../models/product.js';
import Category from '../models/category.js';
import Vote from '../models/Vote.js';
import bcrypt from 'bcrypt';

export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalCategories, totalVotes] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
      Vote.countDocuments()
    ]);

    res.status(200).json({ totalUsers, totalProducts, totalCategories, totalVotes });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -otpCode -otpExpires')
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