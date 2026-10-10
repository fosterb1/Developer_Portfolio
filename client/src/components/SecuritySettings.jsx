import React, { useState } from 'react';

export default function SecuritySettings({ currentEmail, onUpdate }) {
  const [email, setEmail] = useState(currentEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (password && password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    if (!window.confirm('Update your sign-in credentials? You will use these on your next login.')) return;

    setLoading(true);
    try {
      await onUpdate({ email: email.trim(), password });
      setPassword('');
      setConfirmPassword('');
      setNotice('Credentials updated. Use the new details next time you sign in.');
    } catch (requestError) {
      setError(requestError.message || 'Could not update credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cms-panel cms-security-card">
      <div className="cms-form-intro">
        <p className="cms-eyebrow">Account access</p>
        <h2 className="cms-section-title">Login credentials</h2>
        <p>Change the email or password you use to access this dashboard.</p>
      </div>
      {error && <div className="cms-alert cms-alert--error" role="alert">{error}</div>}
      {notice && <div className="cms-alert cms-alert--success" role="status">{notice}</div>}
      <form className="cms-form cms-form--compact" onSubmit={handleSubmit}>
        <div className="form-group cms-field">
          <label htmlFor="admin-email">Admin email</label>
          <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" required />
        </div>
        <div className="form-group cms-field">
          <label htmlFor="new-password">New password <span className="cms-field-note">(leave blank to keep your current password)</span></label>
          <input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter a new password" />
        </div>
        {password && (
          <div className="form-group cms-field">
            <label htmlFor="confirm-password">Confirm new password</label>
            <input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter the new password" required />
          </div>
        )}
        <div className="cms-form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update credentials'}
          </button>
        </div>
      </form>
    </section>
  );
}
