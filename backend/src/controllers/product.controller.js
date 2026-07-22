import Product from '../models/product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
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