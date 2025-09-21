import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { analytics } from './utils/analytics';
import { personalization } from './utils/personalization';

// Initialize analytics and personalization
const initializeApp = async () => {
  try {
    // Initialize analytics
    await analytics.init();
    
    // Initialize personalization
    await personalization.init();
    
    // Track app initialization
    analytics.track('app_initialized', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    console.log('EasyStay Retreats app initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Track initialization error
    analytics.trackError(error, {
      context: 'app_initialization'
    });
  }
};

// Initialize the app
initializeApp().then(() => {
  // Render the app
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

// Track page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    analytics.track('page_hidden', {
      timestamp: new Date().toISOString()
    });
  } else {
    analytics.track('page_visible', {
      timestamp: new Date().toISOString()
    });
  }
});

// Track page unload
window.addEventListener('beforeunload', () => {
  analytics.track('page_unload', {
    timestamp: new Date().toISOString()
  });
  
  // Flush any pending analytics events
  analytics.flush();
});

// Global error handler
window.addEventListener('error', (event) => {
  analytics.trackError(event.error, {
    context: 'global_error_handler',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  analytics.trackError(new Error(event.reason), {
    context: 'unhandled_promise_rejection',
    reason: event.reason
  });
});
