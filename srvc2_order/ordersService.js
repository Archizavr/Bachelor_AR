import express from 'express';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 4002;

// Starpprogrammatūras morgan konfigurēšana pieprasījumu reģistrēšanai
app.use(morgan('dev'));
app.use(express.json());

// Datu piemēri pasūtījumiem

let orders = [
  { id: "1", userId: '1', products: ["1","3"], amount: 1200.00 },
  { id: "2", userId: '1', products: ["2","1"], amount: 25.00 },
  { id: "3", userId: '2', products: ["3","2"], amount: 75.00 },
];

app.get('/', (req, res) => {
  res.json({Status: "OK", Message:"Order service"});
});

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
  const orderId = req.params.id;
  // console.log(orderId)
  const order = orders.find(order => order.id === orderId);
  // console.log(orders.find(ord => ord.id===orderId));

  if (order) {
    return res.json(order);
  }

  res.status(404).json({ message: 'Order not found' });
});

// Jauna pasūtījuma izveide
app.post('/orders', express.json(), (req, res) => {
  let { userId, products, amount } = req.body;
  const orderId = orders.length + 1
  products = products.map(product => typeof product === 'number' ? product.toString() : product);
  const newOrder = {
    id: orderId.toString(),
    userId: userId.toString(),
    products: products,
    amount,
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.put('/orders/:id/product', (req, res) => {
  const orderId = req.params.id;
  const { product } = req.body;
  const productStr = product.toString();
  const orderIndex = orders.findIndex(order => order.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (productStr === undefined || typeof productStr !== 'string') {
    return res.status(400).json({ message: 'Product must be a string' });
  }

  orders[orderIndex].products.push(productStr);
  res.json(orders[orderIndex]);
});

// Citi maršrūti un loģika...
app.listen(PORT, () => {
  console.log(`Order service running on http://localhost:${PORT}`);
});
