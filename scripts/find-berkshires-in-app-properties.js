require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findBerkshiresInAppProperties() {
  console.log('🔍 Searching for Berkshires Retreat in App-Properties table...\n');

  try {
    // Get all properties from App-Properties table
    const { data: properties, error } = await supabase
      .from('App-Properties')
      .select('*')
      .limit(50);

    if (error) {
      console.error('❌ Error fetching properties:', error);
      return;
    }

    console.log(`📊 Found ${properties.length} properties in App-Properties table\n`);

    // Display all properties
    console.log('📋 All properties:');
    properties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.name || 'No name'}`);
      console.log(`   ID: ${prop.whalesync_postgres_id}`);
      console.log(`   City: ${prop.city || 'No city'}`);
      console.log(`   State: ${prop.location_state || prop.state_code || 'No state'}`);
      console.log(`   Price: ${prop.price_starts_at || prop.daily_rate || 'No price'}`);
      console.log(`   Rating: ${prop.property_rating || 'No rating'}`);
      console.log(`   Hospitable ID: ${prop.hospitable_id || 'No Hospitable ID'}`);
      console.log('');
    });

    // Search for Berkshires Retreat specifically
    console.log('🔍 Searching for Berkshires Retreat...');
    const berkshiresProperties = properties.filter(prop => 
      (prop.name && prop.name.toLowerCase().includes('berkshire')) ||
      (prop.name && prop.name.toLowerCase().includes('retreat')) ||
      (prop.name && prop.name.toLowerCase().includes('mountain')) ||
      (prop.city && prop.city.toLowerCase().includes('berkshire')) ||
      (prop.city && prop.city.toLowerCase().includes('mountain'))
    );

    if (berkshiresProperties.length > 0) {
      console.log(`✅ Found ${berkshiresProperties.length} potential Berkshires Retreat properties:`);
      berkshiresProperties.forEach((prop, index) => {
        console.log(`   ${index + 1}. ${prop.name} (ID: ${prop.whalesync_postgres_id})`);
        console.log(`       City: ${prop.city}, State: ${prop.location_state || prop.state_code}`);
        console.log(`       Hospitable ID: ${prop.hospitable_id || 'None'}`);
        console.log(`       Price: ${prop.price_starts_at || prop.daily_rate || 'No price'}`);
        console.log('');
      });

      // Use the first match for photo pulling
      const berkshiresProperty = berkshiresProperties[0];
      console.log(`📸 Will pull photos for: ${berkshiresProperty.name}`);
      
      if (berkshiresProperty.hospitable_id) {
        console.log(`🔗 Hospitable ID: ${berkshiresProperty.hospitable_id}`);
        return berkshiresProperty;
      } else {
        console.log('⚠️  No Hospitable ID found for this property.');
      }
    } else {
      console.log('⚠️  No Berkshires Retreat found in App-Properties.');
      console.log('\n🔍 Let me search for properties with "retreat" or "mountain" in the name...');
      
      const retreatProperties = properties.filter(prop => 
        prop.name && (
          prop.name.toLowerCase().includes('retreat') ||
          prop.name.toLowerCase().includes('mountain') ||
          prop.name.toLowerCase().includes('cabin') ||
          prop.name.toLowerCase().includes('lodge')
        )
      );

      if (retreatProperties.length > 0) {
        console.log(`📋 Found ${retreatProperties.length} retreat/mountain properties:`);
        retreatProperties.forEach((prop, index) => {
          console.log(`   ${index + 1}. ${prop.name} (ID: ${prop.whalesync_postgres_id})`);
          console.log(`       City: ${prop.city}, State: ${prop.location_state || prop.state_code}`);
          console.log(`       Hospitable ID: ${prop.hospitable_id || 'None'}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error searching App-Properties:', error);
  }
}

findBerkshiresInAppProperties();
