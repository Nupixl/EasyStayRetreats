const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testTableAccess() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    console.log('🔍 Testing table access...')
    
    // Test 1: Try different table names
    const tableNames = ['App-Properties', 'app-properties', 'app_properties', 'properties']
    
    for (const tableName of tableNames) {
      console.log(`\n📋 Testing table: ${tableName}`)
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`❌ Error with ${tableName}:`, error.message)
      } else {
        console.log(`✅ Success with ${tableName}: Found ${data.length} records`)
        if (data.length > 0) {
          console.log('📋 Sample record keys:', Object.keys(data[0]))
        }
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testTableAccess()
