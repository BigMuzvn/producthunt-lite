import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import categoryRoutes from './src/routes/category.routes.js';
import productRoutes from './src/routes/product.routes.js';
import utilRoutes from './src/routes/util.routes.js';
import adminRoutes from './src/routes/admin.routes.js';


dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'phclone-lite API is running' });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.use('/api/utils', utilRoutes);

app.use('/api/admin', adminRoutes);