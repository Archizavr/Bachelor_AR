import { pool } from '../../db/client.js';

export const getAllOrders = async (userId, offset = 0, limit = 5) => {
  let orders;
  let totalCount;

  if (userId) {
    const countRes = await pool.query('SELECT COUNT(*) FROM orders WHERE userId = $1', [userId]);
    totalCount = parseInt(countRes.rows[0].count, 10);

    const res = await pool.query(
      'SELECT * FROM orders WHERE userId = $1 ORDER BY id LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    orders = res.rows;
  } else {
    const countRes = await pool.query('SELECT COUNT(*) FROM orders');
    totalCount = parseInt(countRes.rows[0].count, 10);

    const res = await pool.query('SELECT * FROM orders ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    orders = res.rows;  
  }

    // parbaudit nakam lapaspuse
    const startCursor = offset;
    const endCursor = offset + orders.length - 1;
    const hasNextPage = offset + limit < totalCount;
  
    const pageInfo = {
      startCursor,
      endCursor,
      totalCount,
      hasNextPage
    };
  
  return { orders, pageInfo };  
};

export const getOrderById = async (id) => {
  const res = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  return res.rows[0];
};

export const createOrder = async (userId, products, amount) => {
  // console.log('userId'+userId);
  // console.log('products'+products);
  // console.log('amount'+amount);
  const res = await pool.query(
    'INSERT INTO orders (userId, products, amount) VALUES ($1, $2, $3) RETURNING *',
    [userId, products, amount]
  );
  return res.rows[0];
};

export const addProductToOrder = async (orderId, product) => {
  const res = await pool.query(
    'UPDATE orders SET products = array_append(products, $1) WHERE id = $2 RETURNING *',
    [product, orderId]
  );
  return res.rows[0];
};