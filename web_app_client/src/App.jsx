import React, { useState } from 'react';
import NavigationBar from './components/NavigationBar';
import ProductsContent from './components/ProductsContent';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import './App.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  }

  const handleRegistrationClick = () => {
    setIsRegistrationOpen(true);
  };

  const handleRegistrationClose = () => {
    setIsRegistrationOpen(false);
  };

  return (
    <div className="app">
      <NavigationBar 
        onSectionChange={handleSectionChange} 
        onRegistrationClick={handleRegistrationClick}
        onLoginClick={handleLoginClick}
      />
      <ProductsContent activeSection={activeSection} />
      <RegistrationForm 
        isOpen={isRegistrationOpen} 
        onClose={handleRegistrationClose} 
      />
      <LoginForm 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
};

export default App;