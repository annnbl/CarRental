import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    { icon: '🔑', title: 'Easy Booking', desc: 'Book your car in minutes with our simple and fast booking process.' },
    { icon: '💰', title: 'Best Prices', desc: 'Competitive daily rates starting from ₹999 with no hidden charges.' },
    { icon: '🛡️', title: 'Fully Insured', desc: 'All cars come with comprehensive insurance coverage for peace of mind.' },
    { icon: '📍', title: 'Wide Selection', desc: 'From economy to luxury — find the perfect car for every occasion.' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">Premium Car Rental</div>
            <h1 className="hero-heading">Drive Your<br /><span>Dream Car</span><br />Today</h1>
            <p className="hero-sub">
              Choose from 100+ vehicles. Flexible dates. Transparent pricing.
              No surprises — just the open road.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/cars')}>
                Browse Cars →
              </button>
              {!user && (
                <button className="btn btn-ghost btn-lg" onClick={() => navigate('/register')}>
                  Create Account
                </button>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card card">
              <div className="stat-row">
                <div className="stat"><span className="stat-num">100+</span><span className="stat-lbl">Cars</span></div>
                <div className="stat"><span className="stat-num">50k+</span><span className="stat-lbl">Rides</span></div>
                <div className="stat"><span className="stat-num">4.9★</span><span className="stat-lbl">Rating</span></div>
              </div>
              <div className="hero-car-emoji">🚙</div>
              <p className="hero-card-tagline">Available 24/7 · Pickup anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose DriveEase?</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Ready to hit the road?</h2>
          <p>Browse our fleet and book in under 2 minutes.</p>
          <button className="btn btn-accent btn-lg" onClick={() => navigate('/cars')}>
            Explore All Cars →
          </button>
        </div>
      </section>
    </div>
  );
}
