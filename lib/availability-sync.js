/**
 * Availability Sync Middleware
 * Automatically syncs availability when properties are updated
 */

import { supabaseAdmin } from './supabase'

/**
 * Trigger availability sync for a property
 * @param {string} propertyId - Supabase property ID
 * @param {string} hospitablePropertyId - Hospitable property ID (optional)
 * @param {string} trigger - What triggered the sync
 * @param {Object} options - Sync options
 */
export async function triggerAvailabilitySync(propertyId, hospitablePropertyId = null, trigger = 'property_update', options = {}) {
  try {
    console.log(`🔄 Triggering availability sync for property ${propertyId}`)
    console.log(`🔧 Trigger: ${trigger}`)

    // Default sync options
    const syncOptions = {
      startDate: options.startDate || new Date().toISOString().split('T')[0],
      endDate: options.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      forceSync: options.forceSync || false,
      ...options
    }

    // Call the sync API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/properties/sync-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId,
        hospitablePropertyId,
        startDate: syncOptions.startDate,
        endDate: syncOptions.endDate,
        trigger
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Sync API failed: ${errorData.error}`)
    }

    const result = await response.json()
    console.log(`✅ Availability sync completed:`, result.data)
    
    return result

  } catch (error) {
    console.error(`❌ Availability sync failed for property ${propertyId}:`, error.message)
    
    // Don't throw error to avoid breaking the main property update
    // Just log the error for debugging
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Sync availability for multiple properties
 * @param {Array} properties - Array of property objects with id and hospitable_property_id
 * @param {string} trigger - What triggered the sync
 * @param {Object} options - Sync options
 */
export async function triggerBulkAvailabilitySync(properties, trigger = 'bulk_update', options = {}) {
  console.log(`🔄 Starting bulk availability sync for ${properties.length} properties`)
  
  const results = []
  
  for (const property of properties) {
    try {
      const result = await triggerAvailabilitySync(
        property.id,
        property.hospitable_property_id,
        trigger,
        options
      )
      results.push({ property_id: property.id, ...result })
    } catch (error) {
      console.error(`❌ Failed to sync property ${property.id}:`, error.message)
      results.push({ 
        property_id: property.id, 
        success: false, 
        error: error.message 
      })
    }
  }
  
  const successCount = results.filter(r => r.success).length
  console.log(`✅ Bulk sync completed: ${successCount}/${properties.length} properties synced`)
  
  return {
    success: successCount > 0,
    results,
    summary: {
      total: properties.length,
      successful: successCount,
      failed: properties.length - successCount
    }
  }
}

/**
 * Check if a property has Hospitable integration
 * @param {string} propertyId - Supabase property ID
 */
export async function hasHospitableIntegration(propertyId) {
  try {
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .select('hospitable_property_id')
      .eq('id', propertyId)
      .single()

    if (error) {
      console.error('Error checking Hospitable integration:', error.message)
      return false
    }

    return !!property?.hospitable_property_id
  } catch (error) {
    console.error('Error checking Hospitable integration:', error.message)
    return false
  }
}

/**
 * Get properties that need availability sync
 * @param {Object} filters - Filters for properties
 */
export async function getPropertiesForSync(filters = {}) {
  try {
    let query = supabaseAdmin
      .from('properties')
      .select('id, title, hospitable_property_id')
      .not('hospitable_property_id', 'is', null)

    // Apply filters
    if (filters.updated_after) {
      query = query.gte('updated_at', filters.updated_after)
    }

    if (filters.property_ids && filters.property_ids.length > 0) {
      query = query.in('id', filters.property_ids)
    }

    const { data: properties, error } = await query

    if (error) {
      throw new Error(`Failed to fetch properties: ${error.message}`)
    }

    return properties || []
  } catch (error) {
    console.error('Error fetching properties for sync:', error.message)
    return []
  }
}


