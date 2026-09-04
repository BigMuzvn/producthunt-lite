import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    default: ''
  },
  websiteUrl: {
    type: String,
    required: true
  },
  // Pas "required" : un produit peut se retrouver sans catégorie si celle qu'il
  // référençait était en attente de validation et a été rejetée par un admin
  // (voir admin.controller.js -> rejectCategory).
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  makerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votesCount: {
    type: Number,
    default: 0
  },
  launchDate: {
    type: Date,
    default: Date.now
  },
  images: [{
    type: String
  }],
  contactUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['LIVE', 'BETA', 'OPEN_SOURCE'],
    default: 'LIVE'
  },
}, { timestamps: true });

// Index de performance pour les filtres et tris fréquents
productSchema.index({ categoryId: 1 });
productSchema.index({ makerId: 1 });
productSchema.index({ votesCount: -1, createdAt: -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;