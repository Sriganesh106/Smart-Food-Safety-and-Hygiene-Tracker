import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">🍽️ Safe<span>Eats</span></Link>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/restaurants/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>+ Add Restaurant</NavLink>
          )}
        </div>
        <div className="navbar-actions">
          {user ? (
            <>
              <div className="user-chip">👤 {user.username}</div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
