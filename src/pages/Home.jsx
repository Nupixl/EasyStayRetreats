import React, { useState, useEffect } from 'react';
import { analytics } from '../utils/analytics';
import { personalization } from '../utils/personalization';
import ABWrapper from '../components/ABWrapper';
import DashboardLayout from '../components/DashboardLayout';

/**
 * Home Page Component
 * Main landing page for the EasyStay Retreats application
 */
const Home = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeHome = async () => {
      try {
        setLoading(true);
        
        // Load user profile
        const profile = await personalization.getUserProfile();
        setUserProfile(profile);

        // Get personalized recommendations
        const recs = await personalization.getRecommendations('properties', 6);
        setRecommendations(recs);

        // Track page view
        analytics.trackPageView('home', {
          userId: profile?.id,
          userSegment: personalization.getUserSegment()
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize home page:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeHome();
  }, []);

  const handlePropertyClick = (propertyId) => {
    analytics.trackAction('property_clicked', {
      propertyId,
      source: 'home_page',
      userId: userProfile?.id
    });
  };

  const handleBookNow = (propertyId) => {
    analytics.trackConversion('booking_started', 0, {
      propertyId,
      source: 'home_page',
      userId: userProfile?.id
    });
  };

  const handleSearchSubmit = (searchData) => {
    analytics.trackAction('search_submitted', {
      ...searchData,
      source: 'home_page',
      userId: userProfile?.id
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="EasyStay Retreats" showSidebar={false}>
        <div className="home-loading">
          <div className="loading-spinner"></div>
          <p>Loading your personalized retreat recommendations...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="EasyStay Retreats" showSidebar={false}>
        <div className="home-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const welcomeMessage = personalization.getPersonalizedMessage('welcome');
  const ctaMessage = personalization.getPersonalizedMessage('cta');

  return (
    <DashboardLayout title="EasyStay Retreats" showSidebar={false}>
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              {welcomeMessage}
            </h1>
            <p className="hero-subtitle">
              Discover amazing retreats tailored just for you
            </p>
            
            {/* A/B Test: Search Form */}
            <ABWrapper 
              testId="home-search-form"
              variants={[
                // Variant A: Simple search
                <div key="simple" className="search-form-variant-a">
                  <div className="search-input-group">
                    <input 
                      type="text" 
                      placeholder="Where do you want to go?"
                      className="search-input"
                    />
                    <button className="search-button">
                      Search
                    </button>
                  </div>
                </div>,
                // Variant B: Advanced search
                <div key="advanced" className="search-form-variant-b">
                  <div className="search-filters">
                    <input 
                      type="text" 
                      placeholder="Destination"
                      className="search-input"
                    />
                    <input 
                      type="date" 
                      placeholder="Check-in"
                      className="search-input"
                    />
                    <input 
                      type="date" 
                      placeholder="Check-out"
                      className="search-input"
                    />
                    <select className="search-select">
                      <option>Guests</option>
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3+ Guests</option>
                    </select>
                    <button className="search-button">
                      {ctaMessage}
                    </button>
                  </div>
                </div>
              ]}
            />
          </div>
        </section>

        {/* Personalized Recommendations */}
        <section className="recommendations-section">
          <h2 className="section-title">
            Recommended for You
          </h2>
          
          {recommendations.length > 0 ? (
            <div className="recommendations-grid">
              {recommendations.map((property) => (
                <div 
                  key={property.id} 
                  className="property-card"
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <div className="property-image">
                    <img 
                      src={property.image || '/images/placeholder-property.jpg'} 
                      alt={property.title}
                    />
                    <div className="property-badge">
                      {property.badge || 'Recommended'}
                    </div>
                  </div>
                  
                  <div className="property-content">
                    <h3 className="property-title">{property.title}</h3>
                    <p className="property-location">{property.location}</p>
                    <div className="property-rating">
                      <span className="rating-stars">⭐ {property.rating}</span>
                      <span className="rating-count">({property.reviewCount} reviews)</span>
                    </div>
                    <div className="property-price">
                      <span className="price-amount">${property.price}</span>
                      <span className="price-period">/ night</span>
                    </div>
                    
                    <button 
                      className="book-now-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNow(property.id);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-recommendations">
              <p>No recommendations available at the moment.</p>
              <p>Try searching for properties to get personalized suggestions!</p>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Why Choose EasyStay Retreats?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏡</div>
              <h3>Curated Properties</h3>
              <p>Hand-picked retreats that meet our high standards for comfort and quality.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Matching</h3>
              <p>AI-powered recommendations based on your preferences and travel history.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Booking</h3>
              <p>Safe and secure payment processing with 24/7 customer support.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Verified Reviews</h3>
              <p>Real reviews from verified guests to help you make informed decisions.</p>
            </div>
          </div>
        </section>

        {/* User Segment Specific Content */}
        <ABWrapper 
          testId="home-segment-content"
          variants={[
            // Business Traveler Content
            ({ userSegment }) => userSegment === 'business_traveler' && (
              <section key="business" className="segment-content business-traveler">
                <h2>Business Travel Made Easy</h2>
                <p>Find retreats with reliable WiFi, quiet workspaces, and business amenities.</p>
                <div className="business-features">
                  <span>📶 High-Speed WiFi</span>
                  <span>💼 Workspace</span>
                  <span>☕ Coffee Station</span>
                  <span>🚗 Parking</span>
                </div>
              </section>
            ),
            // Family Traveler Content
            ({ userSegment }) => userSegment === 'family_traveler' && (
              <section key="family" className="segment-content family-traveler">
                <h2>Family-Friendly Retreats</h2>
                <p>Safe, spacious properties perfect for family getaways with kids.</p>
                <div className="family-features">
                  <span>👶 Child-Safe</span>
                  <span>🏊 Pool</span>
                  <span>🎮 Games</span>
                  <span>🍕 Kitchen</span>
                </div>
              </section>
            ),
            // Default Content
            <section key="default" className="segment-content default">
              <h2>Discover Your Perfect Retreat</h2>
              <p>From cozy cabins to luxury villas, find the perfect getaway for your next trip.</p>
            </section>
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default Home;
