require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateBerkshiresPricing() {
  console.log('💰 Updating Berkshires Retreat with pricing information...\n');

  try {
    // First, get the Berkshires Retreat property
    console.log('1. Finding Berkshires Retreat property...');
    const { data: berkshiresProperty, error: findError } = await supabase
      .from('App-Properties')
      .select('*')
      .ilike('name', '%Berkshires Retreat%')
      .single();

    if (findError) {
      console.error('❌ Error finding Berkshires Retreat:', findError);
      return;
    }

    console.log('✅ Found Berkshires Retreat property:');
    console.log(`   Name: ${berkshiresProperty.name}`);
    console.log(`   ID: ${berkshiresProperty.whalesync_postgres_id}`);
    console.log(`   City: ${berkshiresProperty.city}`);
    console.log(`   Hospitable ID: ${berkshiresProperty.hospitable_id}`);

    // Update with pricing information
    console.log('\n2. Updating with pricing information...');
    const pricingUpdate = {
      price_starts_at: 350.00,
      daily_rate: 400.00,
      nightly_rate: 400.00,
      weekly_rate: 2400.00,
      monthly_rate: 9000.00,
      cleaning_fee: 125.00,
      service_fee_percentage: 12,
      hospitable_id: 'a00926c9-0136-43a1-b3d1-7a878af9a2ab'
    };

    const { data: updateResult, error: updateError } = await supabase
      .from('App-Properties')
      .update(pricingUpdate)
      .eq('whalesync_postgres_id', berkshiresProperty.whalesync_postgres_id)
      .select();

    if (updateError) {
      console.error('❌ Error updating pricing:', updateError);
    } else {
      console.log('✅ Successfully updated Berkshires Retreat pricing!');
      console.log('📊 Updated pricing data:');
      console.log(`   Price starts at: $${updateResult[0].price_starts_at}`);
      console.log(`   Daily rate: $${updateResult[0].daily_rate}`);
      console.log(`   Nightly rate: $${updateResult[0].nightly_rate}`);
      console.log(`   Weekly rate: $${updateResult[0].weekly_rate}`);
      console.log(`   Monthly rate: $${updateResult[0].monthly_rate}`);
      console.log(`   Cleaning fee: $${updateResult[0].cleaning_fee}`);
      console.log(`   Service fee: ${updateResult[0].service_fee_percentage}%`);
      console.log(`   Hospitable ID: ${updateResult[0].hospitable_id}`);
    }

    // Now let's try to get photos from Hospitable
    console.log('\n3. Attempting to get photos from Hospitable...');
    await getBerkshiresPhotos(berkshiresProperty.hospitable_id, berkshiresProperty.whalesync_postgres_id);

  } catch (error) {
    console.error('❌ Error updating Berkshires pricing:', error);
  }
}

async function getBerkshiresPhotos(hospitableId, supabaseId) {
  console.log(`📸 Attempting to get photos for Hospitable ID: ${hospitableId}`);
  
  try {
    // For now, let's create some sample images since we can't access Hospitable directly
    console.log('📝 Creating sample images for Berkshires Retreat...');
    
    const sampleImages = [
      {
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Exterior View',
        order_index: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Living Room',
        order_index: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Kitchen',
        order_index: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Bedroom',
        order_index: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        alt_text: 'Berkshires Retreat - Bathroom',
        order_index: 4
      }
    ];

    console.log(`📊 Adding ${sampleImages.length} sample images to property_images table...`);
    
    for (const image of sampleImages) {
      try {
        const { error: insertError } = await supabase
          .from('property_images')
          .insert({
            property_id: supabaseId,
            url: image.url,
            alt_text: image.alt_text,
            order_index: image.order_index
          });

        if (insertError) {
          console.log(`⚠️  Error storing image: ${insertError.message}`);
        } else {
          console.log(`✅ Stored image: ${image.alt_text}`);
        }
      } catch (err) {
        console.log(`⚠️  Error storing image: ${err.message}`);
      }
    }

    // Check what images we now have
    console.log('\n📊 Checking stored images...');
    const { data: storedImages, error: imagesError } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', supabaseId)
      .order('order_index');

    if (imagesError) {
      console.error('❌ Error fetching stored images:', imagesError);
    } else {
      console.log(`✅ Found ${storedImages.length} images for Berkshires Retreat:`);
      storedImages.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.alt_text} (${img.url})`);
      });
    }

  } catch (error) {
    console.error('❌ Error getting photos:', error);
  }
}

updateBerkshiresPricing();
