/**
 * Hospitable Webhook Handler
 * Receives webhooks from Hospitable and triggers availability sync
 */

import { supabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'
import { triggerAvailabilitySync, triggerBulkAvailabilitySync } from '../../../lib/availability-sync'

// Verify webhook signature (optional but recommended)
function verifyWebhookSignature(payload, signature, secret) {
  if (!secret) return true // Skip verification if no secret configured
  
  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

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

    const webhookSecret = process.env.HOSPITABLE_WEBHOOK_SECRET
    const signature = req.headers['x-hospitable-signature'] || req.headers['x-signature']
    
    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      const payload = JSON.stringify(req.body)
      if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
        console.warn('❌ Invalid webhook signature')
        return res.status(401).json({ success: false, error: 'Invalid signature' })
      }
    }

    const { type, data } = req.body
    
    console.log(`🔔 Received Hospitable webhook: ${type}`)
    console.log(`📊 Webhook data:`, data)

    let syncResult = null

    switch (type) {
      case 'property.updated':
      case 'property.availability.changed':
      case 'property.calendar.updated':
        // Single property availability sync
        if (data?.property_id) {
          console.log(`🔄 Syncing availability for property: ${data.property_id}`)
          
          // Find the Supabase property ID
          const { data: property, error } = await supabaseAdmin
            .from('properties')
            .select('id, title, hospitable_property_id')
            .eq('hospitable_property_id', data.property_id)
            .single()

          if (property) {
            syncResult = await triggerAvailabilitySync(
              property.id,
              data.property_id,
              'hospitable_webhook',
              {
                startDate: data.start_date || new Date().toISOString().split('T')[0],
                endDate: data.end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              }
            )
          } else {
            console.warn(`⚠️  Property not found in Supabase for Hospitable ID: ${data.property_id}`)
          }
        }
        break

      case 'property.bulk.updated':
        // Bulk property availability sync
        if (data?.property_ids && Array.isArray(data.property_ids)) {
          console.log(`🔄 Bulk syncing availability for ${data.property_ids.length} properties`)
          
          // Get properties from Supabase
          const { data: properties, error } = await supabaseAdmin
            .from('properties')
            .select('id, title, hospitable_property_id')
            .in('hospitable_property_id', data.property_ids)

          if (properties && properties.length > 0) {
            syncResult = await triggerBulkAvailabilitySync(
              properties,
              'hospitable_webhook_bulk',
              {
                startDate: data.start_date || new Date().toISOString().split('T')[0],
                endDate: data.end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              }
            )
          } else {
            console.warn(`⚠️  No properties found in Supabase for Hospitable IDs: ${data.property_ids.join(', ')}`)
          }
        }
        break

      case 'property.created':
        // New property - sync initial availability
        if (data?.property_id) {
          console.log(`🆕 New property created, syncing initial availability: ${data.property_id}`)
          
          const { data: property, error } = await supabaseAdmin
            .from('properties')
            .select('id, title, hospitable_property_id')
            .eq('hospitable_property_id', data.property_id)
            .single()

          if (property) {
            syncResult = await triggerAvailabilitySync(
              property.id,
              data.property_id,
              'hospitable_webhook_new',
              {
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year
              }
            )
          }
        }
        break

      default:
        console.log(`ℹ️  Unhandled webhook type: ${type}`)
        return res.json({
          success: true,
          message: `Webhook received but not processed (type: ${type})`
        })
    }

    if (syncResult) {
      console.log(`✅ Webhook processing completed:`, syncResult)
      
      return res.json({
        success: true,
        data: {
          webhook_type: type,
          sync_result: syncResult,
          timestamp: new Date().toISOString()
        }
      })
    } else {
      return res.json({
        success: true,
        message: `Webhook received but no sync was triggered (type: ${type})`
      })
    }

  } catch (error) {
    console.error('❌ Webhook processing failed:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}
