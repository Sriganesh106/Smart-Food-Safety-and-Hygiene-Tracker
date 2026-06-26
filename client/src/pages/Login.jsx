import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍽️</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to SafeEats to manage restaurant hygiene data</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" placeholder="Enter username" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Enter password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '1rem', textAlign: 'center', background: 'var(--bg-3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ marginBottom: '0.25rem' }}><strong>Admin Login</strong> (Full Access):<br/><code>admin</code> / <code>password123</code></div>
          <div><strong>User Login</strong>: Sign up below</div>
        </div>
        <p className="auth-switch">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}
