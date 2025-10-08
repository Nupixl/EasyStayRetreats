/**
 * Pricing Sync API Endpoint
 * Trigger manual sync from Hospitable to Supabase
 */

import { isSupabaseConfigured } from '../../../lib/supabase'
import HospitableSync from '../../../mcp/hospitable/sync'

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

    // Check if Hospitable is configured
    if (!process.env.HOSPITABLE_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Hospitable API key not configured'
      })
    }

    const { 
      propertyId, 
      startDate, 
      endDate,
      syncType = 'all' // 'pricing', 'calendar', 'all'
    } = req.body

    // Initialize sync module
    const sync = new HospitableSync(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.HOSPITABLE_API_KEY
    )

    let result

    switch (syncType) {
      case 'pricing':
        if (!propertyId || !startDate || !endDate) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields for pricing sync: propertyId, startDate, endDate'
          })
        }
        result = await sync.syncPropertyPricing(propertyId, startDate, endDate)
        break

      case 'calendar':
        if (!propertyId || !startDate || !endDate) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields for calendar sync: propertyId, startDate, endDate'
          })
        }
        result = await sync.syncPropertyCalendar(propertyId, startDate, endDate)
        break

      case 'all':
        if (!startDate || !endDate) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields for full sync: startDate, endDate'
          })
        }
        
        // Sync all properties
        const [pricingResult, calendarResult] = await Promise.all([
          sync.syncAllPricing(startDate, endDate),
          sync.syncAllCalendars(startDate, endDate)
        ])
        
        result = {
          pricing: pricingResult,
          calendar: calendarResult,
          totalSynced: pricingResult.synced + calendarResult.synced,
          totalErrors: pricingResult.errors + calendarResult.errors
        }
        break

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid sync type. Use: pricing, calendar, or all'
        })
    }

    return res.json({
      success: true,
      data: {
        syncType,
        timestamp: new Date().toISOString(),
        result
      }
    })

  } catch (error) {
    console.error('Sync API error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    })
  }
}
