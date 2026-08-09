import Product from '../models/product.js';
import User from '../models/User.js';

export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { tagline: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .populate('categoryId', 'name slug color')
      .populate('makerId', 'name')
      .sort({ votesCount: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name slug color')
      .populate('makerId', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};



export const createProduct = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
if (requester?.isAdmin) {
  return res.status(403).json({ message: 'Les comptes administrateurs ne peuvent pas soumettre de produits' });
}
    const { name, tagline, description, logoUrl, websiteUrl, contactUrl, categoryId } = req.body;

    if (!name || !tagline || !description || !websiteUrl || !categoryId) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const newProduct = await Product.create({
      name,
      tagline,
      description,
      logoUrl: logoUrl || '',
      websiteUrl,
      contactUrl: contactUrl || '',
      categoryId,
      makerId: req.userId
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


import Vote from '../models/Vote.js';

export const voteProduct = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);
if (requester?.isAdmin) {
  return res.status(403).json({ message: 'Les comptes administrateurs ne peuvent pas voter' });
}
    const productId = req.params.id;
    const userId = req.userId;

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

    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ makerId: req.userId })
      .populate('categoryId', 'name slug color')
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};




export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    if (product.makerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const { name, tagline, description, logoUrl, websiteUrl, contactUrl, categoryId } = req.body;
    Object.assign(product, { name, tagline, description, logoUrl, websiteUrl, contactUrl, categoryId });
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
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
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const getMyVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ userId: req.userId }).select('productId');
    res.status(200).json(votes.map(v => v.productId));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
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
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};