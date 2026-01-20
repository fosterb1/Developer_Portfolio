import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import ProjectCard from '../components/ProjectCard';
import { request } from '../services/api';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await request('/api/projects');
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <Hero />
      <About />
      <Experience />
      
      <section id="projects" className="projects-section">
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Browse My Recent</p>
            <h2 className="section-title">Projects</h2>
            <div className="title-underline"></div>
          </div>
          
          {loading ? (
            <div className="text-center">
              <p>Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <div className="text-center" style={{ gridColumn: '1 / -1' }}>
                  <p>No projects published yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Contact />
    </>
  );
};

export default Home;