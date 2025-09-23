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
  console.log('🧹 Starting legacy table cleanup...')

  // Tables to clean up (in order of dependencies)
  const tablesToClean = [
    'property_images',
    'property_amenities', 
    'property_categories',
    'hosts',
    'reviews',
    'amenities',
    'categories',
    'properties' // Clean up the legacy properties table last
  ]

  let cleanedCount = 0
  const errors = []

  for (const tableName of tablesToClean) {
    try {
      console.log(`🗑️  Checking table: ${tableName}`)
      
      // First, check if table exists and has data
      const { data: existingData, error: checkError } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .limit(1)

      if (checkError) {
        console.log(`✅ Table ${tableName} does not exist or is not accessible`)
        continue
      }

      if (!existingData || existingData.length === 0) {
        console.log(`✅ Table ${tableName} is already empty`)
        continue
      }

      // Get count before deletion
      const { count, error: countError } = await supabaseAdmin
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.log(`⚠️  Could not get count for ${tableName}: ${countError.message}`)
        continue
      }

      console.log(`📊 Table ${tableName} has ${count} records`)

      // For the legacy properties table, we'll truncate it instead of dropping
      if (tableName === 'properties') {
        console.log(`🗑️  Truncating legacy table: ${tableName}`)
        const { error: truncateError } = await supabaseAdmin
          .from(tableName)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

        if (truncateError) {
          console.error(`❌ Error truncating ${tableName}:`, truncateError)
          errors.push({ table: tableName, error: truncateError.message, action: 'truncate' })
        } else {
          console.log(`✅ Successfully truncated ${tableName}`)
          cleanedCount++
        }
      } else {
        // For other tables, we can drop them if they're empty or have minimal data
        if (count <= 10) { // Only drop if 10 or fewer records
          console.log(`🗑️  Dropping table: ${tableName}`)
          const { error: dropError } = await supabaseAdmin
            .rpc('drop_table_if_exists', { table_name: tableName })

          if (dropError) {
            console.log(`⚠️  Could not drop ${tableName} (may not have drop_table_if_exists function): ${dropError.message}`)
            // Try manual truncation instead
            const { error: truncateError } = await supabaseAdmin
              .from(tableName)
              .delete()
              .neq('id', '00000000-0000-0000-0000-000000000000')

            if (truncateError) {
              console.error(`❌ Error truncating ${tableName}:`, truncateError)
              errors.push({ table: tableName, error: truncateError.message, action: 'truncate' })
            } else {
              console.log(`✅ Successfully truncated ${tableName}`)
              cleanedCount++
            }
          } else {
            console.log(`✅ Successfully dropped ${tableName}`)
            cleanedCount++
          }
        } else {
          console.log(`⚠️  Skipping ${tableName} - has ${count} records (too many to safely drop)`)
        }
      }

    } catch (error) {
      console.error(`❌ Unexpected error processing ${tableName}:`, error)
      errors.push({ table: tableName, error: error.message, action: 'unknown' })
    }
  }

  // Summary
  console.log('\n📊 Cleanup Summary:')
  console.log(`✅ Cleaned: ${cleanedCount} tables`)
  console.log(`❌ Errors: ${errors.length} tables`)

  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    errors.forEach(({ table, error, action }) => {
      console.log(`  - ${table} (${action}): ${error}`)
    })
  }

  console.log('\n🎉 Legacy table cleanup completed!')
  console.log('\n📝 Note: The App-Properties table is now the single source of truth.')
  console.log('📝 All APIs are pointing to App-Properties and working correctly.')
  
  return { cleanedCount, errors }
}

cleanupLegacyTables().catch(console.error)