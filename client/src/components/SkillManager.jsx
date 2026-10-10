import React, { useCallback, useEffect, useState } from 'react';
import { request } from '../services/api';
import { useAuth } from '../state/AuthContext';

const categories = [
  { id: 'frontend', label: 'Frontend', description: 'Interfaces and client-side tools' },
  { id: 'backend', label: 'Backend', description: 'Services, data, and infrastructure' },
];

export default function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [percentage, setPercentage] = useState(50);
  const [category, setCategory] = useState('frontend');

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await request('/api/skills');
      setSkills(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message || 'Could not load skills. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleAdd = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setSaving(true);
    try {
      await request('/api/skills', { method: 'POST', data: { name: name.trim(), level: level.trim(), percentage: Number(percentage), category }, token });
      setName('');
      setLevel('Intermediate');
      setPercentage(50);
      setNotice('Skill added.');
      await fetchSkills();
    } catch (requestError) {
      setError(requestError.message || 'Could not add this skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skill) => {
    if (!window.confirm('Delete “' + skill.name + '”?')) return;
    setDeletingId(skill.id);
    setError('');
    setNotice('');
    try {
      await request('/api/skills/' + skill.id, { method: 'DELETE', token });
      setNotice('Skill removed.');
      await fetchSkills();
    } catch (requestError) {
      setError(requestError.message || 'Could not delete this skill.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="cms-skill-layout">
      <section className="cms-panel cms-skill-editor">
        <div className="cms-form-intro">
          <p className="cms-eyebrow">Show your strengths</p>
          <h2 className="cms-section-title">Add a skill</h2>
          <p>Skills appear on your public portfolio in the category you choose.</p>
        </div>
        {error && <div className="cms-alert cms-alert--error" role="alert">{error}</div>}
        {notice && <div className="cms-alert cms-alert--success" role="status">{notice}</div>}
        <form className="cms-form cms-form--compact" onSubmit={handleAdd}>
          <div className="form-group cms-field">
            <label htmlFor="skill-name">Skill name</label>
            <input id="skill-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. React" required />
          </div>
          <div className="form-group cms-field">
            <label htmlFor="skill-category">Category</label>
            <select id="skill-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="frontend">Frontend development</option>
              <option value="backend">Backend development</option>
            </select>
          </div>
          <div className="cms-form-grid">
            <div className="form-group cms-field">
              <label htmlFor="skill-level">Level</label>
              <input id="skill-level" value={level} onChange={(event) => setLevel(event.target.value)} placeholder="e.g. Advanced" required />
            </div>
            <div className="form-group cms-field">
              <label htmlFor="skill-percent">Proficiency</label>
              <div className="cms-number-input"><input id="skill-percent" type="number" min="0" max="100" step="1" value={percentage} onChange={(event) => setPercentage(event.target.value)} required /><span>%</span></div>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving || loading}>
            {saving ? 'Adding…' : 'Add skill'}
          </button>
        </form>
      </section>

      <div className="cms-skill-groups" aria-busy={loading}>
        {categories.map((item) => {
          const items = skills.filter((skill) => skill.category === item.id);
          return (
            <section className="cms-panel cms-skill-group" key={item.id}>
              <div className="cms-list-heading">
                <div><h2>{item.label}</h2><p>{item.description}</p></div>
                <span className="cms-count">{items.length}</span>
              </div>
              {loading ? (
                <div className="cms-state cms-state--small" role="status">Loading…</div>
              ) : items.length === 0 ? (
                <p className="cms-empty-inline">No {item.label.toLowerCase()} skills added yet.</p>
              ) : (
                <ul className="cms-skill-list">
                  {items.map((skill) => (
                    <li className="cms-skill-row" key={skill.id}>
                      <div className="cms-skill-details">
                        <strong>{skill.name}</strong>
                        <span>{skill.level} · {skill.percentage}%</span>
                        <div className="cms-skill-meter" role="progressbar" aria-label={skill.name + ' proficiency'} aria-valuenow={skill.percentage} aria-valuemin="0" aria-valuemax="100">
                          <span style={{ width: Math.min(100, Math.max(0, Number(skill.percentage) || 0)) + '%' }}></span>
                        </div>
                      </div>
                      <button className="cms-icon-button cms-danger-button" type="button" disabled={deletingId === skill.id} aria-label={'Delete ' + skill.name} onClick={() => handleDelete(skill)}>
                        <i className="fas fa-trash" aria-hidden="true"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
