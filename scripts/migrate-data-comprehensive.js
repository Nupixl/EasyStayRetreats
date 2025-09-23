const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function migrateDataComprehensive() {
  console.log('🚀 Starting comprehensive data migration...')

  try {
    // 1. Fetch data from App-Properties
    console.log('📋 Fetching data from App-Properties table...')
    const { data: appProperties, error: appError } = await supabaseAdmin
      .from('App-Properties')
      .select('*')

    if (appError) {
      console.error('Error fetching App-Properties:', appError)
      return
    }
    console.log(`✅ Found ${appProperties.length} records in App-Properties`)

    // 2. Fetch existing properties to avoid duplicates
    console.log('📋 Checking existing properties...')
    const { data: existingProperties, error: existingError } = await supabaseAdmin
      .from('properties')
      .select('id, title')

    if (existingError) {
      console.error('Error fetching existing properties:', existingError)
      return
    }
    console.log(`✅ Found ${existingProperties.length} existing properties`)

    const existingTitles = new Set(existingProperties.map(p => p.title))

    // 3. Migrate properties
    console.log('🔄 Migrating properties...')
    let migratedCount = 0
    let skippedCount = 0

    for (const prop of appProperties) {
      // Skip if already exists
      if (existingTitles.has(prop.name)) {
        console.log(`⚠️  Skipping existing property: ${prop.name}`)
        skippedCount++
        continue
      }

      try {
        // Insert property
        const { data: propertyData, error: propertyError } = await supabaseAdmin
          .from('properties')
          .insert([{
            title: prop.name,
            description: prop.body_description,
            location: prop.city,
            price: prop.price_starts_at,
            about: prop.body_description,
            latitude: prop.latitude,
            longitude: prop.longitude,
            rating: prop.property_rating,
            review_count: prop.total_reviews || 0,
            is_active: true
          }])
          .select()

        if (propertyError) {
          console.error(`❌ Error inserting property ${prop.name}:`, propertyError)
          continue
        }

        const propertyId = propertyData[0].id
        console.log(`✅ Migrated property: ${prop.name}`)
        migratedCount++

        // 4. Migrate images
        if (prop.card_image) {
          await supabaseAdmin
            .from('property_images')
            .insert([{
              property_id: propertyId,
              url: prop.card_image,
              alt_text: `${prop.name} main image`,
              is_primary: true,
              sort_order: 1
            }])
        }

        // Migrate additional images if they exist
        const additionalImages = [
          prop.hero_slider_image_first,
          prop.hero_slider_image_second,
          prop.hero_slider_image_third,
          prop.showcase_featured_image,
          prop.showcase_images_4
        ].filter(Boolean)

        for (let i = 0; i < additionalImages.length; i++) {
          await supabaseAdmin
            .from('property_images')
            .insert([{
              property_id: propertyId,
              url: additionalImages[i],
              alt_text: `${prop.name} image ${i + 2}`,
              is_primary: false,
              sort_order: i + 2
            }])
        }

        // 5. Create or find host
        if (prop.account_owner) {
          const { data: existingHost, error: hostError } = await supabaseAdmin
            .from('hosts')
            .select('id')
            .eq('name', prop.account_owner)
            .single()

          let hostId
          if (hostError && hostError.code === 'PGRST116') {
            // Host doesn't exist, create it
            const { data: newHost, error: newHostError } = await supabaseAdmin
              .from('hosts')
              .insert([{
                name: prop.account_owner,
                email: `${prop.account_owner.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                bio: `Host of ${prop.name}`,
                review_count: 0
              }])
              .select()

            if (newHostError) {
              console.error(`❌ Error creating host for ${prop.name}:`, newHostError)
            } else {
              hostId = newHost[0].id
              console.log(`✅ Created host: ${prop.account_owner}`)
            }
          } else if (existingHost) {
            hostId = existingHost.id
          }

          // Link property to host
          if (hostId) {
            await supabaseAdmin
              .from('property_hosts')
              .insert([{
                property_id: propertyId,
                host_id: hostId,
                is_primary: true
              }])
          }
        }

        // 6. Add basic amenities based on property features
        const basicAmenities = ['WiFi', 'Kitchen', 'Parking']
        for (const amenityName of basicAmenities) {
          const { data: amenity, error: amenityError } = await supabaseAdmin
            .from('amenities')
            .select('id')
            .eq('name', amenityName)
            .single()

          if (amenity) {
            await supabaseAdmin
              .from('property_amenities')
              .insert([{
                property_id: propertyId,
                amenity_id: amenity.id
              }])
          }
        }

        // 7. Add basic category
        const { data: category, error: categoryError } = await supabaseAdmin
          .from('categories')
          .select('id')
          .eq('name', 'Unique')
          .single()

        if (category) {
          await supabaseAdmin
            .from('property_categories')
            .insert([{
              property_id: propertyId,
              category_id: category.id
            }])
        }

      } catch (error) {
        console.error(`❌ Error processing property ${prop.name}:`, error)
      }
    }

    console.log(`\n📊 Migration Summary:`)
    console.log(`✅ Migrated: ${migratedCount} properties`)
    console.log(`⚠️  Skipped: ${skippedCount} properties (already exist)`)
    console.log(`📋 Total processed: ${migratedCount + skippedCount} properties`)

    // 8. Verify final counts
    console.log('\n🔍 Verifying migration...')
    const { data: finalProperties, error: finalError } = await supabaseAdmin
      .from('properties')
      .select('id')

    if (finalError) {
      console.error('Error verifying migration:', finalError)
      return
    }

    const { data: finalImages, error: imagesError } = await supabaseAdmin
      .from('property_images')
      .select('id')

    const { data: finalHosts, error: hostsError } = await supabaseAdmin
      .from('hosts')
      .select('id')

    const { data: finalAmenities, error: amenitiesError } = await supabaseAdmin
      .from('amenities')
      .select('id')

    const { data: finalCategories, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('id')

    console.log(`✅ Final counts:`)
    console.log(`   Properties: ${finalProperties.length}`)
    console.log(`   Images: ${finalImages?.length || 0}`)
    console.log(`   Hosts: ${finalHosts?.length || 0}`)
    console.log(`   Amenities: ${finalAmenities?.length || 0}`)
    console.log(`   Categories: ${finalCategories?.length || 0}`)

    console.log('\n🎉 Migration completed successfully!')

  } catch (error) {
    console.error('Unexpected error during migration:', error)
  }
}

migrateDataComprehensive()
