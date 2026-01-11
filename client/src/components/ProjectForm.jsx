import React, { useEffect, useState } from "react";
import { API_BASE } from "../services/api";

const normalizeStack = (value) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export default function ProjectForm({
  initialProject,
  onSubmit,
  submitLabel = "Save Project",
  loading,
  onCancel
}) {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [newImages, setNewImages] = useState([]);
  const [keptImages, setKeptImages] = useState([]);

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title || "");
      setShortDescription(initialProject.shortDescription || "");
      setFullDescription(initialProject.fullDescription || "");
      setTechStackInput(initialProject.techStack?.join(", ") || "");
      setRepoUrl(initialProject.repoUrl || "");
      setLiveUrl(initialProject.liveUrl || "");
      setPublished(Boolean(initialProject.published));
      setKeptImages(initialProject.images || []);
    } else {
        // Reset for new project
        setTitle("");
        setShortDescription("");
        setFullDescription("");
        setTechStackInput("");
        setRepoUrl("");
        setLiveUrl("");
        setPublished(true);
        setKeptImages([]);
        setNewImages([]);
    }
  }, [initialProject]);

  const handleFileChange = (event) => {
    setNewImages(Array.from(event.target.files || []));
  };

  const toggleImage = (img) => {
    setKeptImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);
    formData.append(
      "techStack",
      JSON.stringify(normalizeStack(techStackInput))
    );
    formData.append("repoUrl", repoUrl);
    formData.append("liveUrl", liveUrl);
    formData.append("published", String(published));
    formData.append("existingImages", JSON.stringify(keptImages));
    newImages.forEach((file) => formData.append("images", file));
    await onSubmit(formData);
    // Only reset if it's a new project (initialProject is null) to avoid clearing while editing on error
    if (!initialProject) {
        setNewImages([]);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tech Stack (comma separated)</label>
        <input
          type="text"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
          placeholder="React, Node.js, PostgreSQL"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>GitHub Link</label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Live Demo Link</label>
          <input
            type="text"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Short Description</label>
        <textarea
          rows={3}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Concise pitch"
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Description (Markdown)</label>
        <textarea
          rows={8}
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          placeholder="Add details, challenges, outcomes..."
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ padding: '0.5rem' }}
        />
        {newImages.length > 0 && (
          <p style={{ fontSize: '0.9rem', color: 'var(--primary-color)', marginTop: '0.5rem' }}>Queued: {newImages.length} file(s)</p>
        )}
      </div>

      <div className="form-group" style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          style={{ width: 'auto' }}
        />
        <label style={{ cursor: 'pointer' }}>Published (Visible to visitors)</label>
      </div>

      {initialProject?.images?.length > 0 && (
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Existing Images</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {initialProject.images.map((img) => (
              <div 
                key={img} 
                onClick={() => toggleImage(img)}
                style={{ 
                    position: 'relative', 
                    cursor: 'pointer', 
                    border: keptImages.includes(img) ? '2px solid var(--success-color)' : '2px solid #ef4444',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    opacity: keptImages.includes(img) ? 1 : 0.6
                }}
              >
                <img 
                    src={img.startsWith('http') ? img : `${API_BASE}${img}`} 
                    alt="preview" 
                    style={{ height: '60px', width: 'auto', display: 'block' }} 
                />
                <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    background: 'rgba(0,0,0,0.7)', 
                    color: 'white', 
                    fontSize: '0.7rem', 
                    textAlign: 'center' 
                }}>
                    {keptImages.includes(img) ? 'Keep' : 'Drop'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: '1rem' }}>
        {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
            </button>
        )}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}