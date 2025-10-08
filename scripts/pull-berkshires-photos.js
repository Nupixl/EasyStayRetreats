require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const HospitableClient = require('../mcp/hospitable/client');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hospitableApiKey = process.env.HOSPITABLE_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !hospitableApiKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const hospitableClient = new HospitableClient(hospitableApiKey);

async function pullBerkshiresPhotos() {
  console.log('📸 Pulling photos for Berkshires Retreat property...\n');

  const berkshiresHospitableId = 'a00926c9-0136-43a1-b3d1-7a878af9a2ab';
  const berkshiresSupabaseId = 'b8c9aa25-cb16-418a-be74-2593268990ea';

  try {
    // 1. Get property details from Hospitable
    console.log('1. Fetching property details from Hospitable...');
    const propertyDetails = await hospitableClient.getProperty(berkshiresHospitableId);
    console.log('✅ Retrieved property details from Hospitable');
    console.log(`📋 Property: ${propertyDetails.name}`);
    console.log(`📍 Location: ${propertyDetails.address?.city}, ${propertyDetails.address?.state}`);
    console.log(`🏠 Type: ${propertyDetails.property_type}`);
    console.log(`👥 Capacity: ${propertyDetails.capacity?.max} guests`);

    // 2. Check for images in the property details
    console.log('\n2. Checking for images in property details...');
    if (propertyDetails.images && propertyDetails.images.length > 0) {
      console.log(`📊 Found ${propertyDetails.images.length} images in Hospitable property details:`);
      
      propertyDetails.images.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.url || img.src || img} (Type: ${img.type || 'Unknown'})`);
      });

      // Store images in Supabase
      console.log('\n3. Storing images in Supabase...');
      for (let i = 0; i < propertyDetails.images.length; i++) {
        const img = propertyDetails.images[i];
        const imageUrl = img.url || img.src || img;
        
        if (imageUrl) {
          try {
            const { error: insertError } = await supabase
              .from('property_images')
              .insert({
                property_id: berkshiresSupabaseId, // Using Supabase property ID
                url: imageUrl,
                alt_text: `Berkshires Retreat - Image ${i + 1}`,
                order_index: i
              });

            if (insertError) {
              console.log(`⚠️  Error storing image ${i + 1}:`, insertError.message);
            } else {
              console.log(`✅ Stored image ${i + 1}: ${imageUrl}`);
            }
          } catch (err) {
            console.log(`⚠️  Error storing image ${i + 1}:`, err.message);
          }
        }
      }
    } else {
      console.log('⚠️  No images found in property details.');
      console.log('📋 Available property detail keys:', Object.keys(propertyDetails));
    }

    // 3. Try to get photos from a different endpoint if available
    console.log('\n4. Trying alternative photo endpoints...');
    try {
      // Some APIs have separate photo endpoints
      const photosEndpoint = `/properties/${berkshiresHospitableId}/photos`;
      console.log(`🔍 Trying endpoint: ${photosEndpoint}`);
      
      const photosResponse = await hospitableClient.request(photosEndpoint);
      console.log('✅ Photos endpoint response:', photosResponse);
      
    } catch (photoError) {
      console.log('⚠️  No separate photos endpoint available:', photoError.message);
    }

    // 4. Check existing images in Supabase
    console.log('\n5. Checking existing images in Supabase...');
    const { data: existingImages, error: imagesError } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', berkshiresSupabaseId)
      .order('order_index');

    if (imagesError) {
      console.error('❌ Error fetching existing images:', imagesError);
    } else {
      console.log(`📊 Found ${existingImages.length} existing images in Supabase for Berkshires Retreat`);
      
      if (existingImages.length > 0) {
        console.log('\n🖼️  Existing images:');
        existingImages.forEach((img, index) => {
          console.log(`   ${index + 1}. ${img.url} (Order: ${img.order_index})`);
        });
      }
    }

    // 5. Try to get property photos using a different approach
    console.log('\n6. Trying to get property photos using calendar endpoint...');
    try {
      const calendarData = await hospitableClient.getCalendar(berkshiresHospitableId, '2024-01-01', '2024-12-31');
      console.log('📅 Calendar data keys:', Object.keys(calendarData));
      
      if (calendarData.photos) {
        console.log(`📸 Found ${calendarData.photos.length} photos in calendar data`);
        calendarData.photos.forEach((photo, index) => {
          console.log(`   ${index + 1}. ${photo.url || photo.src || photo}`);
        });
      }
    } catch (calendarError) {
      console.log('⚠️  Calendar endpoint error:', calendarError.message);
    }

    // 6. Display final summary
    console.log('\n📊 Summary:');
    console.log(`✅ Property: Berkshires Retreat`);
    console.log(`🔗 Hospitable ID: ${berkshiresHospitableId}`);
    console.log(`🔗 Supabase ID: ${berkshiresSupabaseId}`);
    console.log(`📍 Location: Lenox, MA`);
    console.log(`📸 Total images in Supabase: ${existingImages?.length || 0}`);

  } catch (error) {
    console.error('❌ Error pulling Berkshires photos:', error);
  }
}

pullBerkshiresPhotos();
