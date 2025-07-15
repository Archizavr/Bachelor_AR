import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // phone: '',
    // dateOfBirth: '',
    // gender: '',
    // agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      axios.get('http://localhost:4001/auth', {email: formData.email, password: formData.password})
      .then(response => { 
    //     // console.log(response); 
    //     // console.log(response.headers);
    //     // console.log(response.headers.get('X_API_KEY'));

        const receivedApiKey = response.headers.get('X_API_KEY');
        if (receivedApiKey) {
          setApiKey(receivedApiKey);
          console.log('Получен X_API_KEY:', receivedApiKey);
        } else {
          console.log('X_API_KEY не пришёл');
        }
      })
      .catch(error => { console.error('There was an error!', error); });     
      // Here you would typically send the data to your backend
      console.log('User data:', formData);
      
      // Reset form
      setFormData({
        email: '',
        password: ''
      });
      
      alert('Registration successful!');
      onClose();
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h2>Login</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Create a password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Logining to Account...' : 'Login'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;