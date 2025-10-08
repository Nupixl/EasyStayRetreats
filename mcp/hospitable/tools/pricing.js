/**
 * Pricing Tools for Hospitable MCP Server
 */

const HospitableClient = require('../client');
const HospitableSync = require('../sync');

class PricingTools {
  constructor(hospitableClient, syncModule) {
    this.hospitable = hospitableClient;
    this.sync = syncModule;
  }

  /**
   * Get property pricing
   */
  async getPropertyPricing(propertyId, startDate, endDate) {
    try {
      const pricing = await this.hospitable.getPropertyPricing(propertyId, startDate, endDate);
      return {
        success: true,
        data: pricing
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update property pricing
   */
  async updatePropertyPricing(propertyId, pricingData) {
    try {
      const result = await this.hospitable.updatePropertyPricing(propertyId, pricingData);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get pricing suggestions
   */
  async getPricingSuggestions(propertyId, startDate, endDate) {
    try {
      const suggestions = await this.hospitable.getPricingSuggestions(propertyId, startDate, endDate);
      return {
        success: true,
        data: suggestions
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sync pricing from Hospitable to Supabase
   */
  async syncPropertyPricing(propertyId, startDate, endDate) {
    try {
      const result = await this.sync.syncPropertyPricing(propertyId, startDate, endDate);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sync all pricing data
   */
  async syncAllPricing(startDate, endDate) {
    try {
      const result = await this.sync.syncAllPricing(startDate, endDate);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = PricingTools;
