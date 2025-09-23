const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function migrateAppPropertiesData() {
  console.log('🚀 Starting comprehensive migration from App-Properties to properties...')

  try {
    // 1. First, let's check what's in App-Properties
    console.log('📋 Fetching data from App-Properties table...')
    const { data: appProperties, error: appError } = await supabaseAdmin
      .from('App-Properties')
      .select('*')

    if (appError) {
      console.error('❌ Error fetching App-Properties:', appError)
      return
    }
    console.log(`✅ Found ${appProperties.length} records in App-Properties`)

    // 2. Check current properties table
    console.log('📋 Checking current properties table...')
    const { data: existingProperties, error: existingError } = await supabaseAdmin
      .from('properties')
      .select('id, title')
      .limit(5)

    if (existingError) {
      console.error('❌ Error fetching existing properties:', existingError)
    } else {
      console.log(`📋 Found ${existingProperties.length} existing properties`)
    }

    // 3. Migrate App-Properties data to properties table
    console.log('🔄 Migrating App-Properties data...')
    let migratedCount = 0
    let errorCount = 0

    for (const prop of appProperties) {
      try {
        // Map App-Properties schema to properties schema
        const propertyData = {
          title: prop.name || 'Untitled Property',
          rating: prop.property_rating || 4.5,
          review_count: prop.total_reviews || 0,
          location: prop.city || '',
          price: prop.price_starts_at || 0,
          about: prop.body_description || '',
          latitude: prop.latitude || 0,
          longitude: prop.longitude || 0,
          created_at: prop.created || new Date().toISOString(),
          updated_at: prop.updated || new Date().toISOString()
        }

        // Insert property
        const { data: insertedProperty, error: insertError } = await supabaseAdmin
          .from('properties')
          .insert([propertyData])
          .select()

        if (insertError) {
          console.error(`❌ Error inserting property ${prop.name}:`, insertError)
          errorCount++
          continue
        }

        const propertyId = insertedProperty[0].id
        migratedCount++

        // Migrate images if they exist
        if (prop.card_image) {
          const { error: imageError } = await supabaseAdmin
            .from('property_images')
            .insert([{
              property_id: propertyId,
              url: prop.card_image,
              alt_text: `${prop.name} main image`
            }])

          if (imageError) {
            console.error(`❌ Error inserting image for ${prop.name}:`, imageError)
          } else {
            console.log(`✅ Added image for: ${prop.name}`)
          }
        }

        // Migrate gallery images if they exist (from JSON field)
        if (prop.gallery_images && Array.isArray(prop.gallery_images)) {
          for (let i = 0; i < prop.gallery_images.length; i++) {
            const imageUrl = prop.gallery_images[i]
            if (imageUrl && imageUrl !== prop.card_image) { // Don't duplicate main image
              const { error: galleryImageError } = await supabaseAdmin
                .from('property_images')
                .insert([{
                  property_id: propertyId,
                  url: imageUrl,
                  alt_text: `${prop.name} gallery image ${i + 1}`
                }])

              if (galleryImageError) {
                console.error(`❌ Error inserting gallery image for ${prop.name}:`, galleryImageError)
              }
            }
          }
        }

        console.log(`✅ Migrated: ${prop.name}`)

      } catch (error) {
        console.error(`❌ Unexpected error migrating ${prop.name}:`, error)
        errorCount++
      }
    }

    // 4. Verify migration
    console.log('\n🔍 Verifying migration...')
    const { data: finalProperties, error: finalError } = await supabaseAdmin
      .from('properties')
      .select('id, title')

    if (finalError) {
      console.error('❌ Error verifying migration:', finalError)
    } else {
      console.log(`✅ Migration complete! Total properties: ${finalProperties.length}`)
    }

    // 5. Check images
    const { data: images, error: imagesError } = await supabaseAdmin
      .from('property_images')
      .select('id, property_id, url')
      .limit(5)

    if (imagesError) {
      console.error('❌ Error checking images:', imagesError)
    } else {
      console.log(`✅ Found ${images.length} images (showing first 5)`)
    }

    console.log(`\n📊 Migration Summary:`)
    console.log(`  - Properties migrated: ${migratedCount}`)
    console.log(`  - Errors encountered: ${errorCount}`)
    console.log(`  - Total properties in database: ${finalProperties?.length || 0}`)

  } catch (error) {
    console.error('❌ Unexpected error during migration:', error)
  }
}

migrateAppPropertiesData()
