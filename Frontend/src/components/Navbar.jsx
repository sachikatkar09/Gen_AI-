import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import "../styles/navbar.scss";

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo and Brand */}
        <Link to="/" className="navbar__brand">
          <div className="navbar__logo-icon">P</div>
          <span className="navbar__logo-text">PrepPro</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="navbar__hamburger"></span>
        </button>

        {/* Navigation Menu */}
        <div className={`navbar__menu ${isMobileMenuOpen ? "navbar__menu--active" : ""}`}>
          {!user ? (
            // Unauthenticated Navigation
            <div className="navbar__nav-items">
              <NavLink to="/features" className="navbar__link">Features</NavLink>
              <NavLink to="/about" className="navbar__link">About</NavLink>
              <Link to="/login" className="navbar__link navbar__link--cta">Login</Link>
              <Link to="/register" className="navbar__button navbar__button--primary">
                Register
              </Link>
            </div>
          ) : (
            // Authenticated Navigation
            <div className="navbar__nav-items">
              <Link to="/dashboard" className="navbar__link">Dashboard</Link>
              <Link to="/resume" className="navbar__link">Resume Builder</Link>
              <Link to="/mock-interview" className="navbar__link">Mock Interview</Link>
              <Link to="/ai-interview" className="navbar__link">AI Interview</Link>
              <Link to="/profile" className="navbar__link">Profile</Link>
              <button 
                onClick={handleLogoutClick} 
                className="navbar__button navbar__button--secondary"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
