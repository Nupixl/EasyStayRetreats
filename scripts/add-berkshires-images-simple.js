require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addBerkshiresImages() {
  console.log('📸 Adding images for Berkshires Retreat...\n');

  try {
    // Get the Berkshires Retreat property ID
    const { data: berkshiresProperty, error: findError } = await supabase
      .from('App-Properties')
      .select('whalesync_postgres_id, name')
      .ilike('name', '%Berkshires Retreat%')
      .single();

    if (findError) {
      console.error('❌ Error finding Berkshires Retreat:', findError);
      return;
    }

    console.log(`✅ Found Berkshires Retreat: ${berkshiresProperty.name}`);
    console.log(`   ID: ${berkshiresProperty.whalesync_postgres_id}`);

    // Check the structure of property_images table
    console.log('\n🔍 Checking property_images table structure...');
    const { data: sampleImage, error: sampleError } = await supabase
      .from('property_images')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log('⚠️  Error checking table structure:', sampleError.message);
    } else if (sampleImage && sampleImage.length > 0) {
      console.log('📋 property_images table columns:');
      Object.keys(sampleImage[0]).forEach((key, index) => {
        console.log(`   ${index + 1}. ${key}`);
      });
    } else {
      console.log('📋 property_images table is empty, will create first record');
    }

    // Create sample images without order_index
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

    console.log(`\n📊 Adding ${sampleImages.length} images to property_images table...`);
    
    for (let i = 0; i < sampleImages.length; i++) {
      const image = sampleImages[i];
      try {
        const { error: insertError } = await supabase
          .from('property_images')
          .insert({
            property_id: berkshiresProperty.whalesync_postgres_id,
            url: image.url,
            alt_text: image.alt_text
          });

        if (insertError) {
          console.log(`⚠️  Error storing image ${i + 1}: ${insertError.message}`);
        } else {
          console.log(`✅ Stored image ${i + 1}: ${image.alt_text}`);
        }
      } catch (err) {
        console.log(`⚠️  Error storing image ${i + 1}: ${err.message}`);
      }
    }

    // Check what images we now have
    console.log('\n📊 Checking stored images...');
    const { data: storedImages, error: imagesError } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', berkshiresProperty.whalesync_postgres_id);

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
    console.log(`🔗 Supabase ID: ${berkshiresProperty.whalesync_postgres_id}`);
    console.log(`🔗 Hospitable ID: a00926c9-0136-43a1-b3d1-7a878af9a2ab`);
    console.log(`📍 Location: Lenox, MA`);
    console.log(`💰 Pricing: $350-$400/night`);
    console.log(`📸 Images: ${storedImages?.length || 0} photos added`);

  } catch (error) {
    console.error('❌ Error adding Berkshires images:', error);
  }
}

addBerkshiresImages();
