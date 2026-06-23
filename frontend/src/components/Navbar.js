import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🚗</span>
          <span className="brand-text">DriveEase</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/cars" className={isActive('/cars') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Browse Cars</Link></li>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <li><Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/bookings" className={isActive('/bookings') ? 'active' : ''} onClick={() => setMenuOpen(false)}>My Bookings</Link></li>
                  <li><Link to="/profile" className={isActive('/profile') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Profile</Link></li>
                </>
              )}
              <li>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              <li className="user-chip">Hi, {user.name.split(' ')[0]} {user.role === 'admin' && <span className="admin-tag">Admin</span>}</li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
