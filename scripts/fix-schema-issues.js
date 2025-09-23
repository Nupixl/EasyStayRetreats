const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function fixSchemaIssues() {
  console.log('🔧 Fixing schema issues...')

  try {
    // Create the properties_with_details view
    console.log('📋 Creating properties_with_details view...')
    const { error: viewError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE VIEW properties_with_details AS
        SELECT
            p.id,
            p.title,
            p.description,
            p.rating,
            p.review_count,
            p.location,
            p.price,
            p.about,
            p.latitude,
            p.longitude,
            p.created_at,
            p.updated_at,
            (
                SELECT JSON_AGG(json_build_object('url', pi.url, 'alt_text', pi.alt_text))
                FROM property_images pi
                WHERE pi.property_id = p.id
            ) AS images,
            (
                SELECT JSON_AGG(json_build_object('id', h.id, 'name', h.name, 'profile_image_url', h.profile_image_url))
                FROM hosts h
                JOIN property_hosts ph ON h.id = ph.host_id
                WHERE ph.property_id = p.id AND ph.is_primary = TRUE
            ) AS primary_host,
            (
                SELECT JSON_AGG(json_build_object('user_name', r.user_name, 'review_text', r.review_text, 'rating', r.rating, 'created_at', r.created_at))
                FROM reviews r
                WHERE r.property_id = p.id
            ) AS property_reviews,
            (
                SELECT JSON_AGG(json_build_object('id', a.id, 'name', a.name))
                FROM amenities a
                JOIN property_amenities pa ON a.id = pa.amenity_id
                WHERE pa.property_id = p.id
            ) AS amenities,
            (
                SELECT JSON_AGG(json_build_object('id', c.id, 'name', c.name))
                FROM categories c
                JOIN property_categories pc ON c.id = pc.category_id
                WHERE pc.property_id = p.id
            ) AS categories
        FROM
            properties p;
      `
    })

    if (viewError) {
      console.error('❌ Error creating view:', viewError)
    } else {
      console.log('✅ properties_with_details view created successfully')
    }

    // Test the view
    console.log('🧪 Testing the view...')
    const { data: viewTest, error: testError } = await supabaseAdmin
      .from('properties_with_details')
      .select('*')
      .limit(1)

    if (testError) {
      console.error('❌ Error testing view:', testError)
    } else {
      console.log('✅ View is working correctly')
      if (viewTest.length > 0) {
        console.log('📋 Sample view data keys:', Object.keys(viewTest[0]))
      }
    }

  } catch (error) {
    console.error('Unexpected error during schema fix:', error)
  }
}

fixSchemaIssues()
