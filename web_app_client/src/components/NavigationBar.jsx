import React, { useState, useEffect } from 'react';
import './NavigationBar.css';

const NavigationBar = ({ onSectionChange, onRegistrationClick, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const navItems = [
    { id: 'home', label: 'Products', href: '#home' },
    { id: 'about', label: '👤 About', href: '#about' },
    { id: 'contact', label: '📧 Contact', href: '#contact' }
  ];

  return (
    <>
      <nav className="navbar">
        <div className="container">
          {/* Logo Section */}
          <a href="#home" className="logo">
            YourLogo
          </a>

          {/* Desktop Navigation Links */}
          <ul className={`nav-links ${isMobile ? 'mobile-hidden' : ''}`}>
            {navItems.map(item => (
              <li key={item.id}>
                <a 
                  href={item.href}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Registration Button */}
          <div id="new-user-button">
            <button className="nav-buttons" onClick={onRegistrationClick}>
              Registration
            </button>
          </div>
          <div id="login-button">
            <button className="nav-buttons" onClick={onLoginClick}>
              Login
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <button 
            className={`hamburger ${isMobile ? '' : 'desktop-hidden'}`}
            onClick={toggleMenu}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && (
          <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <ul className="mobile-nav-links">
              {navItems.map(item => (
                <li key={item.id}>
                  <a 
                    href={item.href}
                    className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => {
                      handleNavClick(item.id);
                      toggleMenu();
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
      
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="navbar-spacer"></div>
    </>
  );
};

export default NavigationBar;