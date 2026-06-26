import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createRestaurant } from '../api';

const CATEGORIES = ['Restaurant', 'Street Food', 'Cafe', 'Hotel', 'Dhaba', 'Fast Food'];

export default function NewRestaurant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', location: '', category: 'Restaurant',
    hygieneScore: 75, violations: '', lastInspected: new Date().toISOString().split('T')[0],
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      const res = await createRestaurant(fd);
      navigate(`/restaurants/${res.data.restaurant._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create restaurant');
    }
    setLoading(false);
  };

  return (
    <div className="page-container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem', maxWidth: 720 }}>
      <Link to="/" className="detail-back">← Back</Link>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Register Restaurant</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Add a new restaurant to the food safety tracking system</p>
      {error && <div className="error-msg">{error}</div>}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Restaurant Name *</label>
            <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. MTR Cafe" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Brief description of the restaurant..." />
        </div>
        <div className="form-group">
          <label className="form-label">Location / Address *</label>
          <input className="form-input" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Indiranagar, Bengaluru" />
          <p className="form-hint">Address is used to place the restaurant on the map</p>
        </div>
        <div className="form-group">
          <label className="form-label">Hygiene Score: <span className="score-display">{form.hygieneScore}/100</span></label>
          <input type="range" className="score-range" name="hygieneScore" min={0} max={100} value={form.hygieneScore} onChange={handleChange} />
          <p className="form-hint">A=85–100 · B=70–84 · C=55–69 · D=40–54 · F=0–39</p>
        </div>
        <div className="form-group">
          <label className="form-label">Violations (comma-separated)</label>
          <textarea className="form-textarea" name="violations" value={form.violations} onChange={handleChange} placeholder="e.g. Open food storage, No handwash facility" style={{ minHeight: 70 }} />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Last Inspected</label>
            <input type="date" className="form-input" name="lastInspected" value={form.lastInspected} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Image</label>
            <input type="file" className="form-input" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>
        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register Restaurant'}
        </button>
      </form>
    </div>
  );
}
