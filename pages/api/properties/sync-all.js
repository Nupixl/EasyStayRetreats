/**
 * Bulk Availability Sync API
 * Syncs availability for all properties with Hospitable integration
 */

import { supabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'
import { triggerBulkAvailabilitySync, getPropertiesForSync } from '../../../lib/availability-sync'

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
      property_ids,
      start_date,
      end_date,
      force_sync = false,
      trigger = 'manual_bulk'
    } = req.body

    console.log(`🔄 Starting bulk availability sync`)
    console.log(`📊 Options:`, { property_ids, start_date, end_date, force_sync, trigger })

    // Get properties to sync
    const filters = {}
    if (property_ids && property_ids.length > 0) {
      filters.property_ids = property_ids
    }
    if (force_sync) {
      // If force sync, get all properties updated in the last 24 hours
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      filters.updated_after = yesterday.toISOString()
    }

    const properties = await getPropertiesForSync(filters)
    
    if (properties.length === 0) {
      return res.json({
        success: true,
        message: 'No properties found for sync',
        data: {
          properties_found: 0,
          sync_results: []
        }
      })
    }

    console.log(`📋 Found ${properties.length} properties to sync`)

    // Set default date range if not provided
    const defaultStartDate = start_date || new Date().toISOString().split('T')[0]
    const defaultEndDate = end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Trigger bulk sync
    const syncResult = await triggerBulkAvailabilitySync(
      properties,
      trigger,
      {
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        forceSync: force_sync
      }
    )

    console.log(`✅ Bulk sync completed:`, syncResult.summary)

    return res.json({
      success: true,
      data: {
        sync_summary: syncResult.summary,
        properties_synced: syncResult.results,
        date_range: {
          start: defaultStartDate,
          end: defaultEndDate
        },
        trigger,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Bulk sync failed:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}


