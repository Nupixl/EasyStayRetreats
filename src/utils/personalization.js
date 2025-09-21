/**
 * Personalization Utility
 * Provides personalization and user segmentation functionality
 */

class Personalization {
  constructor() {
    this.isInitialized = false;
    this.userProfile = null;
    this.userSegment = null;
    this.preferences = {};
    this.config = {
      apiEndpoint: process.env.REACT_APP_PERSONALIZATION_ENDPOINT || '/api/personalization',
      enableDebug: process.env.NODE_ENV === 'development'
    };
  }

  /**
   * Initialize personalization
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Load user profile and preferences
      await this.loadUserProfile();
      await this.loadUserPreferences();
      await this.determineUserSegment();
      
      this.isInitialized = true;
      this.log('Personalization initialized', { 
        userId: this.userProfile?.id,
        segment: this.userSegment 
      });
    } catch (error) {
      console.error('Personalization initialization failed:', error);
    }
  }

  /**
   * Load user profile
   */
  async loadUserProfile() {
    try {
      // Try to get from localStorage first
      const storedProfile = localStorage.getItem('user_profile');
      if (storedProfile) {
        this.userProfile = JSON.parse(storedProfile);
        return;
      }

      // Fetch from API
      const response = await fetch(`${this.config.apiEndpoint}/profile`);
      if (response.ok) {
        this.userProfile = await response.json();
        localStorage.setItem('user_profile', JSON.stringify(this.userProfile));
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      this.userProfile = this.getDefaultProfile();
    }
  }

  /**
   * Load user preferences
   */
  async loadUserPreferences() {
    try {
      const storedPreferences = localStorage.getItem('user_preferences');
      if (storedPreferences) {
        this.preferences = JSON.parse(storedPreferences);
        return;
      }

      const response = await fetch(`${this.config.apiEndpoint}/preferences`);
      if (response.ok) {
        this.preferences = await response.json();
        localStorage.setItem('user_preferences', JSON.stringify(this.preferences));
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      this.preferences = this.getDefaultPreferences();
    }
  }

  /**
   * Determine user segment
   */
  async determineUserSegment() {
    try {
      if (!this.userProfile) {
        this.userSegment = 'anonymous';
        return;
      }

      // Calculate segment based on user data
      const segment = this.calculateUserSegment(this.userProfile);
      this.userSegment = segment;

      // Store segment
      localStorage.setItem('user_segment', segment);
    } catch (error) {
      console.error('Failed to determine user segment:', error);
      this.userSegment = 'default';
    }
  }

  /**
   * Calculate user segment based on profile data
   */
  calculateUserSegment(profile) {
    const { age, income, location, bookingHistory, preferences } = profile;

    // Business traveler
    if (preferences?.businessTravel || bookingHistory?.businessBookings > 5) {
      return 'business_traveler';
    }

    // Luxury seeker
    if (income > 100000 || preferences?.luxuryAccommodations) {
      return 'luxury_seeker';
    }

    // Budget conscious
    if (income < 50000 || preferences?.budgetFriendly) {
      return 'budget_conscious';
    }

    // Family traveler
    if (profile.familySize > 2 || preferences?.familyFriendly) {
      return 'family_traveler';
    }

    // Solo traveler
    if (profile.familySize === 1 && age < 35) {
      return 'solo_traveler';
    }

    // Senior traveler
    if (age > 65) {
      return 'senior_traveler';
    }

    return 'general_traveler';
  }

  /**
   * Get personalized content
   */
  async getPersonalizedContent(contentType, options = {}) {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          userSegment: this.userSegment,
          userProfile: this.userProfile,
          preferences: this.preferences,
          ...options
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get personalized content:', error);
    }

    return this.getDefaultContent(contentType);
  }

  /**
   * Get personalized recommendations
   */
  async getRecommendations(type = 'properties', limit = 10) {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          limit,
          userSegment: this.userSegment,
          userProfile: this.userProfile,
          preferences: this.preferences
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }

    return [];
  }

  /**
   * Update user preferences
   */
  async updatePreferences(newPreferences) {
    try {
      this.preferences = { ...this.preferences, ...newPreferences };
      localStorage.setItem('user_preferences', JSON.stringify(this.preferences));

      const response = await fetch(`${this.config.apiEndpoint}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.preferences)
      });

      if (response.ok) {
        this.log('Preferences updated', newPreferences);
        return true;
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }

    return false;
  }

  /**
   * Get user segment
   */
  getUserSegment() {
    return this.userSegment;
  }

  /**
   * Get user profile
   */
  getUserProfile() {
    return this.userProfile;
  }

  /**
   * Get user preferences
   */
  getUserPreferences() {
    return this.preferences;
  }

  /**
   * Check if user is in segment
   */
  isInSegment(segment) {
    return this.userSegment === segment;
  }

  /**
   * Get personalized messaging
   */
  getPersonalizedMessage(messageType, fallback = '') {
    const messages = {
      welcome: {
        business_traveler: 'Welcome back! Ready for your next business trip?',
        luxury_seeker: 'Welcome! Discover our premium retreats.',
        budget_conscious: 'Welcome! Find amazing deals on your next getaway.',
        family_traveler: 'Welcome! Perfect family retreats await.',
        solo_traveler: 'Welcome! Explore solo travel adventures.',
        senior_traveler: 'Welcome! Relaxing retreats for your next trip.',
        general_traveler: 'Welcome to EasyStay Retreats!'
      },
      cta: {
        business_traveler: 'Book Your Business Stay',
        luxury_seeker: 'Experience Luxury',
        budget_conscious: 'Find Great Deals',
        family_traveler: 'Plan Family Fun',
        solo_traveler: 'Start Your Adventure',
        senior_traveler: 'Book Your Retreat',
        general_traveler: 'Book Now'
      }
    };

    return messages[messageType]?.[this.userSegment] || fallback;
  }

  /**
   * Get default profile
   */
  getDefaultProfile() {
    return {
      id: null,
      name: 'Guest',
      email: null,
      age: null,
      income: null,
      location: null,
      familySize: 1,
      bookingHistory: {
        totalBookings: 0,
        businessBookings: 0,
        averageSpend: 0
      }
    };
  }

  /**
   * Get default preferences
   */
  getDefaultPreferences() {
    return {
      budgetFriendly: false,
      luxuryAccommodations: false,
      businessTravel: false,
      familyFriendly: false,
      petFriendly: false,
      accessibility: false,
      preferredLocations: [],
      preferredAmenities: []
    };
  }

  /**
   * Get default content
   */
  getDefaultContent(contentType) {
    const defaultContent = {
      properties: [],
      offers: [],
      recommendations: []
    };

    return defaultContent[contentType] || [];
  }

  /**
   * Log debug information
   */
  log(message, data = {}) {
    if (this.config.enableDebug) {
      console.log(`[Personalization] ${message}`, data);
    }
  }

  /**
   * Clear user data
   */
  clearUserData() {
    this.userProfile = null;
    this.userSegment = null;
    this.preferences = {};
    
    localStorage.removeItem('user_profile');
    localStorage.removeItem('user_preferences');
    localStorage.removeItem('user_segment');
    
    this.log('User data cleared');
  }
}

// Create singleton instance
const personalization = new Personalization();

// Auto-initialize
personalization.init();

export { personalization };
export default personalization;
