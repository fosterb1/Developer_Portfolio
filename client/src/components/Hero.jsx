import React, { useEffect, useState } from 'react';
import { useProfile } from '../state/ProfileContext';
import { API_BASE } from '../services/api';

const DEFAULT_HERO_VIDEO_URL = 'https://cdn.pixabay.com/video/2022/12/28/144590-785095798_large.mp4';
const DEFAULT_HERO_VIDEO_POSTER = 'https://cdn.pixabay.com/video/2022/12/28/144590-785095798_tiny.jpg';

const Hero = () => {
  const { profile } = useProfile();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.('change', updatePreference);
    return () => mediaQuery.removeEventListener?.('change', updatePreference);
  }, []);

  const videoUrl = profile?.heroVideoUrl || DEFAULT_HERO_VIDEO_URL;
  useEffect(() => setVideoFailed(false), [videoUrl]);

  if (!profile) return null;

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') || path.startsWith('/assets') ? path : API_BASE + path;
  };

  const fullName = profile.name || 'Foster Boadi';
  const names = fullName.split(' ');
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');

  return (
    <section id="home" className="hero-section">
      {!prefersReducedMotion && !videoFailed && (
        <div className="hero-video-layer" aria-hidden="true">
          <video
            key={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={DEFAULT_HERO_VIDEO_POSTER}
            onError={() => setVideoFailed(true)}
            tabIndex={-1}
            aria-hidden="true"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <p className="greeting">Hello, I'm</p>
            <h1 className="hero-title">{firstName} <span className="highlight">{lastName}</span></h1>
            <p className="hero-subtitle">{profile.title}</p>
            <p className="hero-description">{profile.heroBio}</p>

            <div className="btn-container">
              {profile.resumeUrl && (
                <button className="btn btn-primary" onClick={() => window.open(getImageUrl(profile.resumeUrl), '_blank', 'noopener,noreferrer')}>
                  <i className="fas fa-download"></i> Download CV
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                <i className="fas fa-envelope"></i> Contact Me
              </button>
            </div>

            <div className="social-links">
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>}
              {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>}
              {profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>}
              {profile.facebook && <a href={profile.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook"></i></a>}
            </div>
          </div>

          <div className="hero-image">
            <div className="image-container">
              <img
                src={profile.profileImage ? getImageUrl(profile.profileImage) : '/assets/foster.jpg'}
                alt={fullName + ' - ' + profile.title}
                className="profile-image"
              />
              <div className="image-frame"></div>
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className="scroll-down" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>
        <i className="fas fa-chevron-down"></i>
      </a>
    </section>
  );
};

export default Hero;
