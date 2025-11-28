import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your Gateway to
              <span className="gradient-text"> Amazing Events</span>
            </h1>
            <p className="hero-description">
              Discover, book, and experience the best events in your city. 
              From concerts to conferences, theater shows to sports events - 
              your perfect ticket awaits!
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="cta-button primary">
                🎫 Get Started
              </Link>
              <Link to="/login" className="cta-button secondary">
                👤 Sign In
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-header">
                <div className="card-icon">🎭</div>
                <div className="card-title">Concert Tonight</div>
              </div>
              <div className="card-content">
                <div className="event-detail">📅 Today, 8:00 PM</div>
                <div className="event-detail">📍 Madison Square</div>
                <div className="price">₹500.00</div>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-header">
                <div className="card-icon">🏈</div>
                <div className="card-title">Sports Event</div>
              </div>
              <div className="card-content">
                <div className="event-detail">📅 Tomorrow, 7:30 PM</div>
                <div className="event-detail">📍 Stadium Arena</div>
                <div className="price">₹1000.00</div>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-header">
                <div className="card-icon">🎪</div>
                <div className="card-title">Theater Show</div>
              </div>
              <div className="card-content">
                <div className="event-detail">📅 This Weekend</div>
                <div className="event-detail">📍 Arts Center</div>
                <div className="price">₹750.00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Go Ticket?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Booking</h3>
              <p>Book your tickets instantly with our fast and secure platform. No waiting, no hassle.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Your transactions are protected with bank-level security and encryption.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your tickets anywhere, anytime on any device. Digital tickets at your fingertips.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Best Prices</h3>
              <p>Get the best deals and exclusive offers on tickets for all your favorite events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Events Hosted</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Discover Amazing Events?</h2>
            <p>Join thousands of event-goers who trust Go Ticket for their entertainment needs.</p>
            <Link to="/register" className="cta-button primary large">
              🚀 Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Background Elements */}
      <div className="bg-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
        <div className="bg-gradient"></div>
      </div>
    </div>
  );
};

export default LandingPage;