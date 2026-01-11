import React, { useState, useEffect } from 'react';
import { request } from '../services/api';

const Experience = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await request('/api/skills');
        setSkills(data);
      } catch (err) {
        console.error("Failed to load skills", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const SkillList = ({ title, icon, category }) => {
    const categorySkills = skills.filter(s => s.category === category);
    
    // Fallback if no skills loaded yet to avoid empty sections
    if (!loading && categorySkills.length === 0) return null;

    return (
      <div className="skill-category">
        <div className="category-header">
          <i className={`fas ${icon} category-icon`}></i>
          <h3>{title}</h3>
        </div>
        <div className="skills-list">
          {categorySkills.map(skill => (
            <div className="skill-item" key={skill.id}>
              <span className="skill-name">{skill.name}</span>
              <div className="skill-level">
                <div className="skill-bar" style={{ width: `${skill.percentage}%` }}></div>
              </div>
              <span className="skill-label">{skill.level}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Explore My</p>
          <h2 className="section-title">Experience</h2>
          <div className="title-underline"></div>
        </div>
        
        {loading ? (
           <p className="text-center">Loading skills...</p>
        ) : (
          <div className="experience-grid">
            <SkillList title="Frontend Development" icon="fa-code" category="frontend" />
            <SkillList title="Backend Development" icon="fa-server" category="backend" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;