import { useState, useEffect, useMemo } from 'react';
import { getRestaurants } from '../api';
import RestaurantCard from '../components/RestaurantCard';
import AlertBanner from '../components/AlertBanner';
import GradeFilter from '../components/GradeFilter';
import { MapboxMultiPin } from '../components/MapboxMap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState('ALL');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (grade !== 'ALL') params.grade = grade;
    if (category) params.category = category;
    if (search) params.search = search;
    getRestaurants(params)
      .then((res) => setRestaurants(res.data.restaurants))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [grade, category, search]);

  const stats = useMemo(() => ({
    total: restaurants.length,
    safe: restaurants.filter((r) => r.hygieneGrade === 'A' || r.hygieneGrade === 'B').length,
    critical: restaurants.filter((r) => r.hygieneScore < 40).length,
    avgScore: restaurants.length
      ? Math.round(restaurants.reduce((a, r) => a + r.hygieneScore, 0) / restaurants.length)
      : 0,
  }), [restaurants]);

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <h1 className="hero-title">Bengaluru <span>Food Safety</span> Dashboard</h1>
        <p className="hero-sub">Real-time hygiene tracking for 100+ restaurants across the city</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#00d4aa' }}>{stats.total}</div>
          <div className="stat-label">Total Restaurants</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>{stats.safe}</div>
          <div className="stat-label">Grade A / B</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ef4444' }}>{stats.critical}</div>
          <div className="stat-label">Critical Alerts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.avgScore}</div>
          <div className="stat-label">Avg Hygiene Score</div>
        </div>
      </div>

      {/* Alert Banner */}
      <AlertBanner restaurants={restaurants} />

      {/* Map */}
      {restaurants.length > 0 && <div style={{ marginBottom: '2rem' }}><MapboxMultiPin restaurants={restaurants} /></div>}

      {/* Controls */}
      <div className="dashboard-controls">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="form-input search-input"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" style={{ maxWidth: 180 }} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {['Restaurant', 'Street Food', 'Cafe', 'Hotel', 'Dhaba', 'Fast Food'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {user?.role === 'admin' && <Link to="/restaurants/new" className="btn btn-primary btn-sm">+ Add Restaurant</Link>}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <GradeFilter active={grade} onChange={setGrade} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : restaurants.length === 0 ? (
        <div className="empty-state">
          <h3>No restaurants found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="restaurant-grid">
          {restaurants.map((r) => <RestaurantCard key={r._id} restaurant={r} />)}
        </div>
      )}
    </div>
  );
}
