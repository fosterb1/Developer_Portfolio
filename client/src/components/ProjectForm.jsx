import React, { useState } from 'react';
import { API_BASE } from '../services/api';

const normalizeStack = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

export default function ProjectForm({ initialProject, onSubmit, submitLabel = 'Save project', loading = false, onCancel }) {
  const [title, setTitle] = useState(initialProject?.title || '');
  const [shortDescription, setShortDescription] = useState(initialProject?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(initialProject?.fullDescription || '');
  const [techStackInput, setTechStackInput] = useState(initialProject?.techStack?.join(', ') || '');
  const [repoUrl, setRepoUrl] = useState(initialProject?.repoUrl || '');
  const [liveUrl, setLiveUrl] = useState(initialProject?.liveUrl || '');
  const [published, setPublished] = useState(initialProject ? Boolean(initialProject.published) : true);
  const [newImages, setNewImages] = useState([]);
  const [keptImages, setKeptImages] = useState(initialProject?.images || []);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('shortDescription', shortDescription.trim());
    formData.append('fullDescription', fullDescription.trim());
    formData.append('techStack', JSON.stringify(normalizeStack(techStackInput)));
    formData.append('repoUrl', repoUrl.trim());
    formData.append('liveUrl', liveUrl.trim());
    formData.append('published', String(published));
    formData.append('existingImages', JSON.stringify(keptImages));
    newImages.forEach((file) => formData.append('images', file));

    try {
      await onSubmit(formData);
      if (!initialProject) setNewImages([]);
    } catch (submitError) {
      setFormError(submitError.message || 'Could not save this project. Please try again.');
    }
  };

  return (
    <form className="cms-form cms-panel cms-project-form" onSubmit={handleSubmit} aria-busy={loading}>
      <div className="cms-form-intro">
        <p className="cms-eyebrow">{initialProject ? 'Update the details' : 'Add something you built'}</p>
        <h3>{initialProject ? 'Project details' : 'New project'}</h3>
      </div>
      {formError && <div className="cms-alert cms-alert--error" role="alert">{formError}</div>}

      <div className="cms-form-grid">
        <div className="form-group cms-field">
          <label htmlFor="project-title">Project title</label>
          <input id="project-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </div>
        <div className="form-group cms-field">
          <label htmlFor="project-stack">Tech stack <span className="cms-field-note">(comma separated)</span></label>
          <input id="project-stack" value={techStackInput} onChange={(event) => setTechStackInput(event.target.value)} placeholder="React, Node.js, PostgreSQL" />
        </div>
        <div className="form-group cms-field">
          <label htmlFor="project-repo">GitHub URL</label>
          <input id="project-repo" type="url" inputMode="url" value={repoUrl} onChange={(event) => setRepoUrl(event.target.value)} placeholder="https://github.com/…" />
        </div>
        <div className="form-group cms-field">
          <label htmlFor="project-live">Live demo URL</label>
          <input id="project-live" type="url" inputMode="url" value={liveUrl} onChange={(event) => setLiveUrl(event.target.value)} placeholder="https://…" />
        </div>
      </div>

      <div className="form-group cms-field">
        <label htmlFor="project-short-description">Short description</label>
        <textarea id="project-short-description" rows={3} value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} placeholder="A concise overview of the project." />
      </div>
      <div className="form-group cms-field">
        <label htmlFor="project-full-description">Full description <span className="cms-field-note">(Markdown supported)</span></label>
        <textarea id="project-full-description" rows={7} value={fullDescription} onChange={(event) => setFullDescription(event.target.value)} placeholder="Describe the problem, your approach, and the outcome." />
      </div>

      <div className="form-group cms-field">
        <label htmlFor="project-images">Project images</label>
        <input id="project-images" type="file" accept="image/*" multiple onChange={(event) => setNewImages(Array.from(event.target.files || []))} />
        <p className="cms-field-note">{newImages.length ? newImages.length + ' image(s) ready to upload.' : 'Choose one or more images to add to this project.'}</p>
      </div>

      {initialProject?.images?.length > 0 && (
        <fieldset className="cms-image-set">
          <legend>Existing images</legend>
          <p className="cms-field-note">Select the images to keep.</p>
          <div className="cms-image-grid">
            {initialProject.images.map((image) => {
              const keep = keptImages.includes(image);
              return (
                <button
                  className={'cms-image-toggle' + (keep ? ' is-kept' : ' is-removed')}
                  type="button"
                  key={image}
                  aria-pressed={keep}
                  onClick={() => setKeptImages((current) => current.includes(image) ? current.filter((item) => item !== image) : [...current, image])}
                >
                  <img src={image.startsWith('http') ? image : API_BASE + image} alt="" />
                  <span>{keep ? 'Keeping' : 'Removed'}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <label className="cms-checkbox-row" htmlFor="project-published">
        <input id="project-published" type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
        <span><strong>Publish project</strong><small>Visible to visitors on your portfolio.</small></span>
      </label>

      <div className="cms-form-actions">
        {onCancel && <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={loading}>Cancel</button>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
