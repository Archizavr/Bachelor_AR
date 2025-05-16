import * as productService from './product.service.js';

export const getProducts = async (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 5;
  const name = req.query.name || null;

  try {
    const { products, pageInfo } = await productService.getAllProducts(offset, limit, name);
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