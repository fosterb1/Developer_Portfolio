import React from 'react';
import { useProfile } from '../state/ProfileContext';
import { API_BASE } from '../services/api';

const Hero = () => {
  const { profile } = useProfile();

  if (!profile) return null;

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') || path.startsWith('/assets') ? path : `${API_BASE}${path}`;
  };

  const fullName = profile.name || "Foster Boadi";
  const names = fullName.split(' ');
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <p className="greeting">Hello, I'm</p>
            <h1 className="hero-title">{firstName} <span className="highlight">{lastName}</span></h1>
            <p className="hero-subtitle">{profile.title}</p>
            <p className="hero-description">{profile.heroBio}</p>
            
            <div className="btn-container">
              {profile.resumeUrl && (
                <button className="btn btn-primary" onClick={() => window.open(getImageUrl(profile.resumeUrl))}>
                    <i className="fas fa-download"></i> Download CV
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                <i className="fas fa-envelope"></i> Contact Me
              </button>
            </div>
            
            <div className="social-links">
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" aria-label="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" aria-label="GitHub">
                    <i className="fab fa-github"></i>
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                </a>
              )}
              {profile.facebook && (
                <a href={profile.facebook} target="_blank" aria-label="Facebook">
                    <i className="fab fa-facebook"></i>
                </a>
              )}
            </div>
          </div>
          
          <div className="hero-image">
            <div className="image-container">
              <img 
                src={profile.profileImage ? getImageUrl(profile.profileImage) : "/assets/foster.jpg"} 
                alt={`${fullName} - ${profile.title}`} 
                className="profile-image" 
              />
              <div className="image-frame"></div>
            </div>
          </div>
        </div>
      </div>
      
      <a href="#about" className="scroll-down" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }}>
        <i className="fas fa-chevron-down"></i>
      </a>
    </section>
  );
};

export default Hero;