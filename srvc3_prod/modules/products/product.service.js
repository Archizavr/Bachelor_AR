import { pool } from '../../db/client.js';

export const getAllProducts = async (offset = 0, limit = 5, name = null) => {
  let products;
  let totalCount;

  if (name) {
    const countRes = await pool.query('SELECT COUNT(*) FROM products WHERE name like $1', [name+'%']);
    totalCount = parseInt(countRes.rows[0].count, 10);

    const res = await pool.query(
      'SELECT * FROM products WHERE name like $1 ORDER BY id LIMIT $2 OFFSET $3',
      [name+'%', limit, offset]
    );
    products = res.rows;
  }
  else {
    const countRes = await pool.query('SELECT COUNT(*) FROM products');
    totalCount = parseInt(countRes.rows[0].count, 10);

    const res = await pool.query('SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    products = res.rows;  
  }

  // parbaudit nakam lapaspuse
  const startCursor = offset;
  const endCursor = offset + products.length - 1;
  const hasNextPage = offset + limit < totalCount;

  const pageInfo = {
    startCursor,
    endCursor,
    totalCount,
    hasNextPage
  };

  return { products, pageInfo };
};

export const getProductById = async (id) => {
  const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return res.rows[0];
};
