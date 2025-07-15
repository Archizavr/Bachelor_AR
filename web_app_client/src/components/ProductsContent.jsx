import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductsContent.css';

const ProductsContent = ({ activeSection }) => {
  const [dataJSON, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const onBuyClick = () => {
    console.log('Buy button clicked');
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4003/products');
        setData(response.data);
        setLoading(false);
        console.log('Data fetched successfully:', response.data);
        // console.log(response.headers.get('X_API_KEY'));

        const receivedApiKey = response.headers.get('X_API_KEY');
        if (receivedApiKey) {
          setApiKey(receivedApiKey);
          // console.log('Получен X_API_KEY:', receivedApiKey);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || error.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!dataJSON) return <div className="no-data">No data available</div>;

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <section id="home" className="content-section">
            <h1 className="section-title">Products</h1>
            <div className="products-container">
              <ul className="products-list">
                {dataJSON.products.map(product => (
                  <li key={product.id} className="product-item">
                    <span className="product-name">{product.name}</span>
                    <span className="product-price">Price: ${product.price}</span>
                    <div><button className="buy-button" onClick={onBuyClick}>Buy</button></div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      
      case 'about':
        return (
          <section id="about" className="content-section">
            <h1 className="section-title">About Us</h1>
            <div className="content-text">
              <p>Welcome to our company! We are dedicated to providing high-quality products and excellent customer service.</p>
              <p>Our team has years of experience in the industry and we're committed to meeting your needs.</p>
            </div>
          </section>
        );
      
      case 'contact':
        return (
          <section id="contact" className="content-section">
            <h1 className="section-title">Contact Us</h1>
            <div className="content-text">
              <p>Get in touch with us!</p>
              <div className="contact-info">
                <p><strong>Email:</strong> info@yourcompany.com</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Main Street, City, State 12345</p>
              </div>
            </div>
          </section>
        );
      
      default:
        return (
          <section className="content-section">
            <h1 className="section-title">Welcome</h1>
            <div className="content-text">
              <p>Please select a section from the navigation menu.</p>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="content-container">
      {renderContent()}
    </div>
  );
};

export default ProductsContent;