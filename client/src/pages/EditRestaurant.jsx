import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRestaurant, updateRestaurant } from '../api';

const CATEGORIES = ['Restaurant', 'Street Food', 'Cafe', 'Hotel', 'Dhaba', 'Fast Food'];

export default function EditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRestaurant(id).then((res) => {
      const r = res.data.restaurant;
      setForm({
        name: r.name, description: r.description || '', location: r.location || '',
        category: r.category || 'Restaurant', hygieneScore: r.hygieneScore || 75,
        violations: (r.violations || []).join(', '),
        lastInspected: r.lastInspected ? r.lastInspected.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }).catch(() => navigate('/'));
  }, [id]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await updateRestaurant(id, fd);
      navigate(`/restaurants/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
    setLoading(false);
  };

  if (!form) return <div className="loading-wrap"><div className="spinner" /></div>;

  return (
    <div className="page-container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem', maxWidth: 720 }}>
      <Link to={`/restaurants/${id}`} className="detail-back">← Back to Restaurant</Link>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Edit Restaurant</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Update hygiene information and details</p>
      {error && <div className="error-msg">{error}</div>}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Restaurant Name *</label>
            <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
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
          <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Location / Address *</label>
          <input className="form-input" name="location" value={form.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Hygiene Score: <span className="score-display">{form.hygieneScore}/100</span></label>
          <input type="range" className="score-range" name="hygieneScore" min={0} max={100} value={form.hygieneScore} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Violations (comma-separated)</label>
          <textarea className="form-textarea" name="violations" value={form.violations} onChange={handleChange} style={{ minHeight: 70 }} />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Last Inspected</label>
            <input type="date" className="form-input" name="lastInspected" value={form.lastInspected} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Update Image (optional)</label>
            <input type="file" className="form-input" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>
        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
