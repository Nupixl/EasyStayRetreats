require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPropertyImagesStructure() {
  console.log('🔍 Checking property_images table structure and relationships...\n');

  try {
    // Check property_images table structure
    console.log('1. Checking property_images table structure...');
    const { data: sampleImage, error: sampleError } = await supabase
      .from('property_images')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log('❌ Error accessing property_images:', sampleError.message);
    } else if (sampleImage && sampleImage.length > 0) {
      console.log('📋 property_images columns:');
      Object.keys(sampleImage[0]).forEach((key, index) => {
        console.log(`   ${index + 1}. ${key}: ${typeof sampleImage[0][key]}`);
      });
    } else {
      console.log('📋 property_images table is empty');
    }

    // Check App-Properties table structure
    console.log('\n2. Checking App-Properties table structure...');
    const { data: sampleProperty, error: propertyError } = await supabase
      .from('App-Properties')
      .select('*')
      .limit(1);

    if (propertyError) {
      console.log('❌ Error accessing App-Properties:', propertyError.message);
    } else if (sampleProperty && sampleProperty.length > 0) {
      console.log('📋 App-Properties columns:');
      Object.keys(sampleProperty[0]).forEach((key, index) => {
        console.log(`   ${index + 1}. ${key}: ${typeof sampleProperty[0][key]}`);
      });
    }

    // Check if there are any existing property_images
    console.log('\n3. Checking existing property_images...');
    const { data: allImages, error: allImagesError } = await supabase
      .from('property_images')
      .select('*');

    if (allImagesError) {
      console.log('❌ Error fetching all images:', allImagesError.message);
    } else {
      console.log(`📊 Found ${allImages.length} existing images in property_images table`);
      if (allImages.length > 0) {
        console.log('📋 Sample image record:');
        console.log(JSON.stringify(allImages[0], null, 2));
      }
    }

    // Check what property IDs exist in App-Properties
    console.log('\n4. Checking property IDs in App-Properties...');
    const { data: properties, error: propertiesError } = await supabase
      .from('App-Properties')
      .select('whalesync_postgres_id, name')
      .limit(5);

    if (propertiesError) {
      console.log('❌ Error fetching properties:', propertiesError.message);
    } else {
      console.log(`📊 Found ${properties.length} properties in App-Properties:`);
      properties.forEach((prop, index) => {
        console.log(`   ${index + 1}. ${prop.name} (ID: ${prop.whalesync_postgres_id})`);
      });
    }

    // Try to understand the foreign key relationship
    console.log('\n5. Testing foreign key relationship...');
    const berkshiresId = 'b8c9aa25-cb16-418a-be74-2593268990ea';
    
    // Check if this ID exists in any table that might be referenced
    const tablesToCheck = ['properties', 'App-Properties'];
    
    for (const tableName of tablesToCheck) {
      try {
        const { data: checkData, error: checkError } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', berkshiresId)
          .limit(1);

        if (checkError) {
          console.log(`❌ Error checking ${tableName}: ${checkError.message}`);
        } else if (checkData && checkData.length > 0) {
          console.log(`✅ Found property with ID ${berkshiresId} in ${tableName}`);
        } else {
          console.log(`⚠️  No property found with ID ${berkshiresId} in ${tableName}`);
        }
      } catch (e) {
        console.log(`❌ Error checking ${tableName}: ${e.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkPropertyImagesStructure();
