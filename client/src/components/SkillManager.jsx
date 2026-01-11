import React, { useState, useEffect, useCallback } from 'react';
import { request } from '../services/api';
import { useAuth } from '../state/AuthContext';

export default function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  
  // Form state
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [percentage, setPercentage] = useState(50);
  const [category, setCategory] = useState("frontend");

  const fetchSkills = useCallback(async () => {
    try {
      const data = await request('/api/skills');
      setSkills(data);
    } catch (err) {
      console.error("Failed to fetch skills", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await request('/api/skills', {
        method: 'POST',
        data: { name, level, percentage: Number(percentage), category },
        token
      });
      // Reset form
      setName("");
      setLevel("Intermediate");
      setPercentage(50);
      fetchSkills();
    } catch (err) {
      alert("Failed to add skill");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete skill?")) return;
    try {
      await request(`/api/skills/${id}`, { method: 'DELETE', token });
      fetchSkills();
    } catch (err) {
      alert("Failed to delete skill");
    }
  };

  const SkillList = ({ title, categoryFilter }) => (
    <div className="skill-category" style={{ flex: 1 }}>
       <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{title}</h3>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {skills.filter(s => s.category === categoryFilter).map(skill => (
            <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <div>
                    <strong>{skill.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{skill.level} ({skill.percentage}%)</div>
                </div>
                <button 
                    onClick={() => handleDelete(skill.id)}
                    className="btn btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.8rem', borderColor: '#ef4444', color: '#ef4444' }}
                >
                    <i className="fas fa-trash"></i>
                </button>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Add New Skill Form */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', height: 'fit-content' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Add New Skill</h3>
        <form onSubmit={handleAdd} className="contact-form">
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Skill Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. React" required />
            </div>
            
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                    <option value="frontend">Frontend Development</option>
                    <option value="backend">Backend Development</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Level Label</label>
                    <input value={level} onChange={e => setLevel(e.target.value)} placeholder="e.g. Expert" required />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Percentage (0-100)</label>
                    <input type="number" min="0" max="100" value={percentage} onChange={e => setPercentage(e.target.value)} required />
                </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Add Skill</button>
        </form>
      </div>

      {/* Skills List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <SkillList title="Frontend" categoryFilter="frontend" />
          </div>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <SkillList title="Backend" categoryFilter="backend" />
          </div>
      </div>
    </div>
  );
}
