import React from 'react';
import { useProfile } from '../state/ProfileContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { profile } = useProfile();

  if (!profile) return null;

  const fullName = profile.name || "Foster Boadi";
  const names = fullName.split(' ');
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>{firstName}<span>{lastName}</span></h2>
            <p>{profile.title}</p>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-social">
            <h3>Connect With Me</h3>
            <div className="social-icons">
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
              {profile.email && (
                <a href={`mailto:${profile.email}`} aria-label="Email">
                    <i className="fas fa-envelope"></i>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} {fullName}. All rights reserved.</p>
          <p>Designed & Developed with <i className="fas fa-heart"></i> by {firstName}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;