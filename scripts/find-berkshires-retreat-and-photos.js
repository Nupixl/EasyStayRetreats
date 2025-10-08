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

async function findBerkshiresRetreat() {
  console.log('🔍 Finding Berkshires Retreat property...\n');

  try {
    // Search for Berkshires Retreat in the database
    console.log('1. Searching for Berkshires Retreat in Supabase...');
    const { data: properties, error: searchError } = await supabase
      .from('properties')
      .select('*')
      .ilike('title', '%berkshires%')
      .or('title.ilike.%retreat%');

    if (searchError) {
      console.error('❌ Error searching properties:', searchError);
      return;
    }

    if (properties.length === 0) {
      console.log('⚠️  No Berkshires Retreat found in Supabase. Searching all properties...');
      
      // Get all properties to see what's available
      const { data: allProperties, error: allError } = await supabase
        .from('properties')
        .select('id, title, location')
        .limit(10);

      if (allError) {
        console.error('❌ Error fetching all properties:', allError);
        return;
      }

      console.log('📋 Available properties:');
      allProperties.forEach((prop, index) => {
        console.log(`   ${index + 1}. ${prop.title} (${prop.location || 'No location'})`);
      });

      // Try to find a property that might be Berkshires Retreat
      const berkshiresProperty = allProperties.find(prop => 
        prop.title.toLowerCase().includes('berkshire') || 
        prop.title.toLowerCase().includes('retreat') ||
        prop.title.toLowerCase().includes('mountain')
      );

      if (berkshiresProperty) {
        console.log(`\n✅ Found potential match: ${berkshiresProperty.title}`);
        await pullPropertyPhotos(berkshiresProperty.id, berkshiresProperty.title);
      } else {
        console.log('\n⚠️  No Berkshires Retreat found. Let\'s check Hospitable API...');
        await checkHospitableForBerkshires();
      }
    } else {
      console.log(`✅ Found ${properties.length} Berkshires Retreat properties:`);
      properties.forEach((prop, index) => {
        console.log(`   ${index + 1}. ${prop.title} (ID: ${prop.id})`);
      });

      // Use the first match
      const berkshiresProperty = properties[0];
      console.log(`\n📸 Pulling photos for: ${berkshiresProperty.title}`);
      await pullPropertyPhotos(berkshiresProperty.id, berkshiresProperty.title);
    }

  } catch (error) {
    console.error('❌ Error finding Berkshires Retreat:', error);
  }
}

async function checkHospitableForBerkshires() {
  console.log('\n2. Checking Hospitable API for Berkshires Retreat...');

  try {
    const properties = await hospitableClient.getProperties();
    console.log(`📊 Found ${properties.data.length} properties in Hospitable`);

    // Search for Berkshires Retreat
    const berkshiresProperties = properties.data.filter(prop => 
      prop.name.toLowerCase().includes('berkshire') || 
      prop.name.toLowerCase().includes('retreat') ||
      prop.name.toLowerCase().includes('mountain')
    );

    if (berkshiresProperties.length > 0) {
      console.log(`✅ Found ${berkshiresProperties.length} potential Berkshires properties in Hospitable:`);
      berkshiresProperties.forEach((prop, index) => {
        console.log(`   ${index + 1}. ${prop.name} (ID: ${prop.id})`);
      });

      // Use the first match
      const berkshiresProperty = berkshiresProperties[0];
      console.log(`\n📸 Pulling photos for: ${berkshiresProperty.name}`);
      await pullHospitablePropertyPhotos(berkshiresProperty.id, berkshiresProperty.name);
    } else {
      console.log('⚠️  No Berkshires Retreat found in Hospitable either.');
      console.log('\n📋 Available Hospitable properties:');
      properties.data.slice(0, 5).forEach((prop, index) => {
        console.log(`   ${index + 1}. ${prop.name} (ID: ${prop.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking Hospitable API:', error);
  }
}

async function pullPropertyPhotos(propertyId, propertyTitle) {
  console.log(`\n📸 Pulling photos for property: ${propertyTitle} (ID: ${propertyId})`);

  try {
    // Get existing images from Supabase
    const { data: existingImages, error: imagesError } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', propertyId)
      .order('order_index');

    if (imagesError) {
      console.error('❌ Error fetching existing images:', imagesError);
      return;
    }

    console.log(`📊 Found ${existingImages.length} existing images in Supabase`);

    if (existingImages.length > 0) {
      console.log('\n🖼️  Existing images:');
      existingImages.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.url} (Order: ${img.order_index})`);
      });
    } else {
      console.log('⚠️  No existing images found in Supabase for this property.');
    }

    // Try to get property details from Hospitable if we have a hospitable_property_id
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('hospitable_property_id')
      .eq('id', propertyId)
      .single();

    if (propertyError) {
      console.log('⚠️  Could not fetch property details:', propertyError.message);
    } else if (property.hospitable_property_id) {
      console.log(`\n🔗 Found Hospitable property ID: ${property.hospitable_property_id}`);
      await pullHospitablePropertyPhotos(property.hospitable_property_id, propertyTitle);
    } else {
      console.log('⚠️  No Hospitable property ID found for this property.');
    }

  } catch (error) {
    console.error('❌ Error pulling property photos:', error);
  }
}

async function pullHospitablePropertyPhotos(hospitablePropertyId, propertyTitle) {
  console.log(`\n📸 Pulling photos from Hospitable for: ${propertyTitle} (Hospitable ID: ${hospitablePropertyId})`);

  try {
    // Get property details from Hospitable
    const propertyDetails = await hospitableClient.getProperty(hospitablePropertyId);
    console.log('✅ Retrieved property details from Hospitable');

    // Check if property has images/photos
    if (propertyDetails.images && propertyDetails.images.length > 0) {
      console.log(`📊 Found ${propertyDetails.images.length} images in Hospitable:`);
      
      propertyDetails.images.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.url || img.src || 'No URL'} (Type: ${img.type || 'Unknown'})`);
      });

      // Store images in Supabase
      console.log('\n💾 Storing images in Supabase...');
      for (let i = 0; i < propertyDetails.images.length; i++) {
        const img = propertyDetails.images[i];
        const imageUrl = img.url || img.src || img;
        
        if (imageUrl) {
          try {
            const { error: insertError } = await supabase
              .from('property_images')
              .insert({
                property_id: hospitablePropertyId, // Using Hospitable ID as reference
                url: imageUrl,
                alt_text: `${propertyTitle} - Image ${i + 1}`,
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
      console.log('⚠️  No images found in Hospitable property details.');
      console.log('📋 Property details keys:', Object.keys(propertyDetails));
    }

  } catch (error) {
    console.error('❌ Error pulling Hospitable photos:', error);
  }
}

// Run the script
findBerkshiresRetreat();
