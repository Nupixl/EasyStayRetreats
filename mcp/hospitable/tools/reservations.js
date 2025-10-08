/**
 * Reservation Tools for Hospitable MCP Server
 */

const HospitableClient = require('../client');

class ReservationTools {
  constructor(hospitableClient) {
    this.hospitable = hospitableClient;
  }

  /**
   * Get reservations for a property
   */
  async getReservations(propertyId, startDate, endDate) {
    try {
      const reservations = await this.hospitable.getReservations(propertyId, startDate, endDate);
      return {
        success: true,
        data: reservations
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get specific reservation
   */
  async getReservation(reservationId) {
    try {
      const reservation = await this.hospitable.getReservation(reservationId);
      return {
        success: true,
        data: reservation
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update reservation
   */
  async updateReservation(reservationId, reservationData) {
    try {
      const result = await this.hospitable.updateReservation(reservationId, reservationData);
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

module.exports = ReservationTools;
