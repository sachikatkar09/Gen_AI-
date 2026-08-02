import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import "../styles/navbar.scss";

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo and Brand */}
        <Link to="/" className="navbar__brand" onClick={closeMobileMenu}>
          <div className="navbar__logo-icon">✨</div>
          <span className="navbar__logo-text">PrepPro</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className={`navbar__mobile-toggle ${isMobileMenuOpen ? 'navbar__mobile-toggle--active' : ''}`}
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
              <NavLink
                to="/features"
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                Features
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                About
              </NavLink>
              <Link
                to="/login"
                className="navbar__link"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="navbar__button navbar__button--primary"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </div>
          ) : (
            // Authenticated Navigation
            <div className="navbar__nav-items">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/resume"
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                Resume Builder
              </NavLink>
              <NavLink
                to="/ai-interview"
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                AI Interview
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogoutClick}
                className="navbar__button navbar__button--primary"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="navbar__overlay" onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;
