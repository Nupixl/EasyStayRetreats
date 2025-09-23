const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function migrateToUnifiedSchema() {
  console.log('🚀 Starting migration to unified schema...')

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

    // 2. Get data from properties table (if it exists)
    console.log('📋 Fetching data from properties table...')
    const { data: properties, error: propError } = await supabaseAdmin
      .from('properties')
      .select('*')

    if (propError) {
      console.log('⚠️  Properties table not found or empty, continuing with App-Properties only')
    } else {
      console.log(`✅ Found ${properties.length} records in properties table`)
    }

    // 3. Migrate App-Properties data to unified properties table
    console.log('🔄 Migrating App-Properties data...')
    
    for (const appProp of appProperties) {
      const propertyData = {
        title: appProp.name || appProp.title || 'Untitled Property',
        rating: appProp.property_rating || appProp.rating || 4.5,
        review_count: appProp.total_reviews || appProp.review_count || 0,
        location: appProp.city || appProp.location || 'Unknown Location',
        price: appProp.price_starts_at || appProp.price || 0,
        about: appProp.body_description || appProp.about || '',
        latitude: appProp.latitude || 0,
        longitude: appProp.longitude || 0,
        created_at: appProp.created || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Keep original fields for reference
        name: appProp.name,
        city: appProp.city,
        price_starts_at: appProp.price_starts_at,
        body_description: appProp.body_description,
        card_image: appProp.card_image,
        whalesync_postgres_id: appProp.whalesync_postgres_id,
        property_rating: appProp.property_rating,
        total_reviews: appProp.total_reviews,
        created: appProp.created
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

    // 4. Migrate properties table data (if it exists and has different data)
    if (properties && properties.length > 0) {
      console.log('🔄 Migrating properties table data...')
      
      for (const prop of properties) {
        // Check if this property already exists (by title/location)
        const { data: existingProperty } = await supabaseAdmin
          .from('properties')
          .select('id')
          .eq('title', prop.title)
          .eq('location', prop.location)
          .single()

        if (!existingProperty) {
          const propertyData = {
            title: prop.title || 'Untitled Property',
            rating: prop.rating || 4.5,
            review_count: prop.review_count || 0,
            location: prop.location || 'Unknown Location',
            price: prop.price || 0,
            about: prop.about || '',
            latitude: prop.latitude || 0,
            longitude: prop.longitude || 0,
            created_at: prop.created_at || new Date().toISOString(),
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
          }
        } else {
          console.log(`⚠️  Property already exists: ${prop.title}`)
        }
      }
    }

    // 5. Verify migration
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

migrateToUnifiedSchema()