import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '../state/ProfileContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  // Check if we need to scroll after navigation
  React.useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Use name from profile or fallback
  const fullName = profile?.name || "Foster Boadi";
  const names = fullName.split(' ');
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');

  return (
    <header>
      <nav id="desktop-nav">
        <div className="logo">{firstName}<span>{lastName}</span></div>
        <div>
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
            <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
            <li><a href="#experience" onClick={(e) => handleNavClick(e, 'experience')}>Experience</a></li>
            <li><a href="#projects" onClick={(e) => handleNavClick(e, 'projects')}>Projects</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
          </ul>
        </div>
      </nav>
      
      <nav id="hamburger-nav">
        <div className="logo">{firstName}<span>{lastName}</span></div>
        <div className="hamburger-menu">
          <button 
            className={`hamburger-icon ${isOpen ? 'open' : ''}`} 
            onClick={toggleMenu} 
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`menu-links ${isOpen ? 'open' : ''}`}>
            <ul>
              <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
              <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
              <li><a href="#experience" onClick={(e) => handleNavClick(e, 'experience')}>Experience</a></li>
              <li><a href="#projects" onClick={(e) => handleNavClick(e, 'projects')}>Projects</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;