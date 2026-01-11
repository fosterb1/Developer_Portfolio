import React from 'react';
import { useProfile } from '../state/ProfileContext';
import { API_BASE } from '../services/api';

const About = () => {
  const { profile } = useProfile();

  if (!profile) return null;

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') || path.startsWith('/assets') ? path : `${API_BASE}${path}`;
  };

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Get To Know More</p>
          <h2 className="section-title">About Me</h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="about-content">
          <div className="about-image">
            <img src="/assets/about-pic.png" alt="Working illustration" className="about-pic" />
          </div>
          
          <div className="about-info">
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h3>Experience</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{profile.experienceYears}</p>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3>Education</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{profile.educationSummary}</p>
              </div>
            </div>
            
            <div className="about-text">
              {profile.aboutBio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;