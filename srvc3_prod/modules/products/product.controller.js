import * as productService from './product.service.js';

const X_API_KEY = process.env.X_API_KEY || 'SendAllProductsToMe';

export const getProducts = async (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 5;
  const name = req.query.name || null;

  try {
    const { products, pageInfo } = await productService.getAllProducts(offset, limit, name);

    if (process.env.X_API_KEY) {
      console.log('X_API_KEY is defined in environment variables:', X_API_KEY);
      res.header('X_API_KEY', X_API_KEY);
    }
    else {
      console.log('X_API_KEY is not defined in environment variables');
    }

    res.json({ products, pageInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProduct = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};