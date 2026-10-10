import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE, request } from '../services/api';
import ProfileForm from '../components/ProfileForm';
import ProjectForm from '../components/ProjectForm';
import SecuritySettings from '../components/SecuritySettings';
import SkillManager from '../components/SkillManager';
import { useAuth } from '../state/AuthContext';
import { useProfile } from '../state/ProfileContext';

const tabs = [
  { id: 'projects', label: 'Projects', icon: 'fa-code' },
  { id: 'profile', label: 'Profile', icon: 'fa-user-edit' },
  { id: 'skills', label: 'Skills', icon: 'fa-chart-bar' },
  { id: 'security', label: 'Security', icon: 'fa-shield-alt' },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [projectSaving, setProjectSaving] = useState(false);
  const [pendingProjectId, setPendingProjectId] = useState(null);
  const { token, logout, user } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await request('/api/admin/projects', { token });
      setProjects(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message || 'Could not load projects. Try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'projects') fetchProjects();
  }, [activeTab, fetchProjects]);

  const handleCreate = async (formData) => {
    setProjectSaving(true);
    setActionError('');
    try {
      await request('/api/projects', { method: 'POST', data: formData, token, isFormData: true });
      setIsCreating(false);
      await fetchProjects();
    } finally {
      setProjectSaving(false);
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingProject) return;
    setProjectSaving(true);
    setActionError('');
    try {
      await request('/api/projects/' + editingProject.id, { method: 'PUT', data: formData, token, isFormData: true });
      setEditingProject(null);
      await fetchProjects();
    } finally {
      setProjectSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm('Delete “' + project.title + '”? This cannot be undone.')) return;
    setPendingProjectId(project.id);
    setActionError('');
    try {
      await request('/api/projects/' + project.id, { method: 'DELETE', token });
      await fetchProjects();
    } catch (requestError) {
      setActionError(requestError.message || 'Could not delete this project.');
    } finally {
      setPendingProjectId(null);
    }
  };

  const handleToggleVisibility = async (project) => {
    setPendingProjectId(project.id);
    setActionError('');
    try {
      await request('/api/projects/' + project.id + '/visibility', {
        method: 'PATCH',
        data: { published: !project.published },
        token,
      });
      await fetchProjects();
    } catch (requestError) {
      setActionError(requestError.message || 'Could not update project visibility.');
    } finally {
      setPendingProjectId(null);
    }
  };

  const handleProfileUpdate = async (formData) => {
    await request('/api/profile', { method: 'PUT', data: formData, token, isFormData: true });
    await refreshProfile();
  };

  const handleUpdateCredentials = (data) =>
    request('/api/auth/update-credentials', { method: 'PUT', data, token });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeProjectForm = () => {
    setIsCreating(false);
    setEditingProject(null);
    setActionError('');
  };

  const editing = isCreating || Boolean(editingProject);

  return (
    <main className="container cms-shell">
      <header className="cms-header">
        <div className="cms-heading-stack">
          <p className="cms-eyebrow">Portfolio studio</p>
          <h1 className="cms-title">Manage your portfolio</h1>
          <p className="cms-description">Update the work and details visitors see on your site.</p>
        </div>
        <button className="btn btn-secondary cms-logout" type="button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" aria-hidden="true"></i> Sign out
        </button>
      </header>

      <nav className="cms-tabs" role="tablist" aria-label="Portfolio settings">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={'cms-tab' + (activeTab === tab.id ? ' is-active' : '')}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setActionError('');
            }}
          >
            <i className={'fas ' + tab.icon} aria-hidden="true"></i>
            {tab.label}
          </button>
        ))}
      </nav>

      {error && <div className="cms-alert cms-alert--error" role="alert">{error}</div>}
      {actionError && <div className="cms-alert cms-alert--error" role="alert">{actionError}</div>}

      <div className="cms-stage">
        {activeTab === 'security' && (
          <section className="cms-content-narrow" role="tabpanel" aria-label="Security settings">
            <SecuritySettings currentEmail={user?.email} onUpdate={handleUpdateCredentials} />
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="cms-content-medium" role="tabpanel" aria-label="Profile settings">
            <ProfileForm initialProfile={profile} onSubmit={handleProfileUpdate} loading={!profile} />
          </section>
        )}

        {activeTab === 'skills' && (
          <section role="tabpanel" aria-label="Skills">
            <SkillManager />
          </section>
        )}

        {activeTab === 'projects' && (
          <section role="tabpanel" aria-label="Projects">
            {editing ? (
              <div className="cms-content-medium">
                <div className="cms-subheader">
                  <div>
                    <p className="cms-eyebrow">Projects</p>
                    <h2 className="cms-section-title">{isCreating ? 'Add a project' : 'Edit project'}</h2>
                  </div>
                  <button className="btn btn-secondary" type="button" onClick={closeProjectForm}>Cancel</button>
                </div>
                <ProjectForm
                  initialProject={editingProject}
                  onSubmit={isCreating ? handleCreate : handleUpdate}
                  submitLabel={isCreating ? 'Add project' : 'Save changes'}
                  onCancel={closeProjectForm}
                  loading={projectSaving}
                />
              </div>
            ) : (
              <>
                <div className="cms-project-toolbar">
                  <div>
                    <p className="cms-eyebrow">Your work</p>
                    <h2 className="cms-section-title">Projects <span className="cms-count">{projects.length}</span></h2>
                  </div>
                  <button className="btn btn-primary" type="button" onClick={() => {
                    setActionError('');
                    setIsCreating(true);
                  }}>
                    <i className="fas fa-plus" aria-hidden="true"></i> Add project
                  </button>
                </div>

                {actionError && <div className="cms-alert cms-alert--error" role="alert">{actionError}</div>}
                {loading ? (
                  <div className="cms-state" role="status"><span className="cms-spinner" aria-hidden="true"></span> Loading projects…</div>
                ) : error ? null : projects.length === 0 ? (
                  <div className="cms-state cms-empty-state">
                    <i className="fas fa-folder-open" aria-hidden="true"></i>
                    <h3>No projects yet</h3>
                    <p>Add your first project to start building your portfolio.</p>
                    <button className="btn btn-primary" type="button" onClick={() => setIsCreating(true)}>Add your first project</button>
                  </div>
                ) : (
                  <div className="cms-project-grid">
                    {projects.map((project) => {
                      const busy = pendingProjectId === project.id;
                      const image = project.images?.[0];
                      const imageUrl = image ? (image.startsWith('http') ? image : API_BASE + image) : '/assets/project1.png';
                      return (
                        <article key={project.id} className="cms-project-card">
                          <div className="cms-project-media">
                            <img src={imageUrl} alt={project.title} />
                            <span className={'cms-status-pill' + (project.published ? ' is-published' : ' is-draft')}>
                              {project.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <div className="cms-project-body">
                            <h3>{project.title}</h3>
                            <p>{project.shortDescription || 'No short description yet.'}</p>
                            <div className="cms-project-actions">
                              <button className="btn btn-secondary cms-button-small" type="button" onClick={() => setEditingProject(project)}>
                                <i className="fas fa-edit" aria-hidden="true"></i> Edit
                              </button>
                              <button
                                className={'btn btn-secondary cms-button-small cms-visibility-button' + (project.published ? ' is-published' : ' is-draft')}
                                type="button"
                                disabled={busy}
                                onClick={() => handleToggleVisibility(project)}
                              >
                                <i className={'fas ' + (project.published ? 'fa-eye-slash' : 'fa-eye')} aria-hidden="true"></i>
                                {busy ? 'Updating…' : project.published ? 'Unpublish' : 'Publish'}
                              </button>
                              <button
                                className="btn btn-secondary cms-button-small cms-danger-button"
                                type="button"
                                disabled={busy}
                                aria-label={'Delete ' + project.title}
                                onClick={() => handleDelete(project)}
                              >
                                <i className="fas fa-trash" aria-hidden="true"></i> {busy ? 'Working…' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default Admin;
