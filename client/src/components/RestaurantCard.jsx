import { Link } from 'react-router-dom';
import { GradeBadge, ScoreBar } from './HygieneGauge';

export default function RestaurantCard({ restaurant }) {
  const { _id, name, image, location, category, hygieneScore, hygieneGrade, violations, lastInspected } = restaurant;
  const fallback = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80';

  return (
    <Link to={`/restaurants/${_id}`} style={{ display: 'block' }}>
      <div className="restaurant-card">
        <div className="card-image-wrap">
          <img src={image?.url || fallback} alt={name} onError={(e) => { e.target.src = fallback; }} />
          <span className="card-category-chip">{category}</span>
          <div className="card-grade-pos">
            <GradeBadge grade={hygieneGrade} />
          </div>
        </div>
        <div className="card-body">
          <h3 className="card-title">{name}</h3>
          <p className="card-location">📍 {location}</p>
          <div className="card-score-row">
            <span className="score-number">{hygieneScore}/100</span>
            <ScoreBar score={hygieneScore} grade={hygieneGrade} />
          </div>
          {violations?.length > 0 && (
            <div className="card-violations">
              {violations.slice(0, 2).map((v, i) => (
                <span key={i} className="violation-chip">⚠ {v}</span>
              ))}
              {violations.length > 2 && (
                <span className="violation-chip">+{violations.length - 2} more</span>
              )}
            </div>
          )}
          <div className="card-footer-row">
            <span className="inspected-text">
              Inspected: {lastInspected ? new Date(lastInspected).toLocaleDateString('en-IN') : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
