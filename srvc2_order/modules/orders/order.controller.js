import * as orderService from './order.service.js';

export const getOrders = async (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 5;
  const userId = req.query.userId || null;

  try {
    const { orders, pageInfo } = await orderService.getAllOrders(userId, offset, limit);
    res.json({ orders, pageInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrder = async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};

export const postOrder = async (req, res) => {
  const { userId, products, amount } = req.body;
  if (!userId || !products || !amount) {
    return res.status(400).json({ error: 'UserId, products, and amount are required' });
  }
  const order = await orderService.createOrder(userId, products, amount);
  res.status(201).json(order);
};

export const addProduct = async (req, res) => {
  const { product } = req.body;
  const orderId = req.params.id;
  if (!product) return res.status(400).json({ error: 'Product is required' });

  const updatedOrder = await orderService.addProductToOrder(orderId, product);
  if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
  res.json(updatedOrder);
};