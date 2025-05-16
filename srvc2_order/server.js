import express from 'express';
import morgan from 'morgan';
// import dotenv from 'dotenv';
import orderRoutes from './modules/orders/order.routes.js';

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ Status: 'OK', Message: 'Order service' });
});

app.use('/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Order service running at http://localhost:${PORT}`);
});
