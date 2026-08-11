import Comment from '../models/Comment.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { sendNewCommentEmail } from '../utils/sendEmail.js';

export const getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ productId })
      .populate('userId', 'name avatarUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Le contenu du commentaire ne peut pas être vide.' });
    }

    if (content.trim().length > 1000) {
      return res.status(400).json({ message: 'Le commentaire ne peut pas dépasser 1000 caractères.' });
    }

    const product = await Product.findById(productId).populate('makerId', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    const commenter = await User.findById(userId).select('name');

    const comment = await Comment.create({
      productId,
      userId,
      content: content.trim()
    });

    const populatedComment = await Comment.findById(comment._id).populate('userId', 'name avatarUrl');

    // Notification email au créateur si le commentateur n'est pas le créateur lui-même
    if (product.makerId && product.makerId.email && product.makerId._id.toString() !== userId.toString()) {
      const excerpt = content.trim().length > 150 ? `${content.trim().slice(0, 150)}...` : content.trim();
      sendNewCommentEmail(
        product.makerId.email,
        product.makerId.name,
        product.name,
        commenter?.name || 'Un membre',
        excerpt,
        productId
      ).catch(() => {});
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire introuvable.' });
    }

    const user = await User.findById(userId);

    const isAuthor = comment.userId.toString() === userId.toString();
    const isAdmin = user?.isAdmin || user?.isSuperAdmin;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce commentaire.' });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: 'Commentaire supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
