import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  color: {
    type: String,
    default: '#7C6CF4'
  },
  // 'approved' = visible publiquement et sélectionnable ; 'pending' = créée par un
  // utilisateur normal en attente de validation par un admin (voir admin.controller.js).
  status: {
    type: String,
    enum: ['approved', 'pending'],
    default: 'approved'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;