require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPricingFieldsToAppProperties() {
  console.log('🔧 Adding pricing fields to App-Properties table...\n');

  try {
    // First, let's see what fields already exist
    console.log('1. Checking existing fields in App-Properties...');
    const { data: sampleProperty, error: sampleError } = await supabase
      .from('App-Properties')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('❌ Error fetching sample property:', sampleError);
      return;
    }

    if (sampleProperty && sampleProperty.length > 0) {
      console.log('📋 Existing fields in App-Properties:');
      const fields = Object.keys(sampleProperty[0]);
      fields.forEach((field, index) => {
        console.log(`   ${index + 1}. ${field}`);
      });

      // Check if pricing fields already exist
      const pricingFields = [
        'base_price',
        'min_price', 
        'max_price',
        'currency',
        'pricing_strategy',
        'weekend_multiplier',
        'min_nights',
        'cleaning_fee',
        'service_fee_percent',
        'pet_fee',
        'extra_guest_fee',
        'extra_guest_threshold'
      ];

      console.log('\n🔍 Checking for existing pricing fields...');
      const existingPricingFields = pricingFields.filter(field => fields.includes(field));
      
      if (existingPricingFields.length > 0) {
        console.log('✅ Found existing pricing fields:');
        existingPricingFields.forEach(field => {
          console.log(`   - ${field}`);
        });
      } else {
        console.log('⚠️  No pricing fields found. They may need to be added manually.');
      }

      // Check for any existing pricing-related fields
      const relatedFields = fields.filter(field => 
        field.includes('price') || 
        field.includes('fee') || 
        field.includes('rate') ||
        field.includes('cost')
      );

      if (relatedFields.length > 0) {
        console.log('\n💰 Found existing pricing-related fields:');
        relatedFields.forEach(field => {
          console.log(`   - ${field}: ${sampleProperty[0][field] || 'null'}`);
        });
      }

      // Show the Berkshires Retreat property specifically
      console.log('\n🏠 Berkshires Retreat property details:');
      const berkshiresProperty = sampleProperty[0];
      console.log(`   Name: ${berkshiresProperty.name}`);
      console.log(`   City: ${berkshiresProperty.city}`);
      console.log(`   Price starts at: ${berkshiresProperty.price_starts_at || 'Not set'}`);
      console.log(`   Daily rate: ${berkshiresProperty.daily_rate || 'Not set'}`);
      console.log(`   Cleaning fee: ${berkshiresProperty.cleaning_fee || 'Not set'}`);
      console.log(`   Service fee: ${berkshiresProperty.service_fee_percentage || 'Not set'}`);
      console.log(`   Hospitable ID: ${berkshiresProperty.hospitable_id || 'Not set'}`);

    } else {
      console.log('⚠️  No properties found in App-Properties table');
    }

    // Try to update a property with pricing information
    console.log('\n2. Attempting to update Berkshires Retreat with pricing info...');
    
    const berkshiresId = 'b8c9aa25-cb16-418a-be74-2593268990ea';
    
    // Try to add some pricing fields if they don't exist
    const updateData = {
      // Add some sample pricing data
      price_starts_at: 250.00,
      daily_rate: 300.00,
      cleaning_fee: 75.00,
      service_fee_percentage: 12.5,
      hospitable_id: 'a00926c9-0136-43a1-b3d1-7a878af9a2ab'
    };

    const { data: updateResult, error: updateError } = await supabase
      .from('App-Properties')
      .update(updateData)
      .eq('whalesync_postgres_id', berkshiresId)
      .select();

    if (updateError) {
      console.log('⚠️  Error updating property:', updateError.message);
    } else {
      console.log('✅ Successfully updated Berkshires Retreat with pricing info');
      console.log('📊 Updated data:', updateResult);
    }

    // Create the detailed pricing tables
    console.log('\n3. Creating detailed pricing tables...');
    
    // These tables will be created separately since we can't use exec_sql
    console.log('📋 Pricing tables to create:');
    console.log('   - property_pricing_config');
    console.log('   - daily_pricing'); 
    console.log('   - booking_fees');
    console.log('   - seasonal_pricing_rules');
    console.log('   - property_availability');
    
    console.log('\n💡 Note: These tables need to be created manually in Supabase dashboard');
    console.log('   or using the SQL editor with the schema from scripts/add-pricing-schema.sql');

  } catch (error) {
    console.error('❌ Error adding pricing fields:', error);
  }
}

addPricingFieldsToAppProperties();
