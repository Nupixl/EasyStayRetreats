const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function cleanupLegacyTables() {
  console.log('🧹 Starting cleanup of legacy tables...')

  try {
    // First, let's check what tables exist
    console.log('📋 Checking existing tables...')
    
    // Note: We can't easily list tables via Supabase client, so we'll just proceed with cleanup
    console.log('⚠️  Note: This script will attempt to drop the legacy properties table.')
    console.log('⚠️  Make sure you have backups before proceeding!')
    console.log('⚠️  The App-Properties table should now be your single source of truth.')
    
    // For safety, we'll just log what we would do instead of actually dropping tables
    console.log('\n📝 Cleanup actions that would be performed:')
    console.log('1. Drop legacy properties table (if it exists)')
    console.log('2. Drop property_images table (if it exists)')
    console.log('3. Drop property_hosts table (if it exists)')
    console.log('4. Drop property_amenities table (if it exists)')
    console.log('5. Drop property_categories table (if it exists)')
    console.log('6. Drop reviews table (if it exists)')
    console.log('7. Drop hosts table (if it exists)')
    console.log('8. Drop amenities table (if it exists)')
    console.log('9. Drop categories table (if it exists)')
    
    console.log('\n✅ Cleanup plan completed!')
    console.log('⚠️  To actually perform the cleanup, uncomment the DROP statements below and run again.')
    
    // Uncomment these lines to actually perform the cleanup:
    /*
    console.log('🗑️  Dropping legacy tables...')
    
    const tablesToDrop = [
      'properties',
      'property_images', 
      'property_hosts',
      'property_amenities',
      'property_categories',
      'reviews',
      'hosts',
      'amenities',
      'categories'
    ]
    
    for (const tableName of tablesToDrop) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', {
          sql: `DROP TABLE IF EXISTS ${tableName} CASCADE;`
        })
        if (error) {
          console.log(`⚠️  Could not drop ${tableName}:`, error.message)
        } else {
          console.log(`✅ Dropped ${tableName}`)
        }
      } catch (e) {
        console.log(`⚠️  Error dropping ${tableName}:`, e.message)
      }
    }
    */
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

cleanupLegacyTables().catch(console.error)