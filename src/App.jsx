import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { analytics } from './utils/analytics';
import { personalization } from './utils/personalization';
import ABWrapper from './components/ABWrapper';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/dashboard';

/**
 * Main App Component
 * Root component that handles routing and global state
 */
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // Check authentication status
        const authStatus = await checkAuthentication();
        setIsAuthenticated(authStatus.isAuthenticated);
        setUser(authStatus.user);

        // Track app load
        analytics.track('app_loaded', {
          isAuthenticated: authStatus.isAuthenticated,
          userId: authStatus.user?.id,
          timestamp: new Date().toISOString()
        });

        setLoading(false);
      } catch (err) {
        console.error('App initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Check for stored authentication token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return { isAuthenticated: false, user: null };
      }

      // Validate token with server
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        return { isAuthenticated: true, user: userData };
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token');
        return { isAuthenticated: false, user: null };
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      return { isAuthenticated: false, user: null };
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const { token, user } = await response.json();
        
        // Store token
        localStorage.setItem('auth_token', token);
        
        // Update state
        setIsAuthenticated(true);
        setUser(user);

        // Track login
        analytics.track('user_login', {
          userId: user.id,
          timestamp: new Date().toISOString()
        });

        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const handleLogout = () => {
    // Remove token
    localStorage.removeItem('auth_token');
    
    // Update state
    setIsAuthenticated(false);
    setUser(null);

    // Clear personalization data
    personalization.clearUserData();

    // Track logout
    analytics.track('user_logout', {
      userId: user?.id,
      timestamp: new Date().toISOString()
    });
  };

  const handleRouteChange = (pathname) => {
    analytics.trackPageView(pathname, {
      userId: user?.id,
      isAuthenticated,
      timestamp: new Date().toISOString()
    });
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>EasyStay Retreats</h2>
          <p>Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reload App
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {/* A/B Test: App Header */}
        <ABWrapper 
          testId="app-header"
          variants={[
            // Variant A: Simple header
            <header key="simple" className="app-header simple">
              <div className="header-content">
                <h1 className="app-logo">EasyStay Retreats</h1>
                <nav className="header-nav">
                  <a href="/">Home</a>
                  {isAuthenticated && <a href="/dashboard">Dashboard</a>}
                </nav>
              </div>
            </header>,
            // Variant B: Enhanced header
            <header key="enhanced" className="app-header enhanced">
              <div className="header-content">
                <h1 className="app-logo">🏡 EasyStay Retreats</h1>
                <nav className="header-nav">
                  <a href="/">Home</a>
                  <a href="/search">Search</a>
                  {isAuthenticated && <a href="/dashboard">Dashboard</a>}
                  {isAuthenticated ? (
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  ) : (
                    <button className="login-btn">Login</button>
                  )}
                </nav>
              </div>
            </header>
          ]}
        />

        {/* Main Content */}
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <Home 
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogin={handleLogin}
                />
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <Dashboard 
                    user={user}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />

            {/* Dashboard Sub-routes */}
            {isAuthenticated && (
              <>
                <Route 
                  path="/dashboard/properties" 
                  element={
                    <DashboardLayout title="Properties" user={user} onLogout={handleLogout}>
                      <div>Properties Management</div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/dashboard/bookings" 
                  element={
                    <DashboardLayout title="Bookings" user={user} onLogout={handleLogout}>
                      <div>Bookings Management</div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/dashboard/guests" 
                  element={
                    <DashboardLayout title="Guests" user={user} onLogout={handleLogout}>
                      <div>Guest Management</div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/dashboard/analytics" 
                  element={
                    <DashboardLayout title="Analytics" user={user} onLogout={handleLogout}>
                      <div>Analytics Dashboard</div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/dashboard/settings" 
                  element={
                    <DashboardLayout title="Settings" user={user} onLogout={handleLogout}>
                      <div>Settings</div>
                    </DashboardLayout>
                  } 
                />
              </>
            )}

            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div className="not-found">
                  <h2>404 - Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/">Go Home</a>
                </div>
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p>&copy; 2024 EasyStay Retreats. All rights reserved.</p>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
