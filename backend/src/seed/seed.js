import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const categoriesData = [
  { name: 'Productivité', slug: 'productivite', color: '#7C6CF4' },
  { name: 'Intelligence artificielle', slug: 'intelligence-artificielle', color: '#FFB800' },
  { name: 'Finance', slug: 'finance', color: '#34C77B' },
  { name: 'Design', slug: 'design', color: '#FF6B9D' },
  { name: 'Développement', slug: 'developpement', color: '#3EC1D3' },
  { name: 'Marketing', slug: 'marketing', color: '#FF8A5B' }
];

const productsData = [
  { name: 'Notionly', tagline: 'Ton second cerveau, propulsé par l\'IA', logoUrl: 'https://placehold.co/48', votesCount: 214, categorySlug: 'productivite' },
  { name: 'Flowbase', tagline: 'Automatise tes workflows sans code', logoUrl: 'https://placehold.co/48', votesCount: 187, categorySlug: 'developpement' },
  { name: 'Mailix', tagline: 'Ta boîte mail, enfin intelligente', logoUrl: 'https://placehold.co/48', votesCount: 98, categorySlug: 'marketing' },
  { name: 'PixelSnap', tagline: 'Capture et annote tes écrans en 2 clics', logoUrl: 'https://placehold.co/48', votesCount: 156, categorySlug: 'design' },
  { name: 'Ledgerly', tagline: 'La compta simplifiée pour freelances', logoUrl: 'https://placehold.co/48', votesCount: 132, categorySlug: 'finance' },
  { name: 'Voxa', tagline: 'Transcris tes réunions en temps réel', logoUrl: 'https://placehold.co/48', votesCount: 175, categorySlug: 'intelligence-artificielle' },
  { name: 'Sprintly', tagline: 'Gestion de projet pensée pour les petites équipes', logoUrl: 'https://placehold.co/48', votesCount: 89, categorySlug: 'productivite' },
  { name: 'Formix', tagline: 'Crée des formulaires intelligents sans code', logoUrl: 'https://placehold.co/48', votesCount: 143, categorySlug: 'developpement' },
  { name: 'DataPeek', tagline: 'Visualise tes données en quelques secondes', logoUrl: 'https://placehold.co/48', votesCount: 121, categorySlug: 'intelligence-artificielle' },
  { name: 'CloudNest', tagline: 'Stockage cloud pensé pour les créateurs', logoUrl: 'https://placehold.co/48', votesCount: 167, categorySlug: 'design' }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected — début du seed');

  // 1. Nettoyer les anciennes données de seed
  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log('Anciennes catégories et produits supprimés');

  // 2. Créer (ou réutiliser) un utilisateur "démo" comme maker
  let demoUser = await User.findOne({ email: 'iammuzvn0@gmail.com' });
  if (!demoUser) {
    const hashedPassword = await bcrypt.hash('250505', 10);
    demoUser = await User.create({
      name: 'Muzvn',
      email: 'iammuzvn0@gmail.com',
      password: hashedPassword
    });
    console.log('Utilisateur démo créé');
  } else {
    console.log('Utilisateur démo déjà existant, réutilisé');
  }

  // 3. Insérer les catégories
  const insertedCategories = await Category.insertMany(categoriesData);
  console.log(`${insertedCategories.length} catégories insérées`);

  // 4. Construire un dictionnaire slug -> _id pour relier les produits
  const categoryMap = {};
  insertedCategories.forEach(cat => {
    categoryMap[cat.slug] = cat._id;
  });

  // 5. Insérer les produits, avec les vraies références
  const productsToInsert = productsData.map(p => ({
    name: p.name,
    tagline: p.tagline,
    description: `${p.tagline}. Découvre comment ${p.name} peut t'aider au quotidien.`,
    logoUrl: p.logoUrl,
    websiteUrl: `https://${p.name.toLowerCase()}.example.com`,
    categoryId: categoryMap[p.categorySlug],
    makerId: demoUser._id,
    votesCount: p.votesCount
  }));

  const insertedProducts = await Product.insertMany(productsToInsert);
  console.log(`${insertedProducts.length} produits insérés`);

  console.log('Seed terminé avec succès');
  process.exit(0);
}

seed().catch(error => {
  console.error('Erreur pendant le seed:', error.message);
  process.exit(1);
});