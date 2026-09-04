import Category from '../models/Category.js';
import User from '../models/User.js';
import { serverError } from '../utils/serverError.js';

// Liste publique : uniquement les cat\u00e9gories approuv\u00e9es (filtres, formulaires...).
// $ne (et non "= approved") pour rester correct m\u00eame sur d'anciens documents
// cr\u00e9\u00e9s avant l'ajout du champ status (Mongo ne r\u00e9tro-applique jamais un
// "default" de sch\u00e9ma sur des documents d\u00e9j\u00e0 stock\u00e9s).
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: { $ne: 'pending' } });
    res.status(200).json(categories);
  } catch (error) {
    serverError(res, error);
  }
};


const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;

export const createCategory = async (req, res) => {
  try {
    const { color } = req.body;
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';

    if (!name) return res.status(400).json({ message: 'Nom requis' });
    if (name.length > 40) {
      return res.status(400).json({ message: 'Le nom de la cat\u00e9gorie ne peut pas d\u00e9passer 40 caract\u00e8res' });
    }

    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (!slug) {
      return res.status(400).json({ message: 'Nom de cat\u00e9gorie invalide' });
    }

    const existing = await Category.findOne({ slug });
    if (existing) return res.status(200).json(existing);

    const safeColor = typeof color === 'string' && HEX_COLOR_RE.test(color) ? color : '#7C6CF4';

    // Un admin/super admin cr\u00e9e directement une cat\u00e9gorie approuv\u00e9e (panel admin) ;
    // un utilisateur normal (formulaire de soumission de produit) passe par la
    // file d'attente de validation.
    const requester = await User.findById(req.userId);
    const status = requester?.isAdmin || requester?.isSuperAdmin ? 'approved' : 'pending';

    const category = await Category.create({ name, slug, color: safeColor, status, createdBy: req.userId });
    res.status(201).json(category);
  } catch (error) {
    serverError(res, error);
  }
};