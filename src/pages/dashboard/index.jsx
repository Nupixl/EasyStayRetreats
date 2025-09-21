import React, { useState, useEffect } from 'react';
import { analytics } from '../../utils/analytics';
import { personalization } from '../../utils/personalization';
import DashboardLayout from '../../components/DashboardLayout';
import ABWrapper from '../../components/ABWrapper';

/**
 * Dashboard Index Page
 * Main dashboard overview with key metrics and quick actions
 */
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeProperties: 0,
    upcomingBookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call to load dashboard data
        const data = await fetchDashboardData();
        setDashboardData(data);

        // Track dashboard view
        analytics.trackPageView('dashboard', {
          userId: personalization.getUserProfile()?.id,
          userSegment: personalization.getUserSegment()
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Mock data - replace with actual API call
    return {
      totalBookings: 24,
      totalRevenue: 15680,
      activeProperties: 8,
      upcomingBookings: [
        {
          id: 1,
          propertyName: 'Mountain Zen Retreat',
          guestName: 'John Smith',
          checkIn: '2024-01-15',
          checkOut: '2024-01-18',
          status: 'confirmed'
        },
        {
          id: 2,
          propertyName: 'Beachside Villa',
          guestName: 'Sarah Johnson',
          checkIn: '2024-01-20',
          checkOut: '2024-01-25',
          status: 'pending'
        }
      ]
    };
  };

  const handleQuickAction = (action) => {
    analytics.trackAction('dashboard_quick_action', {
      action,
      userId: personalization.getUserProfile()?.id
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="dashboard-error">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="dashboard-page">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <h1>Welcome back!</h1>
          <p>Here's what's happening with your retreats today.</p>
        </div>

        {/* Key Metrics */}
        <div className="dashboard-metrics">
          <div className="metric-card">
            <div className="metric-icon">📅</div>
            <div className="metric-content">
              <h3>{dashboardData.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>${dashboardData.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🏡</div>
            <div className="metric-content">
              <h3>{dashboardData.activeProperties}</h3>
              <p>Active Properties</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('add_property')}
            >
              <span className="action-icon">➕</span>
              <span>Add Property</span>
            </button>
            
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('view_bookings')}
            >
              <span className="action-icon">📋</span>
              <span>View Bookings</span>
            </button>
            
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('manage_guests')}
            >
              <span className="action-icon">👥</span>
              <span>Manage Guests</span>
            </button>
            
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('view_analytics')}
            >
              <span className="action-icon">📊</span>
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="dashboard-upcoming">
          <h2>Upcoming Bookings</h2>
          
          {dashboardData.upcomingBookings.length > 0 ? (
            <div className="bookings-list">
              {dashboardData.upcomingBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-info">
                    <h4>{booking.propertyName}</h4>
                    <p>Guest: {booking.guestName}</p>
                    <p>Check-in: {booking.checkIn}</p>
                    <p>Check-out: {booking.checkOut}</p>
                  </div>
                  <div className="booking-status">
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bookings">
              <p>No upcoming bookings at the moment.</p>
            </div>
          )}
        </div>

        {/* A/B Test: Dashboard Layout */}
        <ABWrapper 
          testId="dashboard-layout"
          variants={[
            // Variant A: Compact layout
            <div key="compact" className="dashboard-layout-compact">
              <div className="compact-widgets">
                <div className="widget">
                  <h3>Recent Activity</h3>
                  <p>No recent activity</p>
                </div>
                <div className="widget">
                  <h3>Performance</h3>
                  <p>All metrics looking good!</p>
                </div>
              </div>
            </div>,
            // Variant B: Detailed layout
            <div key="detailed" className="dashboard-layout-detailed">
              <div className="detailed-widgets">
                <div className="widget-large">
                  <h3>Revenue Trend</h3>
                  <div className="chart-placeholder">
                    📈 Revenue trending upward
                  </div>
                </div>
                <div className="widget-large">
                  <h3>Guest Satisfaction</h3>
                  <div className="satisfaction-metrics">
                    <div className="metric">
                      <span className="metric-label">Overall Rating:</span>
                      <span className="metric-value">4.8/5</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Response Rate:</span>
                      <span className="metric-value">98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
