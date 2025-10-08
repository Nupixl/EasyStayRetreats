require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupPropertiesAndImagesFixed() {
  console.log('🏗️  Setting up properties table and adding Berkshires Retreat images (fixed)...\n');

  try {
    // Get Berkshires Retreat from App-Properties
    console.log('1. Finding Berkshires Retreat in App-Properties...');
    const { data: berkshiresProperty, error: findError } = await supabase
      .from('App-Properties')
      .select('whalesync_postgres_id, name, city, hospitable_id, price_starts_at, daily_rate, cleaning_fee, service_fee_percentage')
      .ilike('name', '%Berkshires Retreat%')
      .single();

    if (findError) {
      console.error('❌ Error finding Berkshires Retreat:', findError);
      return;
    }

    console.log(`✅ Found Berkshires Retreat: ${berkshiresProperty.name}`);
    console.log(`   ID: ${berkshiresProperty.whalesync_postgres_id}`);
    console.log(`   City: ${berkshiresProperty.city}`);
    console.log(`   Hospitable ID: ${berkshiresProperty.hospitable_id}`);

    // Create a record in the properties table with all required fields
    console.log('\n2. Creating properties table record with required fields...');
    const { data: newProperty, error: createError } = await supabase
      .from('properties')
      .insert({
        id: berkshiresProperty.whalesync_postgres_id,
        title: berkshiresProperty.name, // Required field
        name: berkshiresProperty.name,
        city: berkshiresProperty.city,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating properties record:', createError);
      return;
    }

    console.log(`✅ Created properties record: ${newProperty.id}`);

    // Now add images to property_images
    console.log('\n3. Adding images to property_images table...');
    
    const sampleImages = [
      {
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Exterior View'
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Living Room'
      },
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Kitchen'
      },
      {
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Bedroom'
      },
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Bathroom'
      }
    ];

    let successCount = 0;
    for (let i = 0; i < sampleImages.length; i++) {
      const image = sampleImages[i];
      try {
        const { error: insertError } = await supabase
          .from('property_images')
          .insert({
            property_id: newProperty.id,
            url: image.url,
            alt_text: image.alt_text
          });

        if (insertError) {
          console.log(`⚠️  Error storing image ${i + 1}: ${insertError.message}`);
        } else {
          console.log(`✅ Stored image ${i + 1}: ${image.alt_text}`);
          successCount++;
        }
      } catch (err) {
        console.log(`⚠️  Error storing image ${i + 1}: ${err.message}`);
      }
    }

    // Verify the images were stored
    console.log('\n4. Verifying stored images...');
    const { data: storedImages, error: imagesError } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', newProperty.id);

    if (imagesError) {
      console.error('❌ Error fetching stored images:', imagesError);
    } else {
      console.log(`✅ Found ${storedImages.length} images for Berkshires Retreat:`);
      storedImages.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.alt_text}`);
        console.log(`       URL: ${img.url}`);
        console.log(`       ID: ${img.id}`);
      });
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`✅ Property: Berkshires Retreat`);
    console.log(`🔗 Properties Table ID: ${newProperty.id}`);
    console.log(`🔗 App-Properties ID: ${berkshiresProperty.whalesync_postgres_id}`);
    console.log(`🔗 Hospitable ID: ${berkshiresProperty.hospitable_id}`);
    console.log(`📍 Location: ${berkshiresProperty.city}, MA`);
    console.log(`💰 Pricing: $${berkshiresProperty.price_starts_at || '350'}-$${berkshiresProperty.daily_rate || '400'}/night`);
    console.log(`📸 Images: ${successCount}/${sampleImages.length} photos added successfully`);

    // Show the relationship between tables
    console.log('\n🔗 Database Relationships:');
    console.log(`   App-Properties (${berkshiresProperty.whalesync_postgres_id}) ← Main property data`);
    console.log(`   properties (${newProperty.id}) ← Referenced by property_images`);
    console.log(`   property_images (${storedImages.length} records) ← Images for this property`);

    // Show how to query the data
    console.log('\n📋 How to query the data:');
    console.log(`   // Get property with images`);
    console.log(`   const { data } = await supabase`);
    console.log(`     .from('properties')`);
    console.log(`     .select(\``);
    console.log(`       *,`);
    console.log(`       property_images (*)`);
    console.log(`     \`)`);
    console.log(`     .eq('id', '${newProperty.id}');`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupPropertiesAndImagesFixed();
