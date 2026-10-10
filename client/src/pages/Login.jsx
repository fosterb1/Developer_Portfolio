import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (loginError) {
      setError(loginError.message || 'Login failed. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container cms-auth-shell">
      <section className="cms-panel cms-auth-card">
        <div className="cms-form-intro">
          <p className="cms-eyebrow">Portfolio studio</p>
          <h1 className="cms-title">Welcome back</h1>
          <p>Sign in to manage your portfolio.</p>
        </div>
        {error && <div className="cms-alert cms-alert--error" role="alert">{error}</div>}
        <form className="cms-form cms-form--compact" onSubmit={handleSubmit} aria-busy={loading}>
          <div className="form-group cms-field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="form-group cms-field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
