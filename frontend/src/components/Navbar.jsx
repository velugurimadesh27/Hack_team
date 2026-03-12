import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, Code2 } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <Code2 className="logo-icon" />
          <span>HackBuild</span>
        </Link>

        <div className="navbar-links desktop-only">
          <Link to="/discovery" className="nav-link">Find Teammates</Link>
          <Link to="/teams" className="nav-link">Teams</Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn-primary">Join Now</Link>
            </>
          )}

          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        <div className="mobile-toggle desktop-hidden">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu glass-panel animate-fade-in">
          <Link to="/discovery" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Find Teammates</Link>
          <Link to="/teams" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Teams</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary w-full" style={{ marginTop: '1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Join Now</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
