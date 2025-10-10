/**
 * Scheduled Availability Sync Script
 * Can be run via cron job or background task to sync all properties
 */

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const { triggerBulkAvailabilitySync, getPropertiesForSync } = require('../lib/availability-sync')

async function scheduledAvailabilitySync() {
  console.log('🕐 Starting scheduled availability sync...')
  console.log(`📅 Time: ${new Date().toISOString()}`)

  try {
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'HOSPITABLE_API_KEY'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:')
      missingVars.forEach(varName => console.error(`   - ${varName}`))
      process.exit(1)
    }

    console.log('✅ Environment variables configured')

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('properties')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ Supabase connection failed:', testError.message)
      process.exit(1)
    }

    console.log('✅ Supabase connection successful')

    // Get properties that need sync (updated in last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const properties = await getPropertiesForSync({
      updated_after: yesterday.toISOString()
    })

    if (properties.length === 0) {
      console.log('ℹ️  No properties found that need sync')
      process.exit(0)
    }

    console.log(`📋 Found ${properties.length} properties to sync`)

    // Set date range for sync (next 90 days)
    const startDate = new Date().toISOString().split('T')[0]
    const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    console.log(`📅 Syncing availability from ${startDate} to ${endDate}`)

    // Trigger bulk sync
    const syncResult = await triggerBulkAvailabilitySync(
      properties,
      'scheduled_sync',
      {
        startDate,
        endDate,
        forceSync: false
      }
    )

    console.log('✅ Scheduled sync completed!')
    console.log(`📊 Summary:`)
    console.log(`   - Total properties: ${syncResult.summary.total}`)
    console.log(`   - Successful: ${syncResult.summary.successful}`)
    console.log(`   - Failed: ${syncResult.summary.failed}`)

    // Log any failures
    const failures = syncResult.results.filter(r => !r.success)
    if (failures.length > 0) {
      console.log('❌ Failed syncs:')
      failures.forEach(failure => {
        console.log(`   - Property ${failure.property_id}: ${failure.error}`)
      })
    }

    process.exit(syncResult.summary.failed > 0 ? 1 : 0)

  } catch (error) {
    console.error('❌ Scheduled sync failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  scheduledAvailabilitySync()
}

module.exports = scheduledAvailabilitySync

