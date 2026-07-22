import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, { timestamps: true });

voteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;