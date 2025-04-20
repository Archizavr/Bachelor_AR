import express from 'express';
import { getOrders, getOrder, postOrder, addProduct } from './order.controller.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', postOrder);
router.put('/:id/product', addProduct);

export default router;