/**
 * Price Estimation Utility
 * Calculates total cost for property bookings with dynamic pricing
 */

const { createClient } = require('@supabase/supabase-js');

class PriceEstimator {
  constructor(supabaseUrl, supabaseKey) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Calculate total price for a booking
   * @param {string} propertyId - Supabase property ID
   * @param {string} checkIn - Check-in date (YYYY-MM-DD)
   * @param {string} checkOut - Check-out date (YYYY-MM-DD)
   * @param {Object} options - Additional options
   * @param {number} options.guests - Number of guests
   * @param {boolean} options.pets - Whether pets are included
   * @param {boolean} options.includeFees - Whether to include fees in calculation
   * @returns {Object} Price breakdown
   */
  async calculatePrice(propertyId, checkIn, checkOut, options = {}) {
    try {
      const {
        guests = 1,
        pets = false,
        includeFees = true
      } = options;

      // Get property pricing configuration
      const pricingConfig = await this.getPricingConfig(propertyId);
      if (!pricingConfig) {
        throw new Error('Property pricing configuration not found');
      }

      // Get daily pricing for the date range
      const dailyPricing = await this.getDailyPricing(propertyId, checkIn, checkOut);
      
      // Get seasonal pricing rules
      const seasonalRules = await this.getSeasonalRules(propertyId, checkIn, checkOut);
      
      // Get booking fees
      const fees = includeFees ? await this.getBookingFees(propertyId) : null;

      // Calculate base price
      const basePrice = this.calculateBasePrice(
        dailyPricing,
        pricingConfig,
        seasonalRules,
        checkIn,
        checkOut
      );

      // Calculate fees
      const feeBreakdown = fees ? this.calculateFees(fees, basePrice, guests, pets) : {};

      // Calculate total
      const totalFees = Object.values(feeBreakdown).reduce((sum, fee) => sum + fee, 0);
      const total = basePrice + totalFees;

      // Generate daily breakdown
      const dailyBreakdown = this.generateDailyBreakdown(
        dailyPricing,
        pricingConfig,
        seasonalRules,
        checkIn,
        checkOut
      );

      return {
        propertyId,
        checkIn,
        checkOut,
        nights: this.calculateNights(checkIn, checkOut),
        basePrice: Math.round(basePrice * 100) / 100,
        fees: feeBreakdown,
        totalFees: Math.round(totalFees * 100) / 100,
        total: Math.round(total * 100) / 100,
        currency: pricingConfig.currency || 'USD',
        dailyBreakdown,
        pricing: {
          basePrice: pricingConfig.base_price,
          minPrice: pricingConfig.min_price,
          maxPrice: pricingConfig.max_price,
          strategy: pricingConfig.pricing_strategy
        }
      };
    } catch (error) {
      console.error('Price calculation error:', error);
      throw error;
    }
  }

  /**
   * Get pricing configuration for a property
   */
  async getPricingConfig(propertyId) {
    const { data, error } = await this.supabase
      .from('property_pricing_config')
      .select('*')
      .eq('property_id', propertyId)
      .single();

    if (error) {
      console.error('Error fetching pricing config:', error);
      return null;
    }

    return data;
  }

