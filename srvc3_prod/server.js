import express from 'express';
import morgan from 'morgan';
// import dotenv from 'dotenv';
import productRoutes from './modules/products/product.routes.js';

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 4003;

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ Status: 'OK', Message: 'Product service' });
});

app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Product service running at http://localhost:${PORT}`);
});