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
  contactUrl: {
  type: String,
  default: ''
},
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;