const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function checkWebflowStatus() {
  console.log('🔍 Checking webflow_status values...')

  try {
    // Fetch all properties and group by webflow_status
    const { data: properties, error } = await supabaseAdmin
      .from('App-Properties')
      .select('name, webflow_status')
      .order('created', { ascending: false })

    if (error) {
      console.error('❌ Error fetching properties:', error)
      return
    }

    console.log(`📊 Found ${properties.length} properties`)

    // Group by webflow_status
    const statusGroups = {}
    properties.forEach(property => {
      const status = property.webflow_status || 'null'
      if (!statusGroups[status]) {
        statusGroups[status] = []
      }
      statusGroups[status].push(property.name)
    })

    console.log('\n📊 Properties by webflow_status:')
    Object.entries(statusGroups).forEach(([status, names]) => {
      console.log(`\n${status}: ${names.length} properties`)
      names.forEach(name => console.log(`  - ${name}`))
    })

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the script
checkWebflowStatus().catch(console.error)
