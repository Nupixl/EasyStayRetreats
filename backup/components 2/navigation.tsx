'use client';

import { useState } from 'react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navigation">
      <div className="container-large padding-global">
        <div className="navigation_content">
          <div className="navigation_logo">
            <a href="/" className="navigation_logo-link">
              <span className="navigation_logo-text">Easy Stay Retreats</span>
            </a>
          </div>

          <div className={`navigation_menu ${isMenuOpen ? 'is-open' : ''}`}>
            <a href="/" className="navigation_link">
              Home
            </a>
            <a href="/search-properties" className="navigation_link">
              Search Properties
            </a>
            <a href="/book" className="navigation_link">
              Book Now
            </a>
            <a href="#about" className="navigation_link">
              About
            </a>
            <a href="#contact" className="navigation_link">
              Contact
            </a>
          </div>

          <div className="navigation_actions">
            <a href="/search-properties" className="button is-primary navigation_search-button">
              Search Properties
            </a>
            <button
              className="navigation_mobile-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="navigation_mobile-icon">
                {isMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
