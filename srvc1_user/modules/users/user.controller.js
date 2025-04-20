import * as userService from './user.service.js';

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
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, password and email are required' });

  try {
    const user = await userService.createUser(name, email, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
