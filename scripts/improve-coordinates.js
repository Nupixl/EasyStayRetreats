const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

// Function to geocode with multiple address variations
async function geocodeWithVariations(property) {
  const variations = []
  
  // Create different address variations
  if (property.city && property.state) {
    // Try city, state first
    variations.push(`${property.city}, ${property.state}`)
  }
  
  if (property.city) {
    // Try just city
    variations.push(property.city)
  }
  
  if (property.street_address && property.city) {
    // Try street + city
    variations.push(`${property.street_address}, ${property.city}`)
  }
  
  // Try with country for international locations
  const cityState = [property.city, property.state].filter(Boolean).join(', ').toLowerCase()
  const isInternational = cityState.includes('egypt') || cityState.includes('bali') || cityState.includes('indonesia')
  
  if (isInternational && property.city) {
    if (cityState.includes('egypt')) {
      variations.push(`${property.city}, Egypt`)
    } else if (cityState.includes('bali') || cityState.includes('indonesia')) {
      variations.push(`${property.city}, Indonesia`)
    }
  }

  for (const address of variations) {
    console.log(`  🔍 Trying: "${address}"`)
    
    try {
      // Try Nominatim with proper headers
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`, {
        headers: {
          'User-Agent': 'EasyStayRetreats/1.0 (Property Management System)',
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        
        if (data && data.length > 0) {
          const result = data[0]
          console.log(`  ✅ Found: ${result.display_name}`)
          return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            display_name: result.display_name,
            address_used: address
          }
        }
      }
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`)
      continue
    }
  }
  
  return null
}

async function improveCoordinates() {
  console.log('🔍 Analyzing properties for coordinate improvements...')

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

    // Focus on properties that might have incorrect coordinates or are missing them
    const propertiesToCheck = properties.filter(property => {
      const lat = Number(property.latitude)
      const lng = Number(property.longitude)
      
      // Check if coordinates are missing, invalid, or potentially incorrect
      return !lat || !lng || lat === 0 || lng === 0 || 
             !Number.isFinite(lat) || !Number.isFinite(lng) ||
             // Check for coordinates that might be in wrong location (e.g., US coordinates for international properties)
             (property.city && property.city.toLowerCase().includes('egypt') && lat > 30) ||
             (property.city && property.city.toLowerCase().includes('bali') && lat < 0)
    })

    console.log(`📍 Found ${propertiesToCheck.length} properties that need coordinate review`)

    if (propertiesToCheck.length === 0) {
      console.log('✅ All properties have valid coordinates!')
      return
    }

    let successCount = 0
    let errorCount = 0
    const errors = []

    // Process each property
    for (const property of propertiesToCheck) {
      try {
        console.log(`\n🔍 Processing: ${property.name || 'Unnamed Property'}`)
        console.log(`📍 Current coordinates: ${property.latitude}, ${property.longitude}`)

        const coords = await geocodeWithVariations(property)
        
        if (coords) {
          console.log(`✅ Found better coordinates: ${coords.lat}, ${coords.lng}`)
          console.log(`📍 Location: ${coords.display_name}`)
          console.log(`📍 Address used: ${coords.address_used}`)

          // Update the property in the database
          const { error: updateError } = await supabaseAdmin
            .from('App-Properties')
            .update({
              latitude: coords.lat,
              longitude: coords.lng
            })
            .eq('whalesync_postgres_id', property.whalesync_postgres_id)

          if (updateError) {
            console.error(`❌ Error updating ${property.name}:`, updateError.message)
            errors.push({ property: property.name, error: updateError.message })
            errorCount++
          } else {
            console.log(`✅ Successfully updated coordinates for ${property.name}`)
            successCount++
          }
        } else {
          console.log(`❌ Could not find better coordinates for ${property.name}`)
          errors.push({ property: property.name, error: 'No coordinates found' })
          errorCount++
        }

        // Add delay between properties
        await new Promise(resolve => setTimeout(resolve, 2000))

      } catch (error) {
        console.error(`❌ Error processing ${property.name}:`, error.message)
        errors.push({ property: property.name, error: error.message })
        errorCount++
      }
    }

    // Summary
    console.log('\n📊 Coordinate Improvement Summary:')
    console.log(`✅ Successfully updated: ${successCount} properties`)
    console.log(`❌ Failed to update: ${errorCount} properties`)

    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      errors.forEach(({ property, error }) => {
        console.log(`  - ${property}: ${error}`)
      })
    }

    console.log('\n🎉 Coordinate improvement process completed!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the script
improveCoordinates().catch(console.error)
