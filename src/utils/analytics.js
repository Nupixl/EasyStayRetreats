/**
 * Analytics Utility
 * Provides analytics tracking functionality for the EasyStay Retreats application
 */

class Analytics {
  constructor() {
    this.isInitialized = false;
    this.queue = [];
    this.config = {
      apiEndpoint: process.env.REACT_APP_ANALYTICS_ENDPOINT || '/api/analytics',
      batchSize: 10,
      flushInterval: 5000, // 5 seconds
      enableDebug: process.env.NODE_ENV === 'development'
    };
  }

  /**
   * Initialize analytics
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Load user session
      this.sessionId = this.getOrCreateSessionId();
      this.userId = this.getUserId();
      
      // Start batch processing
      this.startBatchProcessor();
      
      this.isInitialized = true;
      this.log('Analytics initialized', { sessionId: this.sessionId, userId: this.userId });
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  /**
   * Track an event
   */
  track(eventName, properties = {}) {
    if (!this.isInitialized) {
      this.queue.push({ eventName, properties });
      return;
    }

    const event = {
      eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    };

    this.queue.push(event);
    this.log('Event tracked', event);

    // Flush if queue is full
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName, properties = {}) {
    this.track('page_view', {
      pageName,
      ...properties
    });
  }

  /**
   * Track user action
   */
  trackAction(action, properties = {}) {
    this.track('user_action', {
      action,
      ...properties
    });
  }

  /**
   * Track conversion
   */
  trackConversion(conversionType, value, properties = {}) {
    this.track('conversion', {
      conversionType,
      value,
      ...properties
    });
  }

  /**
   * Track error
   */
  trackError(error, properties = {}) {
    this.track('error', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...properties
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties) {
    this.track('user_properties_set', properties);
  }

  /**
   * Identify user
   */
  identify(userId, properties = {}) {
    this.userId = userId;
    localStorage.setItem('analytics_user_id', userId);
    
    this.track('user_identified', {
      userId,
      ...properties
    });
  }

  /**
   * Flush events to server
   */
  async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          sessionId: this.sessionId,
          userId: this.userId
        })
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      this.log('Events flushed', { count: events.length });
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-queue events for retry
      this.queue.unshift(...events);
    }
  }

  /**
   * Start batch processor
   */
  startBatchProcessor() {
    setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Get or create session ID
   */
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get user ID
   */
  getUserId() {
    return localStorage.getItem('analytics_user_id') || null;
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'analytics_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Log debug information
   */
  log(message, data = {}) {
    if (this.config.enableDebug) {
      console.log(`[Analytics] ${message}`, data);
    }
  }

  /**
   * Get analytics data
   */
  async getAnalyticsData(timeRange = '7d', metrics = []) {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/data?timeRange=${timeRange}&metrics=${metrics.join(',')}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      return null;
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metricName, value, properties = {}) {
    this.track('performance_metric', {
      metricName,
      value,
      ...properties
    });
  }

  /**
   * Track A/B test events
   */
  trackABTest(testId, variant, event, properties = {}) {
    this.track('ab_test_event', {
      testId,
      variant,
      event,
      ...properties
    });
  }
}

// Create singleton instance
const analytics = new Analytics();

// Auto-initialize
analytics.init();

export { analytics };
export default analytics;
