const express = require('express')
const app = express()
const PORT = 4003

// Datu piemēri pasūtījumiem (būs papildināts)
let products = [
    { id: 1, productName: 'Laptop'},
    { id: 2, productName: 'Mouse'},
    { id: 3, productName: 'Keyboard'},
];

app.get('/', (req, res) => {
  // res.send({"name":"Products here!"})
  res.json(products)
})

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`)
})
