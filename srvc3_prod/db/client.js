import pkg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PRODUCT_PGHOST || 'localhost',
  user: process.env.PRODUCT_PGUSER || 'postgres',
  password: process.env.PRODUCT_PGPASSWORD || 'postgres',
  database: process.env.PRODUCT_PGDATABASE || 'product_db',
  port: process.env.PRODUCT_PGPORT || 5443
});
