export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">🍽️ SafeEats</div>
      <p className="footer-text">Smart Food Safety &amp; Hygiene Tracker · Bengaluru · {new Date().getFullYear()}</p>
    </footer>
  );
}
