/**
 * Price Estimation API Endpoint
 * Calculate total price for property bookings
 */

import { supabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'
import PriceEstimator from '../../../utils/priceEstimator'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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
      checkIn, 
      checkOut, 
      guests = 1, 
      pets = false, 
      includeFees = true 
    } = req.body

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: propertyId, checkIn, checkOut'
      })
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(checkIn) || !dateRegex.test(checkOut)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      })
    }

    // Validate dates
    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      return res.status(400).json({
        success: false,
        error: 'Check-in date cannot be in the past'
      })
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        error: 'Check-out date must be after check-in date'
      })
    }

    // Initialize price estimator
    const estimator = new PriceEstimator(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Calculate price
    const estimate = await estimator.calculatePrice(
      propertyId,
      checkIn,
      checkOut,
      {
        guests: parseInt(guests),
        pets: Boolean(pets),
        includeFees: Boolean(includeFees)
      }
    )

    return res.json({
      success: true,
      data: estimate
    })

  } catch (error) {
    console.error('Price estimation error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    })
  }
}
