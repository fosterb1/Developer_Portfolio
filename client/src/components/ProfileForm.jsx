import React, { useEffect, useState } from 'react';
import { API_BASE, request } from '../services/api';
import { useAuth } from '../state/AuthContext';

const MAX_HERO_VIDEO_SIZE = 50 * 1024 * 1024;

export default function ProfileForm({ initialProfile, onSubmit, loading }) {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [heroBio, setHeroBio] = useState('');
  const [aboutBio, setAboutBio] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [educationSummary, setEducationSummary] = useState('');
  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newResume, setNewResume] = useState(null);
  const [newHeroVideo, setNewHeroVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [videoError, setVideoError] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initialProfile) return;
    setName(initialProfile.name || '');
    setTitle(initialProfile.title || '');
    setHeroBio(initialProfile.heroBio || '');
    setAboutBio(initialProfile.aboutBio || '');
    setEmail(initialProfile.email || '');
    setLinkedin(initialProfile.linkedin || '');
    setGithub(initialProfile.github || '');
    setTwitter(initialProfile.twitter || '');
    setFacebook(initialProfile.facebook || '');
    setExperienceYears(initialProfile.experienceYears || '');
    setEducationSummary(initialProfile.educationSummary || '');
    setHeroVideoUrl(initialProfile.heroVideoUrl || '');
  }, [initialProfile]);

  useEffect(() => {
    if (!newHeroVideo) {
      setVideoPreviewUrl('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(newHeroVideo);
    setVideoPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [newHeroVideo]);

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') || path.startsWith('/assets') ? path : API_BASE + path;
  };

  const uploadHeroVideo = async (file) => {
    const signature = await request('/api/profile/video-signature', { method: 'POST', token });
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('api_key', signature.apiKey);
    uploadData.append('timestamp', String(signature.timestamp));
    uploadData.append('folder', signature.folder);
    uploadData.append('signature', signature.signature);

    const response = await fetch('https://api.cloudinary.com/v1_1/' + encodeURIComponent(signature.cloudName) + '/video/upload', {
      method: 'POST',
      body: uploadData,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.secure_url) {
      throw new Error(result.error?.message || 'The video could not be uploaded. Check your Cloudinary configuration and try again.');
    }
    return result.secure_url;
  };

  const handleVideoFileChange = (event) => {
    setVideoError('');
    const file = event.target.files?.[0] || null;
    if (!file) {
      setNewHeroVideo(null);
      return;
    }
    const hasSupportedType = ['video/mp4', 'video/webm'].includes(file.type) || /\.(mp4|webm)$/i.test(file.name);
    if (!hasSupportedType) {
      setVideoError('Choose an MP4 or WebM video.');
      event.target.value = '';
      setNewHeroVideo(null);
      return;
    }
    if (file.size > MAX_HERO_VIDEO_SIZE) {
      setVideoError('Choose a video smaller than 50 MB.');
      event.target.value = '';
      setNewHeroVideo(null);
      return;
    }
    setNewHeroVideo(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setVideoError('');
    setFormStatus('');
    setSaving(true);

    try {
      let savedVideoUrl = heroVideoUrl.trim();
      if (savedVideoUrl) {
        const parsedVideoUrl = new URL(savedVideoUrl);
        if (parsedVideoUrl.protocol !== 'https:') {
          throw new Error('Use a secure HTTPS link for the hero video.');
        }
      }
      if (newHeroVideo) savedVideoUrl = await uploadHeroVideo(newHeroVideo);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('title', title);
      formData.append('heroBio', heroBio);
      formData.append('aboutBio', aboutBio);
      formData.append('email', email);
      formData.append('linkedin', linkedin);
      formData.append('github', github);
      formData.append('twitter', twitter);
      formData.append('facebook', facebook);
      formData.append('experienceYears', experienceYears);
      formData.append('educationSummary', educationSummary);
      formData.append('heroVideoUrl', savedVideoUrl);
      if (newProfileImage) formData.append('profileImage', newProfileImage);
      if (newResume) formData.append('resume', newResume);

      await onSubmit(formData);
      setNewHeroVideo(null);
      setFormStatus('Profile saved.');
    } catch (error) {
      setVideoError(error.message || 'Unable to save the hero video.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="contact-form profile-form cms-form" onSubmit={handleSubmit}>
      <h3 className="profile-form-heading cms-form-section-title">Personal Info</h3>

      <div className="profile-form-grid cms-form-grid">
        <div className="form-group">
          <label htmlFor="profile-name">Full Name</label>
          <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="profile-title">Job Title</label>
          <input id="profile-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="profile-hero-bio">Hero Bio (Short)</label>
        <textarea id="profile-hero-bio" rows={2} value={heroBio} onChange={(event) => setHeroBio(event.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="profile-about-bio">About Bio (Long)</label>
        <textarea id="profile-about-bio" rows={5} value={aboutBio} onChange={(event) => setAboutBio(event.target.value)} />
      </div>

      <h3 className="profile-form-heading cms-form-section-title">Stats &amp; Details</h3>
      <div className="profile-form-grid cms-form-grid">
        <div className="form-group">
          <label htmlFor="profile-experience">Experience (e.g. 1+ Year)</label>
          <input id="profile-experience" value={experienceYears} onChange={(event) => setExperienceYears(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="profile-education">Education (Summary)</label>
          <textarea id="profile-education" rows={2} value={educationSummary} onChange={(event) => setEducationSummary(event.target.value)} />
        </div>
      </div>

      <h3 className="profile-form-heading cms-form-section-title">Social Links</h3>
      <div className="profile-form-grid cms-form-grid">
        <div className="form-group">
          <label htmlFor="profile-email">Email</label>
          <input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="profile-linkedin">LinkedIn URL</label>
          <input id="profile-linkedin" value={linkedin} onChange={(event) => setLinkedin(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="profile-github">GitHub URL</label>
          <input id="profile-github" value={github} onChange={(event) => setGithub(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="profile-twitter">Twitter URL</label>
          <input id="profile-twitter" value={twitter} onChange={(event) => setTwitter(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="profile-facebook">Facebook URL</label>
          <input id="profile-facebook" value={facebook} onChange={(event) => setFacebook(event.target.value)} />
        </div>
      </div>

      <h3 className="profile-form-heading cms-form-section-title">Media</h3>
      <div className="profile-form-grid profile-media-grid cms-form-grid">
        <div className="form-group">
          <label htmlFor="profile-image">Profile Image</label>
          <div className="profile-media-control">
            {initialProfile?.profileImage && <img src={getImageUrl(initialProfile.profileImage)} alt="Current profile" className="profile-image-preview" />}
            <input id="profile-image" type="file" accept="image/*" onChange={(event) => setNewProfileImage(event.target.files?.[0] || null)} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="profile-resume">Resume (PDF)</label>
          <div className="profile-media-control">
            {initialProfile?.resumeUrl && <a href={getImageUrl(initialProfile.resumeUrl)} target="_blank" rel="noreferrer" className="btn btn-secondary profile-current-link">View Current</a>}
            <input id="profile-resume" type="file" accept=".pdf" onChange={(event) => setNewResume(event.target.files?.[0] || null)} />
          </div>
        </div>
      </div>

      <h3 className="profile-form-heading cms-form-section-title">Hero Background Video</h3>
      <p className="profile-form-help">Paste a direct public HTTPS video URL, or upload an MP4/WebM file (up to 50 MB). A new upload takes priority over the URL. Leave both blank to use the built-in ambient video.</p>
      <div className="form-group">
        <label htmlFor="heroVideoUrl">Video URL</label>
        <input
          id="heroVideoUrl"
          type="url"
          inputMode="url"
          placeholder="https://example.com/your-background-video.mp4"
          value={heroVideoUrl}
          onChange={(event) => setHeroVideoUrl(event.target.value)}
        />
      </div>
      <div className="profile-video-editor">
        <div className="form-group">
          <label htmlFor="heroVideoFile">Upload a replacement video</label>
          <input id="heroVideoFile" type="file" accept="video/mp4,video/webm,.mp4,.webm" onChange={handleVideoFileChange} />
          {newHeroVideo && <span className="profile-form-help">Selected: {newHeroVideo.name} — upload will replace the URL above.</span>}
        </div>
        <div className="profile-video-preview">
          {videoPreviewUrl || heroVideoUrl ? (
            <video src={videoPreviewUrl || heroVideoUrl} controls muted playsInline preload="metadata" aria-label="Hero background video preview" />
          ) : (
            <div className="profile-video-empty">Built-in ambient video is active until you add your own.</div>
          )}
        </div>
      </div>
      {formStatus && <p className="cms-alert cms-alert--success" role="status">{formStatus}</p>}
      {videoError && <p className="profile-video-error cms-alert cms-alert--error" role="alert">{videoError}</p>}

      <div className="profile-form-actions cms-form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading || saving}>
          {saving ? (newHeroVideo ? 'Uploading & saving...' : 'Saving...') : loading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>
    </form>
  );
}
