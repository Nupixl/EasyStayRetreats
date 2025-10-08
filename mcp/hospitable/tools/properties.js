/**
 * Property Management Tools for Hospitable MCP Server
 */

const HospitableClient = require('../client');
const HospitableSync = require('../sync');

class PropertyTools {
  constructor(hospitableClient, syncModule) {
    this.hospitable = hospitableClient;
    this.sync = syncModule;
  }

  /**
   * Get property information
   */
  async getProperty(propertyId) {
    try {
      const property = await this.hospitable.getProperty(propertyId);
      return {
        success: true,
        data: property
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * List all properties
   */
  async listProperties() {
    try {
      const properties = await this.hospitable.getProperties();
      return {
        success: true,
        data: properties
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create new property
   */
  async createProperty(propertyData) {
    try {
      const property = await this.hospitable.createProperty(propertyData);
      return {
        success: true,
        data: property
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update property
   */
  async updateProperty(propertyId, propertyData) {
    try {
      const property = await this.hospitable.updateProperty(propertyId, propertyData);
      return {
        success: true,
        data: property
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sync property from Hospitable to Supabase
   */
  async syncProperty(propertyId) {
    try {
      const result = await this.sync.syncProperty(propertyId);
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
   * Get property sync status
   */
  async getPropertySyncStatus(propertyId) {
    try {
      const status = await this.sync.getPropertySyncStatus(propertyId);
      return {
        success: true,
        data: status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = PropertyTools;
