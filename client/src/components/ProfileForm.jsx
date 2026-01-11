import React, { useState, useEffect } from "react";
import { API_BASE } from "../services/api";

export default function ProfileForm({ initialProfile, onSubmit, loading }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [heroBio, setHeroBio] = useState("");
  const [aboutBio, setAboutBio] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [educationSummary, setEducationSummary] = useState("");
  
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newResume, setNewResume] = useState(null);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || "");
      setTitle(initialProfile.title || "");
      setHeroBio(initialProfile.heroBio || "");
      setAboutBio(initialProfile.aboutBio || "");
      setEmail(initialProfile.email || "");
      setLinkedin(initialProfile.linkedin || "");
      setGithub(initialProfile.github || "");
      setTwitter(initialProfile.twitter || "");
      setFacebook(initialProfile.facebook || "");
      setExperienceYears(initialProfile.experienceYears || "");
      setEducationSummary(initialProfile.educationSummary || "");
    }
  }, [initialProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("heroBio", heroBio);
    formData.append("aboutBio", aboutBio);
    formData.append("email", email);
    formData.append("linkedin", linkedin);
    formData.append("github", github);
    formData.append("twitter", twitter);
    formData.append("facebook", facebook);
    formData.append("experienceYears", experienceYears);
    formData.append("educationSummary", educationSummary);

    if (newProfileImage) formData.append("profileImage", newProfileImage);
    if (newResume) formData.append("resume", newResume);

    onSubmit(formData);
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') || path.startsWith('/assets') ? path : `${API_BASE}${path}`;
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Personal Info</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Job Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Hero Bio (Short)</label>
        <textarea rows={2} value={heroBio} onChange={e => setHeroBio(e.target.value)} />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>About Bio (Long)</label>
        <textarea rows={5} value={aboutBio} onChange={e => setAboutBio(e.target.value)} />
      </div>

      <h3 style={{ margin: '1.5rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Stats & Details</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
         <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Experience (e.g. 1+ Year)</label>
            <input value={experienceYears} onChange={e => setExperienceYears(e.target.value)} />
        </div>
        <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Education (Summary)</label>
            <textarea rows={2} value={educationSummary} onChange={e => setEducationSummary(e.target.value)} />
        </div>
      </div>

      <h3 style={{ margin: '1.5rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Social Links</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>LinkedIn URL</label>
          <input value={linkedin} onChange={e => setLinkedin(e.target.value)} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>GitHub URL</label>
          <input value={github} onChange={e => setGithub(e.target.value)} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Twitter URL</label>
          <input value={twitter} onChange={e => setTwitter(e.target.value)} />
        </div>
        <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Facebook URL</label>
            <input value={facebook} onChange={e => setFacebook(e.target.value)} />
        </div>
      </div>

      <h3 style={{ margin: '1.5rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Media</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Profile Image</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {initialProfile?.profileImage && (
                <img 
                    src={getImageUrl(initialProfile.profileImage)} 
                    alt="Current" 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
                />
            )}
            <input type="file" accept="image/*" onChange={e => setNewProfileImage(e.target.files[0])} />
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Resume (PDF)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             {initialProfile?.resumeUrl && (
                <a href={getImageUrl(initialProfile.resumeUrl)} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>View Current</a>
             )}
             <input type="file" accept=".pdf" onChange={e => setNewResume(e.target.files[0])} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile Changes"}
        </button>
      </div>
    </form>
  );
}
