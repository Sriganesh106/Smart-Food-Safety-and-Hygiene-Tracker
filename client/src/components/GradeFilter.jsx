const GRADES = ['ALL', 'A', 'B', 'C', 'D', 'F'];

export default function GradeFilter({ active, onChange }) {
  return (
    <div className="grade-filters">
      {GRADES.map((g) => (
        <button
          key={g}
          className={`grade-filter-btn gf-${g} ${active === g ? 'active' : ''}`}
          onClick={() => onChange(g)}
        >
          {g === 'ALL' ? 'All Grades' : `Grade ${g}`}
        </button>
      ))}
    </div>
  );
}
