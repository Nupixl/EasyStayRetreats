/**
 * Pricing Calendar API Endpoint
 * Get availability and pricing calendar for a property
 */

import { supabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return res.status(500).json({ 
        success: false, 
        error: 'Supabase not configured' 
      })
    }

    const { 
      propertyId, 
      startDate, 
      endDate,
      includePricing = true 
    } = req.query

    // Validate required fields
    if (!propertyId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameters: propertyId, startDate, endDate'
      })
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      })
    }

    const client = supabaseAdmin

    // Get property basic info
    const { data: property, error: propertyError } = await client
      .from('properties')
      .select('id, title, location')
      .eq('id', propertyId)
      .single()

    if (propertyError || !property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      })
    }

    // Get availability calendar
    const { data: availability, error: availabilityError } = await client
      .from('property_availability')
      .select('date, status, min_nights, check_in_allowed, check_out_allowed')
      .eq('property_id', propertyId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date')

    if (availabilityError) {
      console.error('Error fetching availability:', availabilityError)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch availability data'
      })
    }

    // Get pricing data if requested
    let pricing = null
    if (includePricing === 'true') {
      const { data: dailyPricing, error: pricingError } = await client
        .from('daily_pricing')
        .select('date, price, reason')
        .eq('property_id', propertyId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')

      if (pricingError) {
        console.error('Error fetching pricing:', pricingError)
      } else {
        pricing = dailyPricing
      }
    }

    // Get pricing configuration
    const { data: pricingConfig, error: configError } = await client
      .from('property_pricing_config')
      .select('base_price, min_price, max_price, currency, pricing_strategy')
      .eq('property_id', propertyId)
      .single()

    // Combine availability and pricing data
    const calendar = []
    const start = new Date(startDate)
    const end = new Date(endDate)

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0]
      
      const availabilityData = availability?.find(a => a.date === dateStr)
      const pricingData = pricing?.find(p => p.date === dateStr)
      
      calendar.push({
        date: dateStr,
        available: availabilityData?.status === 'available',
        status: availabilityData?.status || 'unknown',
        minNights: availabilityData?.min_nights || 1,
        checkInAllowed: availabilityData?.check_in_allowed !== false,
        checkOutAllowed: availabilityData?.check_out_allowed !== false,
        price: pricingData?.price || pricingConfig?.base_price || 0,
        priceReason: pricingData?.reason || 'base_price'
      })
    }

    return res.json({
      success: true,
      data: {
        property: {
          id: property.id,
          title: property.title,
          location: property.location
        },
        pricingConfig: pricingConfig ? {
          basePrice: pricingConfig.base_price,
          minPrice: pricingConfig.min_price,
          maxPrice: pricingConfig.max_price,
          currency: pricingConfig.currency,
          strategy: pricingConfig.pricing_strategy
        } : null,
        calendar,
        dateRange: {
          start: startDate,
          end: endDate
        }
      }
    })

  } catch (error) {
    console.error('Calendar API error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    })
  }
}
