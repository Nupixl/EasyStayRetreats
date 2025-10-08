/**
 * Calendar Tools for Hospitable MCP Server
 */

const HospitableClient = require('../client');
const HospitableSync = require('../sync');

class CalendarTools {
  constructor(hospitableClient, syncModule) {
    this.hospitable = hospitableClient;
    this.sync = syncModule;
  }

  /**
   * Get calendar availability
   */
  async getCalendar(propertyId, startDate, endDate) {
    try {
      const calendar = await this.hospitable.getCalendar(propertyId, startDate, endDate);
      return {
        success: true,
        data: calendar
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update calendar availability
   */
  async updateCalendar(propertyId, calendarData) {
    try {
      const result = await this.hospitable.updateCalendar(propertyId, calendarData);
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
   * Sync calendar from Hospitable to Supabase
   */
  async syncPropertyCalendar(propertyId, startDate, endDate) {
    try {
      const result = await this.sync.syncPropertyCalendar(propertyId, startDate, endDate);
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
   * Sync all calendars
   */
  async syncAllCalendars(startDate, endDate) {
    try {
      const result = await this.sync.syncAllCalendars(startDate, endDate);
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

module.exports = CalendarTools;
