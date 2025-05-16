import pkg from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.ORDER_PGHOST || 'localhost',
  user: process.env.ORDER_PGUSER || 'postgres',
  password: process.env.ORDER_PGPASSWORD || 'postgres',
  database: process.env.ORDER_PGDATABASE || 'order_db',
  port: process.env.ORDER_PGPORT || 5442
});
