const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function simpleMigration() {
  console.log('🚀 Starting simple migration...')

  try {
    // 1. Get data from App-Properties table
    console.log('📋 Fetching data from App-Properties table...')
    const { data: appProperties, error: appError } = await supabaseAdmin
      .from('App-Properties')
      .select('*')

    if (appError) {
      console.error('❌ Error fetching App-Properties:', appError)
      return
    }

    console.log(`✅ Found ${appProperties.length} records in App-Properties`)

    // 2. Migrate App-Properties data to unified properties table
    console.log('🔄 Migrating App-Properties data...')
    
    for (const appProp of appProperties) {
      const propertyData = {
        title: appProp.name || 'Untitled Property',
        rating: appProp.property_rating || 4.5,
        review_count: appProp.total_reviews || 0,
        location: appProp.city || 'Unknown Location',
        price: appProp.price_starts_at || 0,
        about: appProp.body_description || '',
        latitude: appProp.latitude || 0,
        longitude: appProp.longitude || 0,
        created_at: appProp.created || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: newProperty, error: insertError } = await supabaseAdmin
        .from('properties')
        .insert([propertyData])
        .select()

      if (insertError) {
        console.error('❌ Error inserting property:', insertError)
      } else {
        console.log(`✅ Migrated property: ${propertyData.title}`)
        
        // Add property image if card_image exists
        if (appProp.card_image) {
          const { error: imageError } = await supabaseAdmin
            .from('property_images')
            .insert([{
              property_id: newProperty[0].id,
              url: appProp.card_image,
              alt_text: `Image for ${propertyData.title}`
            }])

          if (imageError) {
            console.error('❌ Error inserting property image:', imageError)
          } else {
            console.log(`✅ Added image for property: ${propertyData.title}`)
          }
        }
      }
    }

    // 3. Verify migration
    console.log('🔍 Verifying migration...')
    const { data: finalProperties, error: verifyError } = await supabaseAdmin
      .from('properties')
      .select('*')

    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError)
    } else {
      console.log(`✅ Migration complete! Total properties: ${finalProperties.length}`)
    }

  } catch (error) {
    console.error('❌ Unexpected error during migration:', error)
  }
}

simpleMigration()
