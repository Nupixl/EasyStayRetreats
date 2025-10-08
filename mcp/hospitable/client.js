/**
 * Hospitable API Client
 * Wrapper for Hospitable Public API with authentication and rate limiting
 */

const fetch = require('node-fetch');

class HospitableClient {
  constructor(apiKey, baseUrl = 'https://public.api.hospitable.com/v2') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.rateLimitDelay = 100; // 100ms between requests
    this.lastRequestTime = 0;
  }

  /**
   * Ensure rate limiting between requests
   */
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Make authenticated request to Hospitable API
   */
  async request(endpoint, options = {}) {
    await this.rateLimit();
    
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hospitable API Error ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Hospitable API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // ===== PROPERTY MANAGEMENT =====

  /**
   * Get all properties
   */
  async getProperties() {
    return this.request('/properties');
  }

  /**
   * Get specific property by ID
   */
  async getProperty(propertyId) {
    return this.request(`/properties/${propertyId}`);
  }

  /**
   * Create new property
   */
  async createProperty(propertyData) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    });
  }

  /**
   * Update property
   */
  async updateProperty(propertyId, propertyData) {
    return this.request(`/properties/${propertyId}`, {
      method: 'PATCH',
      body: JSON.stringify(propertyData)
    });
  }

  // ===== PRICING MANAGEMENT =====

  /**
   * Get pricing for a property
   */
  async getPropertyPricing(propertyId, startDate, endDate) {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return this.request(`/properties/${propertyId}/pricing?${params}`);
  }

  /**
   * Update pricing for a property
   */
  async updatePropertyPricing(propertyId, pricingData) {
    return this.request(`/properties/${propertyId}/pricing`, {
      method: 'PUT',
      body: JSON.stringify(pricingData)
    });
  }

  /**
   * Get dynamic pricing suggestions
   */
  async getPricingSuggestions(propertyId, startDate, endDate) {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return this.request(`/properties/${propertyId}/pricing/suggestions?${params}`);
  }

  // ===== CALENDAR & AVAILABILITY =====

  /**
   * Get calendar availability
   */
  async getCalendar(propertyId, startDate, endDate) {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return this.request(`/properties/${propertyId}/calendar?${params}`);
  }

  /**
   * Update calendar availability
   */
  async updateCalendar(propertyId, calendarData) {
    return this.request(`/properties/${propertyId}/calendar`, {
      method: 'PUT',
      body: JSON.stringify(calendarData)
    });
  }

  // ===== RESERVATIONS =====

  /**
   * Get reservations for a property
   */
  async getReservations(propertyId, startDate, endDate) {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate
    });
    return this.request(`/properties/${propertyId}/reservations?${params}`);
  }

  /**
   * Get specific reservation
   */
  async getReservation(reservationId) {
    return this.request(`/reservations/${reservationId}`);
  }

  /**
   * Update reservation
   */
  async updateReservation(reservationId, reservationData) {
    return this.request(`/reservations/${reservationId}`, {
      method: 'PATCH',
      body: JSON.stringify(reservationData)
    });
  }

  // ===== UTILITY METHODS =====

  /**
   * Test API connection
   */
  async testConnection() {
    try {
      await this.request('/properties');
      return { success: true, message: 'Hospitable API connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Get API rate limit status
   */
  async getRateLimitStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/rate-limit`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return await response.json();
    } catch (error) {
      console.warn('Could not fetch rate limit status:', error.message);
      return null;
    }
  }
}

module.exports = HospitableClient;
