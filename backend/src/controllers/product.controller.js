import Product from '../models/Product.js';
import User from '../models/User.js';
import Vote from '../models/Vote.js';
import { sendVoteMilestoneEmail } from '../utils/sendEmail.js';
import { sendNotification } from './notification.controller.js';
import { serverError } from '../utils/serverError.js';
import { isValidHttpUrl } from '../utils/validateUrl.js';

export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }
    if (req.query.search && req.query.search.trim()) {
      const safeSearch = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { tagline: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    let sortQuery = { votesCount: -1, createdAt: -1 };
    if (req.query.sort === 'recent') {
      sortQuery = { createdAt: -1 };
    } else if (req.query.sort === 'name') {
      sortQuery = { name: 1 };
    }

    let query = Product.find(filter)
      .populate('categoryId', 'name slug color status')
      .populate('makerId', 'name avatarUrl bio githubUrl twitterUrl portfolioUrl')
      .sort(sortQuery);

    if (req.query.limit) {
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    serverError(res, error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name slug color status')
      .populate('makerId', 'name avatarUrl bio githubUrl twitterUrl portfolioUrl');

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    res.status(200).json(product);
  } catch (error) {
    serverError(res, error);
  }
};

export const createProduct = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
    if (requester?.isAdmin || requester?.isSuperAdmin) {
      return res.status(403).json({ message: 'Les comptes administrateurs ne peuvent pas soumettre de produits' });
    }
    const { name, tagline, description, logoUrl, websiteUrl, contactUrl, categoryId, images, status } = req.body;

    if (!name || !tagline || !description || !websiteUrl || !categoryId) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    if (!isValidHttpUrl(websiteUrl)) {
      return res.status(400).json({ message: 'Le lien du site doit être une URL http(s) valide' });
    }
    if (logoUrl && !isValidHttpUrl(logoUrl)) {
      return res.status(400).json({ message: 'Le lien du logo doit être une URL http(s) valide' });
    }
    if (contactUrl && !isValidHttpUrl(contactUrl)) {
      return res.status(400).json({ message: 'Le lien du réseau social doit être une URL http(s) valide' });
    }

    const newProduct = await Product.create({
      name,
      tagline,
      description,
      logoUrl: logoUrl || '',
      websiteUrl,
      contactUrl: contactUrl || '',
      categoryId,
      images: Array.isArray(images) ? images : [],
      status: ['LIVE', 'BETA', 'OPEN_SOURCE'].includes(status) ? status : 'LIVE',
      makerId: req.userId
    });

    res.status(201).json(newProduct);
  } catch (error) {
    serverError(res, error);
  }
};

export const voteProduct = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
    if (requester?.isAdmin || requester?.isSuperAdmin) {
      return res.status(403).json({ message: 'Les comptes administrateurs ne peuvent pas voter' });
    }
    const productId = req.params.id;
    const userId = req.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    if (product.makerId.toString() === userId.toString()) {
      return res.status(403).json({ message: 'Vous ne pouvez pas voter pour votre propre produit' });
    }

    const existingVote = await Vote.findOne({ userId, productId });
    if (existingVote) {
      return res.status(409).json({ message: 'Tu as déjà voté pour ce produit' });
    }

    await Vote.create({ userId, productId });

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { votesCount: 1 } },
      { new: true }
    );

    // Envoyer la notification in-app au créateur
    sendNotification({
      recipientId: product.makerId,
      senderId: userId,
      productId: product._id,
      type: 'VOTE',
      message: `${requester?.name || 'Un utilisateur'} a voté pour votre produit "${product.name}" !`
    });

    const voteMilestones = [5, 10, 25, 50, 100, 250, 500, 1000];
    if (voteMilestones.includes(updatedProduct.votesCount)) {
      User.findById(product.makerId).select('name email').then(maker => {
        if (maker?.email) {
          sendVoteMilestoneEmail(maker.email, maker.name, product.name, updatedProduct.votesCount).catch(() => {});
        }
      }).catch(() => {});
    }

    res.status(201).json(updatedProduct);
  } catch (error) {
    serverError(res, error);
  }
};


export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ makerId: req.userId })
      .populate('categoryId', 'name slug color status')
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    serverError(res, error);
  }
};




export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    if (product.makerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const { name, tagline, description, logoUrl, websiteUrl, contactUrl, categoryId, images, status } = req.body;

    if (websiteUrl !== undefined && !isValidHttpUrl(websiteUrl)) {
      return res.status(400).json({ message: 'Le lien du site doit être une URL http(s) valide' });
    }
    if (logoUrl && !isValidHttpUrl(logoUrl)) {
      return res.status(400).json({ message: 'Le lien du logo doit être une URL http(s) valide' });
    }
    if (contactUrl && !isValidHttpUrl(contactUrl)) {
      return res.status(400).json({ message: 'Le lien du réseau social doit être une URL http(s) valide' });
    }

    // On ne touche qu'aux champs réellement envoyés : une mise à jour partielle
    // ne doit jamais écraser le reste du produit avec des valeurs undefined.
    if (name !== undefined) product.name = name;
    if (tagline !== undefined) product.tagline = tagline;
    if (description !== undefined) product.description = description;
    if (logoUrl !== undefined) product.logoUrl = logoUrl;
    if (websiteUrl !== undefined) product.websiteUrl = websiteUrl;
    if (contactUrl !== undefined) product.contactUrl = contactUrl;
    if (categoryId !== undefined) product.categoryId = categoryId;
    if (Array.isArray(images)) product.images = images;
    if (['LIVE', 'BETA', 'OPEN_SOURCE'].includes(status)) product.status = status;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    serverError(res, error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    if (product.makerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Produit supprimé' });
  } catch (error) {
    serverError(res, error);
  }
};

export const getMyVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ userId: req.userId }).select('productId');
    res.status(200).json(votes.map(v => v.productId));
  } catch (error) {
    serverError(res, error);
  }
};


export const unvoteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.userId;

    const existingVote = await Vote.findOne({ userId, productId });
    if (!existingVote) {
      return res.status(404).json({ message: "Tu n'as pas encore voté pour ce produit" });
    }

    await existingVote.deleteOne();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { votesCount: -1 } },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    serverError(res, error);
  }
};