import express from 'express';
import morgan from 'morgan';

const app = express();
const PORT = 4002;

// Starpprogrammatūras morgan konfigurēšana pieprasījumu reģistrēšanai
app.use(morgan('dev'));
app.use(express.json());

// Datu piemēri pasūtījumiem

let orders = [
  { id: 1, userId: '1', products: 'Laptop', amount: 1200.00 },
  { id: 2, userId: '1', products: 'Mouse', amount: 25.00 },
  { id: 3, userId: '2', products: 'Keyboard', amount: 75.00 },
];

// let orders = [
//   { id: 1, userId: '1', products: [1,3], amount: 1200.00 },
//   { id: 2, userId: '1', products: [{prodId: 2},{}], amount: 25.00 },
//   { id: 3, userId: '2', products: {prodId: 3}, amount: 75.00 },
// ];

// Visu pasūtījumu saņemšana
app.get('/orders', (req, res) => {
    const { userId } = req.query;
  
    if (userId !== undefined && userId !== null) {
        const userOrders = orders.filter(order => order.userId == userId);
        // visu Users orders
        res.json(userOrders);
    } else {
        // visi orders
        res.json(orders);
    }
});

// Pasūtījuma saņemšana pēc ID
app.get('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  console.log(orderId)
  const order = orders.find(order => order.id === orderId);
  console.log(orders.find(ord => ord.id===orderId));

  if (order) {
    return res.json(order);
  }

  res.status(404).json({ message: 'Order not found' });
});

// Jauna pasūtījuma izveide
app.post('/orders', express.json(), (req, res) => {
  const { userId, products, amount } = req.body;
  const newOrder = {
    id: orders.length + 1,
    userId,
    products,
    amount,
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Citi maršrūti un loģika...

app.listen(PORT, () => {
  console.log(`Order service running on http://localhost:${PORT}`);
});
