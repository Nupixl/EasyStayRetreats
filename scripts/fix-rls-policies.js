const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function fixRLSPolicies() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('🔧 Fixing RLS policies for App-Properties table...')
    
    // Enable RLS on the table
    console.log('\n1. Enabling RLS on App-Properties table...')
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE "App-Properties" ENABLE ROW LEVEL SECURITY;'
    })
    
    if (rlsError) {
      console.log('⚠️  RLS might already be enabled:', rlsError.message)
    } else {
      console.log('✅ RLS enabled on App-Properties table')
    }

    // Create a policy that allows read access for all users
    console.log('\n2. Creating read policy for App-Properties table...')
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Enable read access for all users" ON "App-Properties" 
        FOR SELECT USING (true);
      `
    })
    
    if (policyError) {
      console.log('⚠️  Policy might already exist:', policyError.message)
    } else {
      console.log('✅ Read policy created for App-Properties table')
    }

    // Test the anon key access
    console.log('\n3. Testing anon key access...')
    const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const { data, error } = await anonSupabase
      .from('App-Properties')
      .select('*')
      .limit(3)

    if (error) {
      console.error('❌ Still getting error with anon key:', error)
    } else {
      console.log('✅ Anon key now works! Found', data.length, 'records')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

fixRLSPolicies()
