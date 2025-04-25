-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100),
    category VARCHAR(100),
    brand VARCHAR(100),
    price DECIMAL(10, 2),
    stock INT,
    rating DECIMAL(3, 2),
    release_date DATE,
    warranty_period VARCHAR(50)
);

-- Insert initial data
INSERT INTO products (id, name, type, category, brand, price, stock, rating, release_date, warranty_period) VALUES
(1, 'Apple iPhone 14 Pro', 'Smartphone', 'Mobile Devices', 'Apple', 999.99, 25, 4.8, '2022-09-16', '1 year'),
(2, 'Samsung Galaxy S23 Ultra', 'Smartphone', 'Mobile Devices', 'Samsung', 1199.99, 30, 4.7, '2023-02-01', '1 year'),
(3, 'Sony WH-1000XM5', 'Headphones', 'Audio Devices', 'Sony', 399.99, 50, 4.6, '2022-05-12', '2 years'),
(4, 'Dell XPS 15', 'Laptop', 'Computers', 'Dell', 1799.99, 10, 4.5, '2022-08-30', '1 year'),
(5, 'Apple MacBook Air M2', 'Laptop', 'Computers', 'Apple', 1249.99, 15, 4.8, '2022-07-15', '1 year'),
(6, 'Logitech MX Master 3S', 'Mouse', 'Accessories', 'Logitech', 99.99, 100, 4.7, '2022-09-12', '1 year'),
(7, 'Samsung Smart Monitor M8', 'Monitor', 'Displays', 'Samsung', 699.99, 20, 4.5, '2022-04-15', '2 years'),
(8, 'Sony PlayStation 5', 'Gaming Console', 'Gaming', 'Sony', 499.99, 40, 4.9, '2020-11-12', '1 year'),
(9, 'Microsoft Xbox Series X', 'Gaming Console', 'Gaming', 'Microsoft', 499.99, 35, 4.8, '2020-11-10', '1 year'),
(10, 'Google Nest Hub (2nd Gen)', 'Smart Display', 'Smart Home', 'Google', 99.99, 70, 4.5, '2021-03-30', '1 year'),
(11, 'Amazon Echo Dot (5th Gen)', 'Smart Speaker', 'Smart Home', 'Amazon', 49.99, 150, 4.6, '2022-10-20', '1 year'),
(12, 'NVIDIA GeForce RTX 4090', 'Graphics Card', 'Computer Components', 'NVIDIA', 1599.99, 10, 4.9, '2022-10-12', '3 years'),
(13, 'Corsair K95 RGB Platinum XT', 'Keyboard', 'Accessories', 'Corsair', 199.99, 50, 4.7, '2020-01-06', '2 years'),
(14, 'HP Envy Inspire 7955e', 'Printer', 'Office Equipment', 'HP', 249.99, 20, 4.4, '2022-05-01', '1 year'),
(15, 'Fitbit Charge 5', 'Fitness Tracker', 'Wearable Devices', 'Fitbit', 149.99, 60, 4.6, '2021-09-27', '1 year'),
(16, 'Apple Watch Series 8', 'Smartwatch', 'Wearable Devices', 'Apple', 399.99, 30, 4.8, '2022-09-16', '1 year'),
(17, 'DJI Mini 3 Pro', 'Drone', 'Cameras', 'DJI', 759.99, 15, 4.7, '2022-05-10', '1 year'),
(18, 'GoPro HERO11 Black', 'Action Camera', 'Cameras', 'GoPro', 499.99, 25, 4.6, '2022-09-14', '1 year'),
(19, 'ASUS ROG Swift PG32UQX', 'Monitor', 'Displays', 'ASUS', 2999.99, 5, 4.9, '2021-06-01', '3 years'),
(20, 'Anker PowerCore III Elite 26K', 'Power Bank', 'Accessories', 'Anker', 159.99, 80, 4.6, '2022-03-15', '1.5 years');
