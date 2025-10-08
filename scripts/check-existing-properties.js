require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkExistingProperties() {
  console.log('🔍 Checking existing properties in database...\n');

  try {
    // Get all properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .limit(20);

    if (error) {
      console.error('❌ Error fetching properties:', error);
      return;
    }

    console.log(`📊 Found ${properties.length} properties in database\n`);

    // Display all properties
    properties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.title || prop.name || 'No title'}`);
      console.log(`   ID: ${prop.id}`);
      console.log(`   Location: ${prop.location || prop.city || 'No location'}`);
      console.log(`   Price: ${prop.price || prop.price_starts_at || 'No price'}`);
      console.log(`   Rating: ${prop.rating || prop.property_rating || 'No rating'}`);
      console.log(`   Created: ${prop.created_at || prop.created || 'Unknown'}`);
      console.log('');
    });

    // Search for Berkshires Retreat specifically
    console.log('🔍 Searching for Berkshires Retreat...');
    const berkshiresProperties = properties.filter(prop => 
      (prop.title && prop.title.toLowerCase().includes('berkshire')) ||
      (prop.title && prop.title.toLowerCase().includes('retreat')) ||
      (prop.name && prop.name.toLowerCase().includes('berkshire')) ||
      (prop.name && prop.name.toLowerCase().includes('retreat'))
    );

    if (berkshiresProperties.length > 0) {
      console.log(`✅ Found ${berkshiresProperties.length} Berkshires Retreat properties:`);
      berkshiresProperties.forEach((prop, index) => {
        console.log(`   ${index + 1}. ${prop.title || prop.name} (ID: ${prop.id})`);
      });
    } else {
      console.log('⚠️  No Berkshires Retreat found in existing properties.');
    }

  } catch (error) {
    console.error('❌ Error checking properties:', error);
  }
}

checkExistingProperties();
