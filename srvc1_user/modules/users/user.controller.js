import * as userService from './user.service.js';

const X_API_KEY = process.env.X_API_KEY || 'SendAllProductsToMe';

// Darbības loģika, lai strādātu ar lietotājiem
export const getUsers = async (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 5;
  const username = req.query.username || null;

  try {
    const { users, pageInfo } = await userService.getAllUsers(offset, limit, username);
    res.json({ users, pageInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lietotāju saņemšana pēc ID
export const getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const postUser = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log('Received body start');
  // console.log('Received body:', req.body);
  // console.log('Received body end');
  // console.log('Received data start');
  // console.log('Received data:', { name, email, password });
  // console.log('Received data end');

  if (!name || !email || !password) return res.status(400).json({ error: 'Name, password and email are required' });

  try {
    const user = await userService.createUser(name, email, password);
    // res.header('X_API_KEY', X_API_KEY);
    if (process.env.X_API_KEY) {
      console.log('X_API_KEY is defined in environment variables:', X_API_KEY);
      res.header('X_API_KEY', X_API_KEY);
    }
    else {
      console.log('X_API_KEY is not defined in environment variables');
    }

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await userService.authenticateUser(email, password);
    if (user) {
      // res.header('X_API_KEY', X_API_KEY);
      if (process.env.X_API_KEY) {
        console.log('X_API_KEY is defined in environment variables:', X_API_KEY);
        res.header('X_API_KEY', X_API_KEY);
      }
      else {
        console.log('X_API_KEY is not defined in environment variables');
      }
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}