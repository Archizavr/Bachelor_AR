import { getUserByName, getUserByEmail } from '../users/user.service.js';

const X_API_KEY = process.env.X_API_KEY || 'SendAllProductsToMe';

// Authenticates a user with email and password

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {

    const users = await getUserByEmail(email);
    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];

    // Compare plain text password
    if (user.password !== password) {
      throw new Error('Invalid password');
    }

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