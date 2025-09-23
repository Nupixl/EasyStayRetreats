const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testAppProperties() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('🔍 Testing App-Properties table...')
    
    // Try to get a sample record to see the structure
    const { data, error } = await supabase
      .from('App-Properties')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Error:', error)
      return
    }

    console.log('✅ Success! Found', data.length, 'records')
    
    if (data.length > 0) {
      console.log('📋 Sample record structure:')
      console.log(JSON.stringify(data[0], null, 2))
    } else {
      console.log('⚠️  No records found in App-Properties table')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testAppProperties()
