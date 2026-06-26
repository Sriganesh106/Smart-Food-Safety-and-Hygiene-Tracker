import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRestaurant, deleteRestaurant, createReview, deleteReview } from '../api';
import { HygieneGauge, GradeBadge, ScoreBar } from '../components/HygieneGauge';
import { MapboxSinglePin } from '../components/MapboxMap';
import { useAuth } from '../context/AuthContext';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getRestaurant(id)
      .then((res) => setRestaurant(res.data.restaurant))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this restaurant?')) return;
    await deleteRestaurant(id);
    navigate('/');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmitting(true);
    try {
      const res = await createReview(id, { comment: reviewText, rating });
      setRestaurant((prev) => ({ ...prev, reviews: [...prev.reviews, res.data.review] }));
      setReviewText('');
      setRating(5);
    } catch (_) {}
    setSubmitting(false);
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteReview(id, reviewId);
    setRestaurant((prev) => ({ ...prev, reviews: prev.reviews.filter((r) => r._id !== reviewId) }));
  };

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;
  if (!restaurant) return null;

  const isOwner = user && (restaurant.owner?._id === user._id || user.role === 'admin');
  const fallback = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80';

  return (
    <div className="page-container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <Link to="/" className="detail-back">← Back to Dashboard</Link>

      <div className="detail-grid">
        {/* Left */}
        <div>
          <img
            src={restaurant.image?.url || fallback}
            alt={restaurant.name}
            className="detail-image"
            onError={(e) => { e.target.src = fallback; }}
          />
          <div style={{ marginTop: '1.5rem' }}>
            <div className="detail-meta">
              <span className="detail-category">{restaurant.category}</span>
              <span className="detail-location">📍 {restaurant.location}</span>
            </div>
            <h1 className="detail-title">{restaurant.name}</h1>
            <p className="detail-description">{restaurant.description}</p>

            {/* Score */}
            <div className="detail-score-section">
              <div className="detail-score-header">
                <span className="score-section-title">Hygiene Assessment</span>
                <GradeBadge grade={restaurant.hygieneGrade} large />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                <HygieneGauge score={restaurant.hygieneScore} grade={restaurant.hygieneGrade} size={110} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Score</div>
                  <ScoreBar score={restaurant.hygieneScore} grade={restaurant.hygieneGrade} />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    {restaurant.hygieneScore}/100
                  </div>
                </div>
              </div>
              {restaurant.violations?.length > 0 ? (
                <>
                  <div style={{ fontSize: '0.82rem', color: 'var(--grade-f)', fontWeight: 600, marginBottom: '0.4rem' }}>
                    ⚠ Violations Recorded
                  </div>
                  <ul className="violations-list">
                    {restaurant.violations.map((v, i) => (
                      <li key={i} className="violation-item"><span className="violation-dot">•</span>{v}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <div style={{ fontSize: '0.87rem', color: 'var(--grade-a)' }}>✅ No violations recorded</div>
              )}
              <div className="inspected-label">
                Last Inspected: {restaurant.lastInspected ? new Date(restaurant.lastInspected).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
              </div>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Link to={`/restaurants/${id}/edit`} className="btn btn-ghost">✏️ Edit</Link>
                <button className="btn btn-danger" onClick={handleDelete}>🗑 Delete</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div>
          <MapboxSinglePin restaurant={restaurant} />

          {/* Reviews */}
          <div className="reviews-section">
            <h2 className="section-title">Inspection Reports ({restaurant.reviews?.length || 0})</h2>

            {user && (
              <form className="review-form-card" onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Rating</div>
                <div className="star-select">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" className={`star-btn ${s <= rating ? 'filled' : ''}`} onClick={() => setRating(s)}>★</button>
                  ))}
                </div>
                <textarea
                  className="form-textarea"
                  placeholder="Share your inspection observations..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  style={{ marginBottom: '0.75rem' }}
                />
                <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            )}

            <div className="review-cards">
              {restaurant.reviews?.length === 0 && (
                <div className="empty-state" style={{ padding: '1.5rem' }}>
                  <p>No inspection reports yet.</p>
                </div>
              )}
              {restaurant.reviews?.map((rev) => (
                <div key={rev._id} className="review-card">
                  <div className="review-header">
                    <span className="review-author">@{rev.author?.username || 'Anonymous'}</span>
                    <span className="review-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                  {user && (rev.author?._id === user._id || user.role === 'admin') && (
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => handleDeleteReview(rev._id)}
                    >Delete</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
