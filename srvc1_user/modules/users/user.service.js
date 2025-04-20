import { pool } from '../../db/client.js';

// Iegūt lietotājus ar pagination un neobligātu lietotājvārda filtru
export const getAllUsers = async (offset = 0, limit = 5, username = null) => {
  let users;
  let totalCount;

  if (username) {
    // Meklēt pēc lietotājvārda un saskaitīt kopējos rezultātus
    const countRes = await pool.query('SELECT COUNT(*) FROM users WHERE name like $1', [username+'%']);
    totalCount = parseInt(countRes.rows[0].count, 10);

    const res = await pool.query(
      'SELECT id, name, email FROM users WHERE name like $1 ORDER BY id LIMIT $2 OFFSET $3',
      [username+'%', limit, offset]
    );
    users = res.rows;
  } else {
    // Saņemt lietotājus un saskaitīt kopējos rezultātus
    const countRes = await pool.query('SELECT COUNT(*) FROM users');
    totalCount = parseInt(countRes.rows[0].count, 10);

    const res = await pool.query('SELECT id, name, email FROM users ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    users = res.rows;  
  }

  // parbaudit nakam lapaspuse
  const startCursor = offset;
  const endCursor = offset + users.length - 1;
  const hasNextPage = offset + limit < totalCount;

  const pageInfo = {
    startCursor,
    endCursor,
    totalCount,
    hasNextPage
  };

  return { users, pageInfo };
};

export const getUserByName = async (name) => {
  const res = await pool.query('SELECT id, name, email FROM users WHERE name = $1', [name]);
  return res.rows;
};

export const getUserById = async (id) => {
  const res = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
  return res.rows[0];
};

export const createUser = async (name, email, password) => {
  const existingUser = await getUserByName(name);
  if (existingUser.length > 0) {
    throw new Error('User with this name already exists');
  }

  const res = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, password]
  );
  return res.rows[0];
};
    
// Authenticate user (check username and plain text password)
export const authenticateUser = async (name, password) => {
  // Find user by name
  const users = await getUserByName(name);
  if (users.length === 0) {
    throw new Error('User not found');
  }

  const user = users[0];

  // Compare plain text password
  if (user.password !== password) {
    throw new Error('Invalid password');
  }

  return user;
};