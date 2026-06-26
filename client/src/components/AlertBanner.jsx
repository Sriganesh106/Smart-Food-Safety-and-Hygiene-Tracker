import { Link } from 'react-router-dom';

export default function AlertBanner({ restaurants }) {
  const critical = restaurants.filter((r) => r.hygieneScore < 40);
  if (!critical.length) return null;

  return (
    <div className="alert-banner">
      <div className="alert-icon">🚨</div>
      <div className="alert-text">
        <h4>Critical Hygiene Alert — {critical.length} Restaurant{critical.length > 1 ? 's' : ''} Require Immediate Attention</h4>
        <p>
          {critical.map((r, i) => (
            <span key={r._id}>
              <Link to={`/restaurants/${r._id}`} style={{ color: '#ef4444', fontWeight: 600 }}>{r.name}</Link>
              {i < critical.length - 1 ? ', ' : ''}
            </span>
          ))}
          {' '}— scored below 40. Immediate re-inspection recommended.
        </p>
      </div>
    </div>
  );
}
