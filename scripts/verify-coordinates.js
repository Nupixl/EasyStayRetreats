const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function verifyCoordinates() {
  console.log('🔍 Verifying all property coordinates...')

  try {
    // Fetch all properties from App-Properties table
    const { data: properties, error } = await supabaseAdmin
      .from('App-Properties')
      .select('*')
      .order('created', { ascending: false })

    if (error) {
      console.error('❌ Error fetching properties:', error)
      return
    }

    console.log(`📊 Found ${properties.length} properties`)

    let validCount = 0
    let invalidCount = 0
    const invalidProperties = []

    // Check each property
    for (const property of properties) {
      const lat = Number(property.latitude)
      const lng = Number(property.longitude)
      
      const isValid = lat && lng && lat !== 0 && lng !== 0 && Number.isFinite(lat) && Number.isFinite(lng)
      
      if (isValid) {
        validCount++
        console.log(`✅ ${property.name || 'Unnamed'}: ${lat}, ${lng}`)
      } else {
        invalidCount++
        invalidProperties.push({
          name: property.name || 'Unnamed',
          lat: property.latitude,
          lng: property.longitude,
          city: property.city,
          street_address: property.street_address
        })
        console.log(`❌ ${property.name || 'Unnamed'}: ${property.latitude}, ${property.longitude}`)
      }
    }

    // Summary
    console.log('\n📊 Coordinate Verification Summary:')
    console.log(`✅ Properties with valid coordinates: ${validCount}`)
    console.log(`❌ Properties with invalid/missing coordinates: ${invalidCount}`)

    if (invalidProperties.length > 0) {
      console.log('\n❌ Properties needing attention:')
      invalidProperties.forEach(prop => {
        console.log(`  - ${prop.name} (${prop.city}): lat=${prop.lat}, lng=${prop.lng}`)
      })
    } else {
      console.log('\n🎉 All properties have valid coordinates!')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the script
verifyCoordinates().catch(console.error)
