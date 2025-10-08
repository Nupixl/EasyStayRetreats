require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function analyzeDatabaseSchema() {
  console.log('🔍 Analyzing database schema to understand table relationships...\n');

  try {
    // Check all tables that might contain properties
    const tablesToCheck = [
      'properties',
      'App-Properties', 
      'app-properties',
      'app_properties',
      'property_images',
      'hosts',
      'app_hosts'
    ];

    console.log('📋 Checking all relevant tables:');
    
    for (const tableName of tablesToCheck) {
      console.log(`\n🔍 Table: ${tableName}`);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`   ❌ Error: ${error.message}`);
        } else if (data && data.length > 0) {
          console.log(`   ✅ Found ${data.length} records`);
          console.log(`   📋 Columns: ${Object.keys(data[0]).join(', ')}`);
          
          // Check if this table has an ID that might be referenced by property_images
          const record = data[0];
          const idFields = Object.keys(record).filter(key => 
            key.toLowerCase().includes('id') || 
            key.toLowerCase().includes('uuid') ||
            key === 'id'
          );
          
          if (idFields.length > 0) {
            console.log(`   🔑 ID fields: ${idFields.join(', ')}`);
            idFields.forEach(field => {
              console.log(`      ${field}: ${record[field]} (${typeof record[field]})`);
            });
          }
        } else {
          console.log(`   📊 Empty table`);
        }
      } catch (e) {
        console.log(`   ❌ Exception: ${e.message}`);
      }
    }

    // Try to understand the foreign key by checking if we can insert into property_images
    // with different property_id values
    console.log('\n🧪 Testing property_images foreign key constraint...');
    
    // Test with a UUID that definitely doesn't exist
    const testUuid = '00000000-0000-0000-0000-000000000000';
    const { error: testError } = await supabase
      .from('property_images')
      .insert({
        property_id: testUuid,
        url: 'https://example.com/test.jpg',
        alt_text: 'Test'
      });

    console.log(`   Test with non-existent UUID: ${testError ? 'Failed' : 'Succeeded'}`);
    if (testError) {
      console.log(`   Error: ${testError.message}`);
    }

    // Check if there are any existing property_images to see what property_id format they use
    console.log('\n📊 Checking existing property_images records...');
    const { data: existingImages, error: imagesError } = await supabase
      .from('property_images')
      .select('*');

    if (imagesError) {
      console.log(`❌ Error fetching property_images: ${imagesError.message}`);
    } else {
      console.log(`✅ Found ${existingImages.length} existing images`);
      if (existingImages.length > 0) {
        console.log('📋 Sample property_images record:');
        console.log(JSON.stringify(existingImages[0], null, 2));
      }
    }

    // Check if we need to create a record in the 'properties' table first
    console.log('\n🏗️  Checking if we need to create a properties record...');
    
    // Get Berkshires Retreat from App-Properties
    const { data: berkshiresProperty, error: berkshiresError } = await supabase
      .from('App-Properties')
      .select('whalesync_postgres_id, name, city, hospitable_id')
      .ilike('name', '%Berkshires Retreat%')
      .single();

    if (berkshiresError) {
      console.log(`❌ Error finding Berkshires Retreat: ${berkshiresError.message}`);
    } else {
      console.log(`✅ Found Berkshires Retreat: ${berkshiresProperty.name}`);
      console.log(`   whalesync_postgres_id: ${berkshiresProperty.whalesync_postgres_id}`);
      console.log(`   hospitable_id: ${berkshiresProperty.hospitable_id}`);
      
      // Try to create a corresponding record in the 'properties' table
      console.log('\n🏗️  Attempting to create properties record...');
      const { data: newProperty, error: createError } = await supabase
        .from('properties')
        .insert({
          id: berkshiresProperty.whalesync_postgres_id,
          name: berkshiresProperty.name,
          city: berkshiresProperty.city,
          hospitable_id: berkshiresProperty.hospitable_id
        })
        .select()
        .single();

      if (createError) {
        console.log(`❌ Error creating properties record: ${createError.message}`);
      } else {
        console.log(`✅ Successfully created properties record: ${newProperty.id}`);
        
        // Now try to insert images
        console.log('\n📸 Attempting to insert images with the new properties record...');
        const { error: imageError } = await supabase
          .from('property_images')
          .insert({
            property_id: newProperty.id,
            url: 'https://example.com/test-success.jpg',
            alt_text: 'Test successful'
          });

        if (imageError) {
          console.log(`❌ Still failed to insert image: ${imageError.message}`);
        } else {
          console.log(`✅ Successfully inserted test image!`);
          
          // Clean up test data
          await supabase.from('property_images').delete().eq('url', 'https://example.com/test-success.jpg');
          console.log(`🧹 Cleaned up test image`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

analyzeDatabaseSchema();
