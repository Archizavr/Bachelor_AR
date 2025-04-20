-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  userId VARCHAR(100) NOT NULL,
  products TEXT[] NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);

INSERT INTO orders (id, userId, products, amount)
VALUES
  (1, '1', ARRAY['1', '3'], 1200.00),
  (2, '1', ARRAY['2', '1'], 25.00),
  (3, '2', ARRAY['3', '2'], 75.00);


CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    price NUMERIC(10, 2),
    amount NUMERIC(10, 2)
);

