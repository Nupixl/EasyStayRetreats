/**
 * Property Update API with Automatic Availability Sync
 * Updates property data and automatically syncs availability from Hospitable
 */

import { supabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'
import { triggerAvailabilitySync, hasHospitableIntegration } from '../../../lib/availability-sync'

export default async function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
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

    const { id } = req.query
    const updateData = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Property ID is required'
      })
    }

    console.log(`🔄 Updating property ${id}`)
    console.log(`📝 Update data:`, Object.keys(updateData))

    // Update the property in Supabase
    const { data: updatedProperty, error: updateError } = await supabaseAdmin
      .from('properties')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Property update failed:', updateError)
      return res.status(500).json({
        success: false,
        error: 'Failed to update property',
        details: updateError.message
      })
    }

    console.log(`✅ Property updated successfully: ${updatedProperty.title}`)

    // Check if this property has Hospitable integration
    const hasIntegration = await hasHospitableIntegration(id)
    
    if (hasIntegration) {
      console.log(`🔄 Property has Hospitable integration, triggering availability sync`)
      
      // Trigger availability sync in the background
      // Don't await this to avoid blocking the response
      triggerAvailabilitySync(id, null, 'property_update', {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }).then(result => {
        if (result.success) {
          console.log(`✅ Availability sync completed for property ${id}`)
        } else {
          console.error(`❌ Availability sync failed for property ${id}:`, result.error)
        }
      }).catch(error => {
        console.error(`❌ Availability sync error for property ${id}:`, error.message)
      })
    } else {
      console.log(`ℹ️  Property ${id} does not have Hospitable integration, skipping availability sync`)
    }

    return res.json({
      success: true,
      data: {
        property: updatedProperty,
        availability_sync_triggered: hasIntegration,
        message: hasIntegration 
          ? 'Property updated and availability sync triggered' 
          : 'Property updated (no Hospitable integration)'
      }
    })

  } catch (error) {
    console.error('❌ Property update failed:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}
