import React from 'react';
import { useProfile } from '../state/ProfileContext';

const Contact = () => {
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Get In Touch</p>
          <h2 className="section-title">Contact Me</h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <p>{profile.email}</p>
              <a href={`mailto:${profile.email}`} className="contact-link">Send Message</a>
            </div>
            
            {profile.linkedin && (
                <div className="contact-card">
                <div className="contact-icon">
                    <i className="fab fa-linkedin"></i>
                </div>
                <h3>LinkedIn</h3>
                <p>Connect professionally</p>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-link">Visit Profile</a>
                </div>
            )}
            
            {profile.github && (
                <div className="contact-card">
                <div className="contact-icon">
                    <i className="fab fa-github"></i>
                </div>
                <h3>GitHub</h3>
                <p>View my projects</p>
                <a href={profile.github} target="_blank" rel="noreferrer" className="contact-link">Browse Code</a>
                </div>
            )}
          </div>
          
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-paper-plane"></i> Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;