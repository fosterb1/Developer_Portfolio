import React, { useEffect, useState, useCallback } from 'react';
import { request, API_BASE } from '../services/api';
import ProjectForm from '../components/ProjectForm';
import ProfileForm from '../components/ProfileForm';
import SkillManager from '../components/SkillManager';
import { useAuth } from '../state/AuthContext';
import { useProfile } from '../state/ProfileContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'profile' | 'skills'
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { token, logout } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await request('/api/admin/projects', { token });
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'projects') {
        fetchProjects();
    }
  }, [fetchProjects, activeTab]);

  const handleCreate = async (formData) => {
    try {
      await request('/api/projects', {
        method: 'POST',
        data: formData,
        token: token,
        isFormData: true,
      });
      setIsCreating(false);
      fetchProjects();
    } catch (err) {
      alert(`Error creating project: ${err.message}`);
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingProject) return;
    try {
      await request(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        data: formData,
        token: token,
        isFormData: true,
      });
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      alert(`Error updating project: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await request(`/api/projects/${id}`, {
        method: 'DELETE',
        token: token,
      });
      fetchProjects();
    } catch (err) {
      alert(`Error deleting project: ${err.message}`);
    }
  };

  const handleToggleVisibility = async (project) => {
    try {
      await request(`/api/projects/${project.id}/visibility`, {
        method: 'PATCH',
        data: { published: !project.published },
        token: token,
      });
      fetchProjects();
    } catch (err) {
      alert(`Error updating visibility: ${err.message}`);
    }
  };

  const handleProfileUpdate = async (formData) => {
      try {
          await request('/api/profile', {
              method: 'PUT',
              data: formData,
              token: token,
              isFormData: true
          });
          refreshProfile(); // Refresh global profile context
          alert("Profile updated successfully!");
      } catch (err) {
          alert(`Error updating profile: ${err.message}`);
      }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Admin Dashboard</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid #e5e7eb' }}>
        <button 
            className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '12px 12px 0 0', borderBottom: activeTab === 'projects' ? 'none' : '' }}
            onClick={() => setActiveTab('projects')}
        >
            <i className="fas fa-code"></i> Projects
        </button>
        <button 
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '12px 12px 0 0', borderBottom: activeTab === 'profile' ? 'none' : '' }}
            onClick={() => setActiveTab('profile')}
        >
            <i className="fas fa-user-edit"></i> Profile Settings
        </button>
        <button 
            className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '12px 12px 0 0', borderBottom: activeTab === 'skills' ? 'none' : '' }}
            onClick={() => setActiveTab('skills')}
        >
            <i className="fas fa-chart-bar"></i> Skills
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {activeTab === 'profile' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <ProfileForm 
                initialProfile={profile} 
                onSubmit={handleProfileUpdate}
                loading={false}
              />
          </div>
      )}

      {activeTab === 'skills' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <SkillManager />
          </div>
      )}

      {activeTab === 'projects' && (
        <>
            {(isCreating || editingProject) ? (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '2rem' }}>{isCreating ? 'Create New Project' : 'Edit Project'}</h2>
                <ProjectForm
                    initialProject={editingProject}
                    onSubmit={isCreating ? handleCreate : handleUpdate}
                    submitLabel={isCreating ? 'Create Project' : 'Update Project'}
                    onCancel={() => { setIsCreating(false); setEditingProject(null); }}
                    loading={false}
                />
                </div>
            ) : (
                <>
                <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
                    <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
                    <i className="fas fa-plus"></i> Add New Project
                    </button>
                </div>

                <div className="projects-grid">
                    {loading ? (
                    <p>Loading...</p>
                    ) : projects.length === 0 ? (
                    <p>No projects found.</p>
                    ) : (
                    projects.map((project) => (
                        <div key={project.id} className="project-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="project-image" style={{ height: '180px' }}>
                            <img 
                            src={project.images && project.images.length > 0 
                                ? (project.images[0].startsWith('http') ? project.images[0] : `${API_BASE}${project.images[0]}`) 
                                : '/assets/project1.png'} 
                            alt={project.title} 
                            />
                            <div className="project-overlay">
                            <span style={{ color: 'white', fontWeight: 'bold' }}>
                                {project.published ? 'Published' : 'Draft'}
                            </span>
                            </div>
                        </div>
                        <div className="project-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3>{project.title}</h3>
                            <p style={{ flex: 1 }}>{project.shortDescription}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                onClick={() => setEditingProject(project)}
                            >
                                <i className="fas fa-edit"></i> Edit
                            </button>
                            <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: project.published ? '#eab308' : '#10b981', color: project.published ? '#eab308' : '#10b981' }}
                                onClick={() => handleToggleVisibility(project)}
                            >
                                <i className={`fas ${project.published ? 'fa-eye-slash' : 'fa-eye'}`}></i> {project.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: '#ef4444', color: '#ef4444' }}
                                onClick={() => handleDelete(project.id)}
                            >
                                <i className="fas fa-trash"></i> Delete
                            </button>
                            </div>
                        </div>
                        </div>
                    ))
                    )}
                </div>
                </>
            )}
        </>
      )}
    </div>
  );
};

export default Admin;