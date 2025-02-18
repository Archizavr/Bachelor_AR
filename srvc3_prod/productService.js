const express = require('express')
const app = express()
const PORT = process.env.PORT || 4003

// Datu piemēri pasūtījumiem
let products = [
    { id: "1", productName: 'Laptop'},
    { id: "2", productName: 'Mouse'},
    { id: "3", productName: 'Keyboard'},
];

app.get('/', (req, res) => {
  res.json({Status: "OK", Message:"Product service"});
});

app.get('/products', (req, res) => {
  res.json(products)
})

app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  // Lietotāju saņemšana pēc ID
  const product = products.find(product => product.id === productId)
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Product service running on http://localhost:${PORT}`)
})
