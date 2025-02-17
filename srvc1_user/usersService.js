import express from 'express';
import morgan from 'morgan';
// import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 4001;

// Lietotāju datu inicializācija
const users = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@example.com" }
];

// Starpprogrammatūras morgan konfigurēšana pieprasījumu reģistrēšanai
app.use(morgan('dev')); 
app.use(express.json());

app.get('/', (req, res) => {
  res.json({Status: "OK", Message:"User service"});
});

// Darbības loģika, lai strādātu ar lietotājiem
app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  // Lietotāju saņemšana pēc ID
  const user = users.find(user => user.id === userId)
  res.json(user);
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    const userId = users.length + 1;
    const newUser = { id: userId.toString(), name, email };
    // const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.json(newUser);
});

// Citi maršrūti un loģika...

app.listen(PORT, () => {
  console.log(`User service running on http://localhost:${PORT}`);
});