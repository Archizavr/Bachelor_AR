import pkg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.USER_PGHOST || 'localhost',
  user: process.env.USER_PGUSER || 'postgres',
  password: process.env.USER_PGPASSWORD || 'postgres',
  database: process.env.USER_PGDATABASE || 'user_db',
  port: process.env.USER_PGPORT || 5441
});
