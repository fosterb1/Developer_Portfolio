import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { request, API_BASE } from '../services/api';

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await request(`/api/projects/${id}`);
        setProject(data);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '120px', minHeight: '60vh', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ paddingTop: '120px', minHeight: '60vh', textAlign: 'center' }}>
        <h2>Project not found</h2>
        <Link to="/#projects" className="btn btn-primary mt-2">Back to Projects</Link>
      </div>
    );
  }

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${API_BASE}${path}`;
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <Link to="/#projects" className="btn btn-secondary mb-2">
        <i className="fas fa-arrow-left"></i> Back to Projects
      </Link>

      <div className="project-detail-header">
        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{project.title}</h1>
        <div className="tech-stack" style={{ justifyContent: 'flex-start', marginBottom: '2rem' }}>
          {project.techStack.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>

      <div className="project-detail-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        <div className="project-gallery">
          {project.images && project.images.length > 0 ? (
            <>
              <div className="main-image" style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <img 
                  src={getImageUrl(project.images[activeImage])} 
                  alt={project.title} 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>
              <div className="thumbnail-list" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                {project.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    style={{ 
                      width: '80px', 
                      height: '60px', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      cursor: 'pointer',
                      border: activeImage === idx ? '2px solid var(--primary-color)' : '2px solid transparent',
                      opacity: activeImage === idx ? 1 : 0.7
                    }}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt={`Thumbnail ${idx}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-image" style={{ background: '#eee', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
              No images available
            </div>
          )}
        </div>

        <div className="project-info">
          <div className="project-actions" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                <i className="fab fa-github"></i> View Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <i className="fas fa-external-link-alt"></i> Live Demo
              </a>
            )}
          </div>

          <div className="project-description" style={{ color: 'var(--dark-color)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Overview</h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>{project.shortDescription}</p>
            
            <h3 style={{ marginBottom: '1rem' }}>Detailed Description</h3>
            <div className="markdown-body" style={{ lineHeight: '1.8' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.fullDescription}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;