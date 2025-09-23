const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

// Function to geocode an address using multiple services
async function geocodeAddress(address) {
  // Try multiple geocoding services
  const services = [
    {
      name: 'Nominatim',
      url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
      headers: {
        'User-Agent': 'EasyStayRetreats/1.0 (Property Management System)'
      }
    },
    {
      name: 'Photon',
      url: `https://photon.komoot.io/api?q=${encodeURIComponent(address)}&limit=1`
    }
  ]

  for (const service of services) {
    try {
      console.log(`  🔍 Trying ${service.name}...`)
      
      const response = await fetch(service.url, {
        headers: service.headers || {}
      })
      
      if (!response.ok) {
        console.log(`  ❌ ${service.name} returned ${response.status}`)
        continue
      }
      
      const data = await response.json()
      
      if (service.name === 'Nominatim' && data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display_name: data[0].display_name,
          service: service.name
        }
      } else if (service.name === 'Photon' && data && data.features && data.features.length > 0) {
        const feature = data.features[0]
        return {
          lat: parseFloat(feature.geometry.coordinates[1]),
          lng: parseFloat(feature.geometry.coordinates[0]),
          display_name: feature.properties.name || address,
          service: service.name
        }
      }
      
    } catch (error) {
      console.log(`  ❌ ${service.name} error: ${error.message}`)
      continue
    }
  }
  
  return null
}

// Function to build a complete address from property data
function buildAddress(property) {
  const parts = []
  
  // Try different address combinations for better geocoding results
  if (property.street_address) {
    parts.push(property.street_address)
  }
  
  if (property.city) {
    parts.push(property.city)
  }
  
  if (property.state) {
    parts.push(property.state)
  }
  
  // Don't add country if it's already in the city/state or if it's clearly international
  const cityState = [property.city, property.state].filter(Boolean).join(', ').toLowerCase()
  const isInternational = cityState.includes('egypt') || cityState.includes('bali') || cityState.includes('indonesia')
  
  if (property.country && !isInternational) {
    parts.push(property.country)
  } else if (!isInternational) {
    // Only add US as default if it's not clearly international
    parts.push('United States')
  }
  
  return parts.join(', ')
}

async function addMissingCoordinates() {
  console.log('🔍 Analyzing properties for missing coordinates...')

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

    // Filter properties that need coordinates
    const propertiesNeedingCoords = properties.filter(property => {
      const lat = Number(property.latitude)
      const lng = Number(property.longitude)
      
      // Check if coordinates are missing or invalid (0,0 is considered invalid)
      return !lat || !lng || lat === 0 || lng === 0 || !Number.isFinite(lat) || !Number.isFinite(lng)
    })

    console.log(`📍 Found ${propertiesNeedingCoords.length} properties missing coordinates`)

    if (propertiesNeedingCoords.length === 0) {
      console.log('✅ All properties already have valid coordinates!')
      return
    }

    let successCount = 0
    let errorCount = 0
    const errors = []

    // Process each property
    for (const property of propertiesNeedingCoords) {
      try {
        const address = buildAddress(property)
        
        if (!address || address.trim() === '') {
          console.log(`⚠️  Skipping ${property.name || 'Unnamed Property'} - no address available`)
          continue
        }

        console.log(`\n🔍 Geocoding: ${property.name || 'Unnamed Property'}`)
        console.log(`📍 Address: ${address}`)

        // Add a longer delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000))

        const coords = await geocodeAddress(address)
        
        if (coords) {
          console.log(`✅ Found coordinates: ${coords.lat}, ${coords.lng}`)
          console.log(`📍 Location: ${coords.display_name}`)

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
          console.log(`❌ Could not find coordinates for: ${address}`)
          errors.push({ property: property.name, error: 'No coordinates found' })
          errorCount++
        }

      } catch (error) {
        console.error(`❌ Error processing ${property.name}:`, error.message)
        errors.push({ property: property.name, error: error.message })
        errorCount++
      }
    }

    // Summary
    console.log('\n📊 Geocoding Summary:')
    console.log(`✅ Successfully updated: ${successCount} properties`)
    console.log(`❌ Failed to update: ${errorCount} properties`)

    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      errors.forEach(({ property, error }) => {
        console.log(`  - ${property}: ${error}`)
      })
    }

    console.log('\n🎉 Geocoding process completed!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the script
addMissingCoordinates().catch(console.error)
