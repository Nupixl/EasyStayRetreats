const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testApiDirectly() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('🔍 Testing API directly...')
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    console.log('\n1. Testing with anon key...')
    const { data, error } = await supabase
      .from('App-Properties')
      .select('*')
      .limit(3)

    if (error) {
      console.error('❌ Error with anon key:', error)
    } else {
      console.log('✅ Found', data.length, 'records with anon key')
      if (data.length > 0) {
        console.log('📋 Sample record:')
        console.log(JSON.stringify(data[0], null, 2))
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testApiDirectly()
