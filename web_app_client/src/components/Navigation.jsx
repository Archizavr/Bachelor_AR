import React, { useState } from 'react';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navStyles = {
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: '0 20px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      textDecoration: 'none',
    },
    navLinks: {
      display: 'flex',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      gap: '30px',
    },
    navLink: {
      color: '#333',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: '500',
      padding: '8px 16px',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
    },
    navLinkActive: {
      backgroundColor: '#007bff',
      color: '#ffffff',
    },
    navLinkHover: {
      backgroundColor: '#f0f0f0',
      color: '#007bff',
    },
    hamburger: {
      display: 'none',
      flexDirection: 'column',
      cursor: 'pointer',
      padding: '5px',
      backgroundColor: 'transparent',
      border: 'none',
    },
    hamburgerLine: {
      width: '25px',
      height: '3px',
      backgroundColor: '#333',
      margin: '2px 0',
      transition: '0.3s',
    },
    mobileMenu: {
      display: 'none',
      position: 'absolute',
      top: '60px',
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '20px',
    },
    mobileMenuOpen: {
      display: 'block',
    },
    mobileNavLinks: {
      display: 'flex',
      flexDirection: 'column',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      gap: '15px',
    },
    mobileNavLink: {
      color: '#333',
      textDecoration: 'none',
      fontSize: '18px',
      fontWeight: '500',
      padding: '10px 0',
      borderBottom: '1px solid #eee',
    },
    mobileNavLinkActive: {
      color: '#007bff',
      fontWeight: 'bold',
      borderBottom: '2px solid #007bff',
    },
    // Media queries simulation through JS
    '@media (max-width: 768px)': {
      navLinks: {
        display: 'none',
      },
      hamburger: {
        display: 'flex',
      },
    }
  };

  // Simple media query hook
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle navigation click
  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  const getLinkStyle = (section) => {
    const baseStyle = navStyles.navLink;
    const isActive = activeSection === section;
    
    if (isActive) {
      return { ...baseStyle, ...navStyles.navLinkActive };
    }
    return baseStyle;
  };

  const getMobileLinkStyle = (section) => {
    const baseStyle = navStyles.mobileNavLink;
    const isActive = activeSection === section;
    
    if (isActive) {
      return { ...baseStyle, ...navStyles.mobileNavLinkActive };
    }
    return baseStyle;
  };

  return (
    <>
      <nav style={navStyles.navbar}>
        <div style={navStyles.container}>
          {/* Logo Section */}
          <a href="#home" style={navStyles.logo}>
            YourLogo
          </a>

          {/* Desktop Navigation Links */}
          <ul style={{...navStyles.navLinks, display: isMobile ? 'none' : 'flex'}}>
            <li>
              <a 
                href="#home" 
                style={getLinkStyle('home')}
                onClick={() => handleNavClick('home')}
                onMouseEnter={(e) => {
                  if (activeSection !== 'home') {
                    Object.assign(e.target.style, navStyles.navLinkHover);
                  }
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, getLinkStyle('home'));
                }}
              >
                🏠 Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                style={getLinkStyle('about')}
                onClick={() => handleNavClick('about')}
                onMouseEnter={(e) => {
                  if (activeSection !== 'about') {
                    Object.assign(e.target.style, navStyles.navLinkHover);
                  }
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, getLinkStyle('about'));
                }}
              >
                👤 About
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                style={getLinkStyle('contact')}
                onClick={() => handleNavClick('contact')}
                onMouseEnter={(e) => {
                  if (activeSection !== 'contact') {
                    Object.assign(e.target.style, navStyles.navLinkHover);
                  }
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, getLinkStyle('contact'));
                }}
              >
                📧 Contact
              </a>
            </li>
          </ul>

          {/* Mobile Hamburger Menu */}
          <button 
            style={{...navStyles.hamburger, display: isMobile ? 'flex' : 'none'}}
            onClick={toggleMenu}
          >
            <div style={navStyles.hamburgerLine}></div>
            <div style={navStyles.hamburgerLine}></div>
            <div style={navStyles.hamburgerLine}></div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && (
          <div style={{...navStyles.mobileMenu, display: isMenuOpen ? 'block' : 'none'}}>
            <ul style={navStyles.mobileNavLinks}>
              <li>
                <a 
                  href="#home" 
                  style={getMobileLinkStyle('home')}
                  onClick={() => {
                    handleNavClick('home');
                    toggleMenu();
                  }}
                >
                  🏠 Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  style={getMobileLinkStyle('about')}
                  onClick={() => {
                    handleNavClick('about');
                    toggleMenu();
                  }}
                >
                  👤 About
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  style={getMobileLinkStyle('contact')}
                  onClick={() => {
                    handleNavClick('contact');
                    toggleMenu();
                  }}
                >
                  📧 Contact
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
      
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{height: '60px'}}></div>
      
      {/* Demo content to show the navbar in action */}
      <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
        <section id="home" style={{minHeight: '500px', padding: '40px 0'}}>
          <h1 style={{fontSize: '32px', marginBottom: '20px', color: '#333'}}>Home Section</h1>
          <p style={{fontSize: '16px', lineHeight: '1.6', color: '#666'}}>
            Welcome to our website! This navigation bar is fixed at the top and uses only default React features.
            No external dependencies required - just React's built-in useState and useEffect hooks.
          </p>
        </section>
        
        <section id="about" style={{minHeight: '500px', padding: '40px 0', backgroundColor: '#f8f9fa'}}>
          <h1 style={{fontSize: '32px', marginBottom: '20px', color: '#333'}}>About Section</h1>
          <p style={{fontSize: '16px', lineHeight: '1.6', color: '#666'}}>
            This section demonstrates how the navigation bar stays visible at the top of the page.
            The navbar is responsive and includes a mobile hamburger menu for smaller screens.
          </p>
        </section>
        
        <section id="contact" style={{minHeight: '500px', padding: '40px 0'}}>
          <h1 style={{fontSize: '32px', marginBottom: '20px', color: '#333'}}>Contact Section</h1>
          <p style={{fontSize: '16px', lineHeight: '1.6', color: '#666'}}>
            Get in touch with us! The navigation links smoothly scroll to different sections,
            and the mobile menu automatically closes when you select a link.
          </p>
        </section>
      </div>
    </>
  );
};

export default NavigationBar;