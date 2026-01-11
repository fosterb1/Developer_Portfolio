import React, { useState } from 'react';
import { useProfile } from '../state/ProfileContext';
import { request } from '../services/api';

const Contact = () => {
  const { profile } = useProfile();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await request('/api/contact', {
        method: 'POST',
        data: formData
      });
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to send message.' });
    } finally {
      setLoading(false);
    }
  };

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
          
          <form className="contact-form" onSubmit={handleSubmit}>
            {status.message && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1rem', 
                backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: status.type === 'success' ? '#15803d' : '#b91c1c'
              }}>
                {status.message}
              </div>
            )}
            <div className="form-group">
              <input 
                name="name"
                type="text" 
                placeholder="Your Name" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input 
                name="email"
                type="email" 
                placeholder="Your Email" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <textarea 
                name="message"
                placeholder="Your Message" 
                rows="5" 
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <i className="fas fa-paper-plane"></i> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;