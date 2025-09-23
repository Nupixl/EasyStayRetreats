const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function checkPropertiesTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    console.log('🔍 Checking properties table...')
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .limit(3)

    if (error) {
      console.error('❌ Error:', error)
    } else {
      console.log('✅ Found', data.length, 'records in properties table')
      if (data.length > 0) {
        console.log('📋 Sample record:')
        console.log(JSON.stringify(data[0], null, 2))
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkPropertiesTable()
