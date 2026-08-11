import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


export const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Nom requis' });

    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) return res.status(200).json(existing);

    const category = await Category.create({ name, slug, color: color || '#7C6CF4' });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};