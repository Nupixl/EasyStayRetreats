/**
 * Test Automatic Availability Sync
 * Tests the API-based sync functionality
 */

require('dotenv').config({ path: '.env.local' })

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function testAutomaticSync() {
  console.log('🧪 Testing Automatic Availability Sync\n')

  try {
    // Test 1: Property Update with Automatic Sync
    console.log('📝 Test 1: Property Update with Automatic Sync')
    console.log('=' .repeat(50))
    
    const updateResponse = await fetch(`${BASE_URL}/api/properties/update?id=test-property-id`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Updated Property Title',
        description: 'Updated property description',
        updated_at: new Date().toISOString()
      })
    })

    if (updateResponse.ok) {
      const updateResult = await updateResponse.json()
      console.log('✅ Property update API working')
      console.log('   Response:', updateResult.data?.message)
    } else {
      const errorData = await updateResponse.json()
      console.log('⚠️  Property update API response:', errorData)
    }

    console.log('\n' + '=' .repeat(50) + '\n')

    // Test 2: Direct Availability Sync
    console.log('🔄 Test 2: Direct Availability Sync')
    console.log('=' .repeat(50))
    
    const syncResponse = await fetch(`${BASE_URL}/api/properties/sync-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId: 'b8c9aa25-cb16-418a-be74-2593268990ea', // Use existing property ID
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        trigger: 'test_sync'
      })
    })

    if (syncResponse.ok) {
      const syncResult = await syncResponse.json()
      console.log('✅ Direct availability sync working')
      console.log('   Records synced:', syncResult.data?.records_synced)
      console.log('   Property ID:', syncResult.data?.property_id)
    } else {
      const errorData = await syncResponse.json()
      console.log('❌ Direct sync failed:', errorData.error)
    }

    console.log('\n' + '=' .repeat(50) + '\n')

    // Test 3: Bulk Sync
    console.log('📊 Test 3: Bulk Availability Sync')
    console.log('=' .repeat(50))
    
    const bulkSyncResponse = await fetch(`${BASE_URL}/api/properties/sync-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        trigger: 'test_bulk_sync'
      })
    })

    if (bulkSyncResponse.ok) {
      const bulkResult = await bulkSyncResponse.json()
      console.log('✅ Bulk sync working')
      console.log('   Properties found:', bulkResult.data?.sync_summary?.total)
      console.log('   Successful:', bulkResult.data?.sync_summary?.successful)
      console.log('   Failed:', bulkResult.data?.sync_summary?.failed)
    } else {
      const errorData = await bulkSyncResponse.json()
      console.log('❌ Bulk sync failed:', errorData.error)
    }

    console.log('\n' + '=' .repeat(50) + '\n')

    // Test 4: Webhook Simulation
    console.log('🔔 Test 4: Webhook Simulation')
    console.log('=' .repeat(50))
    
    const webhookResponse = await fetch(`${BASE_URL}/api/webhooks/hospitable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hospitable-Signature': 'test-signature' // Optional signature
      },
      body: JSON.stringify({
        type: 'property.availability.changed',
        data: {
          property_id: '04e8f724-7da7-4b2e-853e-0918c84e9812', // Use existing Hospitable property ID
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      })
    })

    if (webhookResponse.ok) {
      const webhookResult = await webhookResponse.json()
      console.log('✅ Webhook processing working')
      console.log('   Webhook type:', webhookResult.data?.webhook_type)
      console.log('   Sync result:', webhookResult.data?.sync_result?.success)
    } else {
      const errorData = await webhookResponse.json()
      console.log('❌ Webhook processing failed:', errorData.error)
    }

    console.log('\n🎉 Automatic sync testing completed!')
    console.log('\n📋 Summary of API endpoints created:')
    console.log('   1. PUT /api/properties/update - Updates property + triggers sync')
    console.log('   2. POST /api/properties/sync-availability - Direct availability sync')
    console.log('   3. POST /api/properties/sync-all - Bulk availability sync')
    console.log('   4. POST /api/webhooks/hospitable - Webhook handler')
    console.log('\n📝 Usage examples:')
    console.log('   • Update property: PUT /api/properties/update?id=123')
    console.log('   • Sync single: POST /api/properties/sync-availability')
    console.log('   • Sync all: POST /api/properties/sync-all')
    console.log('   • Webhook: POST /api/webhooks/hospitable')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run if called directly
if (require.main === module) {
  testAutomaticSync()
}

module.exports = testAutomaticSync