  /**
   * Get daily pricing for date range
   */
  async getDailyPricing(propertyId, startDate, endDate) {
    const { data, error } = await this.supabase
      .from('daily_pricing')
      .select('*')
      .eq('property_id', propertyId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (error) {
      console.error('Error fetching daily pricing:', error);
      return [];
    }

    return data;
  }

  /**
   * Get seasonal pricing rules for date range
   */
  async getSeasonalRules(propertyId, startDate, endDate) {
    const { data, error } = await this.supabase
      .from('seasonal_pricing_rules')
      .select('*')
      .eq('property_id', propertyId)
      .eq('is_active', true)
      .lte('start_date', endDate)
      .gte('end_date', startDate);

    if (error) {
      console.error('Error fetching seasonal rules:', error);
      return [];
    }

    return data;
  }

  /**
   * Get booking fees for a property
   */
  async getBookingFees(propertyId) {
    const { data, error } = await this.supabase
      .from('booking_fees')
      .select('*')
      .eq('property_id', propertyId)
      .single();

    if (error) {
      console.error('Error fetching booking fees:', error);
      return null;
    }

    return data;
  }

  /**
   * Calculate base price from daily pricing and rules
   */
  calculateBasePrice(dailyPricing, config, seasonalRules, checkIn, checkOut) {
    const dates = this.getDateRange(checkIn, checkOut);
    let totalPrice = 0;

    for (const date of dates) {
      // Check for specific daily pricing
      const dailyPrice = dailyPricing.find(p => p.date === date);
      
      if (dailyPrice) {
        totalPrice += dailyPrice.price;
        continue;
      }

      // Check for seasonal rules
      const seasonalRule = seasonalRules.find(rule => 
        date >= rule.start_date && date <= rule.end_date
      );

      let basePrice = config.base_price;

      if (seasonalRule) {
        if (seasonalRule.fixed_price) {
          basePrice = seasonalRule.fixed_price;
        } else {
          basePrice *= seasonalRule.price_multiplier;
        }
      }

      // Apply weekend multiplier
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
        basePrice *= config.weekend_multiplier;
      }

      // Apply min/max constraints
      basePrice = Math.max(basePrice, config.min_price || 0);
      basePrice = Math.min(basePrice, config.max_price || Infinity);

      totalPrice += basePrice;
    }

    return totalPrice;
  }

  /**
   * Calculate fees
   */
  calculateFees(fees, basePrice, guests, pets) {
    const feeBreakdown = {};

    // Cleaning fee (fixed)
    if (fees.cleaning_fee > 0) {
      feeBreakdown.cleaning = fees.cleaning_fee;
    }

    // Service fee (percentage of base price)
    if (fees.service_fee_percent > 0) {
      feeBreakdown.service = (basePrice * fees.service_fee_percent) / 100;
    }

    // Pet fee
    if (pets && fees.pet_fee > 0) {
      feeBreakdown.pets = fees.pet_fee;
    }

    // Extra guest fee
    if (guests > fees.extra_guest_threshold && fees.extra_guest_fee > 0) {
      const extraGuests = guests - fees.extra_guest_threshold;
      feeBreakdown.extraGuests = extraGuests * fees.extra_guest_fee;
    }

    return feeBreakdown;
  }

  /**
   * Generate daily breakdown
   */
  generateDailyBreakdown(dailyPricing, config, seasonalRules, checkIn, checkOut) {
    const dates = this.getDateRange(checkIn, checkOut);
    const breakdown = [];

    for (const date of dates) {
      const dailyPrice = dailyPricing.find(p => p.date === date);
      const seasonalRule = seasonalRules.find(rule => 
        date >= rule.start_date && date <= rule.end_date
      );

      let price = config.base_price;
      let reason = 'base_price';

      if (dailyPrice) {
        price = dailyPrice.price;
        reason = dailyPrice.reason || 'daily_pricing';
      } else if (seasonalRule) {
        if (seasonalRule.fixed_price) {
          price = seasonalRule.fixed_price;
        } else {
          price *= seasonalRule.price_multiplier;
        }
        reason = `seasonal_${seasonalRule.rule_name}`;
      }

      // Apply weekend multiplier
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        price *= config.weekend_multiplier;
        reason += '_weekend';
      }

      // Apply constraints
      price = Math.max(price, config.min_price || 0);
      price = Math.min(price, config.max_price || Infinity);

      breakdown.push({
        date,
        price: Math.round(price * 100) / 100,
        reason,
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
      });
    }

    return breakdown;
  }

  /**
   * Calculate number of nights
   */
  calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get date range between two dates
   */
  getDateRange(startDate, endDate) {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  }

  /**
   * Get price estimate for multiple properties
   */
  async getPriceEstimates(propertyIds, checkIn, checkOut, options = {}) {
    const estimates = [];

    for (const propertyId of propertyIds) {
      try {
        const estimate = await this.calculatePrice(propertyId, checkIn, checkOut, options);
        estimates.push(estimate);
      } catch (error) {
        estimates.push({
          propertyId,
          error: error.message,
          checkIn,
          checkOut
        });
      }
    }

    return estimates;
  }
}

module.exports = PriceEstimator;
