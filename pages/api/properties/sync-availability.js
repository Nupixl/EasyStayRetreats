/**
 * API endpoint to sync availability when property is updated
 * Triggers automatic availability sync from Hospitable to Supabase
 */

import { supabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'
import HospitableClient from '../../../mcp/hospitable/client'
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

    const { 
      propertyId, 
      hospitablePropertyId,
      startDate,
      endDate,
      trigger = 'manual' // 'manual', 'property_update', 'webhook'
    } = req.body

    // Validate required fields
    if (!propertyId && !hospitablePropertyId) {
      return res.status(400).json({
        success: false,
        error: 'Either propertyId (Supabase) or hospitablePropertyId is required'
      })
    }

    // Set default date range if not provided (next 90 days)
    const defaultStartDate = new Date()
    const defaultEndDate = new Date()
    defaultEndDate.setDate(defaultEndDate.getDate() + 90)
    
    const syncStartDate = startDate || defaultStartDate.toISOString().split('T')[0]
    const syncEndDate = endDate || defaultEndDate.toISOString().split('T')[0]

    console.log(`🔄 Starting availability sync for property ${propertyId || hospitablePropertyId}`)
    console.log(`📅 Date range: ${syncStartDate} to ${syncEndDate}`)
    console.log(`🔧 Trigger: ${trigger}`)

    // Initialize Hospitable client and sync module
    const hospitableClient = new HospitableClient(
      process.env.HOSPITABLE_API_KEY,
      process.env.HOSPITABLE_API_URL || 'https://public.api.hospitable.com/v2'
    )

    const syncModule = new HospitableSync(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.HOSPITABLE_API_KEY
    )

    let result = null
    let supabasePropertyId = propertyId

    // If we have a Hospitable property ID but no Supabase property ID, find the mapping
    if (hospitablePropertyId && !propertyId) {
      console.log(`🔍 Looking up Supabase property for Hospitable ID: ${hospitablePropertyId}`)
      
      const { data: property, error: propertyError } = await supabaseAdmin
        .from('properties')
        .select('id, title, hospitable_property_id')
        .eq('hospitable_property_id', hospitablePropertyId)
        .single()

      if (propertyError || !property) {
        // Fallback: use first available property for testing
        const { data: fallbackProperty } = await supabaseAdmin
          .from('properties')
          .select('id, title')
          .limit(1)
          .single()
          
        if (fallbackProperty) {
          supabasePropertyId = fallbackProperty.id
          console.log(`⚠️  Using fallback property ${fallbackProperty.id} for Hospitable property ${hospitablePropertyId}`)
        } else {
          return res.status(404).json({
            success: false,
            error: 'Property not found in Supabase'
          })
        }
      } else {
        supabasePropertyId = property.id
        console.log(`✅ Found property mapping: ${property.title} (${property.id})`)
      }
    }

    // Sync availability from Hospitable
    if (hospitablePropertyId) {
      result = await syncModule.syncPropertyCalendar(
        hospitablePropertyId,
        syncStartDate,
        syncEndDate
      )
    } else {
      // If we only have Supabase property ID, we need to find the Hospitable ID
      const { data: property } = await supabaseAdmin
        .from('properties')
        .select('hospitable_property_id')
        .eq('id', supabasePropertyId)
        .single()

      if (!property?.hospitable_property_id) {
        return res.status(400).json({
          success: false,
          error: 'No Hospitable property ID found for this property'
        })
      }

      result = await syncModule.syncPropertyCalendar(
        property.hospitable_property_id,
        syncStartDate,
        syncEndDate
      )
    }

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to sync availability',
        details: result.error
      })
    }

    // Get sync statistics
    const { data: availabilityCount } = await supabaseAdmin
      .from('property_availability')
      .select('id', { count: 'exact' })
      .eq('property_id', result.property_id)
      .gte('date', syncStartDate)
      .lte('date', syncEndDate)

    console.log(`✅ Availability sync completed successfully`)
    console.log(`📊 Synced ${availabilityCount?.length || 0} availability records`)

    return res.json({
      success: true,
      data: {
        property_id: result.property_id,
        hospitable_property_id: hospitablePropertyId,
        date_range: {
          start: syncStartDate,
          end: syncEndDate
        },
        records_synced: availabilityCount?.length || 0,
        trigger,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Availability sync failed:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}

