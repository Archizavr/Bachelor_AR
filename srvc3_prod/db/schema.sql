-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Insert initial data
INSERT INTO products (id, name)
VALUES
  (1, 'Laptop'),
  (2, 'Mouse'),
  (3, 'Keyboard');