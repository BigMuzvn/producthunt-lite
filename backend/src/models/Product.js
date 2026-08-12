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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
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