import React, { useState, useEffect } from 'react';
import { analytics } from '../utils/analytics';
import { personalization } from '../utils/personalization';

/**
 * DashboardLayout - Main dashboard layout component
 * Provides responsive dashboard layout with sidebar navigation
 */
const DashboardLayout = ({ 
  children, 
  title = "Dashboard",
  showSidebar = true,
  showHeader = true,
  user = null,
  onLogout,
  className = '',
  ...props 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(user);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Load user profile if not provided
        if (!userProfile) {
          const profile = await personalization.getUserProfile();
          setUserProfile(profile);
        }

        // Load notifications
        const userNotifications = await loadNotifications();
        setNotifications(userNotifications);

        // Track dashboard view
        analytics.track('dashboard_viewed', {
          userId: userProfile?.id,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Dashboard initialization error:', error);
      }
    };

    initializeDashboard();
  }, [userProfile, user]);

  const loadNotifications = async () => {
    // Mock notifications - replace with actual API call
    return [
      { id: 1, message: "Welcome to EasyStay Retreats!", type: "info", read: false },
      { id: 2, message: "New booking available", type: "success", read: false },
      { id: 3, message: "Payment processed", type: "success", read: true }
    ];
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
    analytics.track('sidebar_toggled', {
      open: !sidebarOpen,
      timestamp: new Date().toISOString()
    });
  };

  const handleNotificationClick = (notification) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    
    analytics.track('notification_clicked', {
      notificationId: notification.id,
      type: notification.type,
      timestamp: new Date().toISOString()
    });
  };

  const handleLogout = () => {
    analytics.track('user_logout', {
      userId: userProfile?.id,
      timestamp: new Date().toISOString()
    });
    
    if (onLogout) {
      onLogout();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`dashboard-layout ${className}`} {...props}>
      {/* Header */}
      {showHeader && (
        <header className="dashboard-header">
          <div className="dashboard-header__left">
            <button 
              className="dashboard-header__menu-btn"
              onClick={handleSidebarToggle}
              aria-label="Toggle sidebar"
            >
              <span className="hamburger">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            <h1 className="dashboard-header__title">{title}</h1>
          </div>
          
          <div className="dashboard-header__right">
            {/* Notifications */}
            <div className="dashboard-header__notifications">
              <button 
                className="notification-btn"
                aria-label={`${unreadCount} unread notifications`}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              <div className="notifications-dropdown">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-type">{notification.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Profile */}
            {userProfile && (
              <div className="dashboard-header__user">
                <div className="user-avatar">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt={userProfile.name} />
                  ) : (
                    <span>{userProfile.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{userProfile.name}</span>
                  <span className="user-role">{userProfile.role}</span>
                </div>
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      <div className="dashboard-content">
        {/* Sidebar */}
        {showSidebar && (
          <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <nav className="dashboard-nav">
              <ul className="nav-list">
                <li className="nav-item">
                  <a href="/dashboard" className="nav-link active">
                    <span className="nav-icon">🏠</span>
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/dashboard/properties" className="nav-link">
                    <span className="nav-icon">🏡</span>
                    Properties
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/dashboard/bookings" className="nav-link">
                    <span className="nav-icon">📅</span>
                    Bookings
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/dashboard/guests" className="nav-link">
                    <span className="nav-icon">👥</span>
                    Guests
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/dashboard/analytics" className="nav-link">
                    <span className="nav-icon">📊</span>
                    Analytics
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/dashboard/settings" className="nav-link">
                    <span className="nav-icon">⚙️</span>
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-main__content">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="dashboard-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
