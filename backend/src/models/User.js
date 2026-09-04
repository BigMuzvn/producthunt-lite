import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  passwordHistory: {
    type: [String],
    default: []
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  twitterUrl: {
    type: String,
    default: ''
  },
  portfolioUrl: {
    type: String,
    default: ''
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false },
  isSuperAdmin: {
    type: Boolean,
    default: false
},
  otpCode: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  // Utilisés uniquement pour le flux "changement d'email/mdp avec OTP" du profil admin.
  // On ne modifie jamais email/password directement : on stocke la valeur en attente ici,
  // et on ne l'applique qu'une fois l'OTP confirmé (voir admin.controller.js).
  pendingEmail: {
    type: String,
    default: null
  },
  pendingPasswordHash: {
    type: String,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  // Incrémenté à chaque changement de mot de passe : les JWT signés avec un
  // ancien tokenVersion sont rejetés par le middleware `protect`, ce qui
  // invalide tous les tokens émis avant le changement (y compris un token volé).
  tokenVersion: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index de performance pour les recherches et tri par date
userSchema.index({ createdAt: -1 });
userSchema.index({ isAdmin: 1, isSuperAdmin: 1 });

const User = mongoose.model('User', userSchema);
export default User;