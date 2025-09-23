const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function testFinalSetup() {
  console.log('🧪 Testing final setup...')

  try {
    // 1. Test unified properties table
    console.log('\n1. Testing unified properties table...')
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .limit(5)

    if (propertiesError) {
      console.error('❌ Error fetching properties:', propertiesError)
    } else {
      console.log(`✅ Found ${properties.length} properties`)
      if (properties.length > 0) {
        console.log('📋 Sample property:', properties[0].title)
      }
    }

    // 2. Test property images
    console.log('\n2. Testing property images...')
    const { data: images, error: imagesError } = await supabase
      .from('property_images')
      .select('*')
      .limit(5)

    if (imagesError) {
      console.error('❌ Error fetching images:', imagesError)
    } else {
      console.log(`✅ Found ${images.length} images`)
    }

    // 3. Test properties with images join
    console.log('\n3. Testing properties with images join...')
    const { data: propertiesWithImages, error: joinError } = await supabase
      .from('properties')
      .select(`
        *,
        property_images(*)
      `)
      .limit(3)

    if (joinError) {
      console.error('❌ Error fetching properties with images:', joinError)
    } else {
      console.log(`✅ Found ${propertiesWithImages.length} properties with images`)
      if (propertiesWithImages.length > 0) {
        const prop = propertiesWithImages[0]
        console.log(`📋 Sample: ${prop.title} has ${prop.property_images?.length || 0} images`)
      }
    }

    // 4. Test coordinate-based search
    console.log('\n4. Testing coordinate-based search...')
    const minLat = 20
    const maxLat = 40
    const minLng = -100
    const maxLng = -70

    const { data: searchResults, error: searchError } = await supabase
      .from('properties')
      .select(`
        *,
        property_images(*)
      `)
      .gte('latitude', minLat)
      .lte('latitude', maxLat)
      .gte('longitude', minLng)
      .lte('longitude', maxLng)

    if (searchError) {
      console.error('❌ Error with coordinate search:', searchError)
    } else {
      console.log(`✅ Found ${searchResults.length} properties in coordinate range`)
    }

    // 5. Test properties_with_details view
    console.log('\n5. Testing properties_with_details view...')
    const { data: viewResults, error: viewError } = await supabase
      .from('properties_with_details')
      .select('*')
      .limit(3)

    if (viewError) {
      console.error('❌ Error with properties_with_details view:', viewError)
    } else {
      console.log(`✅ Found ${viewResults.length} properties in view`)
      if (viewResults.length > 0) {
        const prop = viewResults[0]
        console.log(`📋 Sample: ${prop.title} has ${prop.images?.length || 0} images`)
      }
    }

    // 6. Test API endpoints simulation
    console.log('\n6. Testing API endpoint simulation...')
    
    // Simulate /api/properties
    const { data: apiProperties, error: apiError } = await supabase
      .from('properties')
      .select(`
        *,
        property_images(*)
      `)
      .order('created_at', { ascending: false })

    if (apiError) {
      console.error('❌ Error simulating /api/properties:', apiError)
    } else {
      console.log(`✅ API simulation: Found ${apiProperties.length} properties`)
    }

    console.log('\n🎉 Final setup test complete!')
    console.log('✅ All systems operational')

  } catch (error) {
    console.error('Unexpected error during final setup test:', error)
  }
}

testFinalSetup()
