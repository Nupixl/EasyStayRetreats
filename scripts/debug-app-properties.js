const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function debugAppProperties() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('🔍 Debugging App-Properties table...')
    
    // Test 1: Get all records
    console.log('\n1. Getting all records...')
    const { data: allData, error: allError } = await supabase
      .from('App-Properties')
      .select('*')

    if (allError) {
      console.error('❌ Error getting all records:', allError)
    } else {
      console.log('✅ Found', allData.length, 'total records')
    }

    // Test 2: Get records with ordering
    console.log('\n2. Testing with ordering...')
    const { data: orderedData, error: orderError } = await supabase
      .from('App-Properties')
      .select('*')
      .order('created', { ascending: false })

    if (orderError) {
      console.error('❌ Error with ordering:', orderError)
    } else {
      console.log('✅ Found', orderedData.length, 'records with ordering')
    }

    // Test 3: Get specific fields
    console.log('\n3. Testing specific fields...')
    const { data: specificData, error: specificError } = await supabase
      .from('App-Properties')
      .select('whalesync_postgres_id, name, city, price_starts_at, latitude, longitude')
      .limit(3)

    if (specificError) {
      console.error('❌ Error with specific fields:', specificError)
    } else {
      console.log('✅ Found', specificData.length, 'records with specific fields')
      if (specificData.length > 0) {
        console.log('📋 Sample data:')
        console.log(JSON.stringify(specificData[0], null, 2))
      }
    }

    // Test 4: Test coordinate filtering
    console.log('\n4. Testing coordinate filtering...')
    const { data: coordData, error: coordError } = await supabase
      .from('App-Properties')
      .select('*')
      .gte('latitude', 29)
      .lte('latitude', 32)
      .gte('longitude', -99)
      .lte('longitude', -96)

    if (coordError) {
      console.error('❌ Error with coordinate filtering:', coordError)
    } else {
      console.log('✅ Found', coordData.length, 'records in coordinate range')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

debugAppProperties()
