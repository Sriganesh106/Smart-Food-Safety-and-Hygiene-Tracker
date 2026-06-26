const GRADE_COLORS = { A: '#10b981', B: '#84cc16', C: '#f59e0b', D: '#f97316', F: '#ef4444' };

export function GradeBadge({ grade, large }) {
  const color = GRADE_COLORS[grade] || '#8b9cbf';
  return (
    <div className={`grade-badge grade-${grade} ${large ? 'lg' : ''}`}>{grade}</div>
  );
}

export function ScoreBar({ score, grade }) {
  const color = GRADE_COLORS[grade] || '#8b9cbf';
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function HygieneGauge({ score, grade, size = 120 }) {
  const color = GRADE_COLORS[grade] || '#8b9cbf';
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="gauge-wrap">
      <svg width={size} height={size} viewBox="0 0 100 100" className="gauge-svg">
        <circle cx="50" cy="50" r={r} className="gauge-track" />
        <circle
          cx="50" cy="50" r={r}
          className="gauge-fill"
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
        <text x="50" y="46" textAnchor="middle" className="gauge-text" style={{ fill: color }}>
          {score}
        </text>
        <text x="50" y="60" textAnchor="middle" className="gauge-label">/ 100</text>
      </svg>
    </div>
  );
}
