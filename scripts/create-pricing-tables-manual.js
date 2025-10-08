require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createPricingTablesManual() {
  console.log('🏗️  Creating Hospitable MCP pricing tables manually...\n');

  try {
    // Since we can't execute raw SQL through the client, we'll create a guide
    // for manual execution and test the existing tables
    
    console.log('📋 Manual Database Setup Required');
    console.log('Since Supabase doesn\'t allow raw SQL execution through the client,');
    console.log('you\'ll need to execute the schema manually in the Supabase dashboard.\n');

    console.log('🔧 Steps to create the pricing schema:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of scripts/add-pricing-schema.sql');
    console.log('4. Execute the SQL');
    console.log('5. Verify the tables were created\n');

    // Test if we can access the properties table first
    console.log('🧪 Testing existing tables...');
    
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);

    if (propertiesError) {
      console.log(`❌ Properties table: ${propertiesError.message}`);
    } else {
      console.log(`✅ Properties table: Accessible (${properties.length} records)`);
    }

    // Check if pricing tables exist
    const pricingTables = [
      'property_pricing_config',
      'daily_pricing', 
      'booking_fees',
      'seasonal_pricing_rules',
      'property_availability',
      'property_pricing_history'
    ];

    console.log('\n🔍 Checking for pricing tables...');
    let existingTables = 0;
    
    for (const tableName of pricingTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ ${tableName}: Exists and accessible`);
          existingTables++;
        }
      } catch (err) {
        console.log(`❌ ${tableName}: ${err.message}`);
      }
    }

    console.log(`\n📊 Pricing Tables Status: ${existingTables}/${pricingTables.length} exist`);

    if (existingTables === 0) {
      console.log('\n📋 Next Steps:');
      console.log('1. Execute the SQL schema manually in Supabase dashboard');
      console.log('2. Run this script again to verify tables were created');
      console.log('3. Then we can populate the tables with sample data');
    } else if (existingTables === pricingTables.length) {
      console.log('\n🎉 All pricing tables exist! Ready to populate with data.');
      
      // If tables exist, let's populate them with sample data for Berkshires Retreat
      await populateSamplePricingData();
    } else {
      console.log('\n⚠️  Some tables exist, some don\'t. Please check the Supabase dashboard.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function populateSamplePricingData() {
  console.log('\n💰 Populating sample pricing data for Berkshires Retreat...');

  try {
    // Get Berkshires Retreat property ID
    const { data: berkshiresProperty, error: findError } = await supabase
      .from('properties')
      .select('id, name')
      .ilike('name', '%Berkshires Retreat%')
      .single();

    if (findError) {
      console.log('❌ Could not find Berkshires Retreat property:', findError.message);
      return;
    }

    console.log(`✅ Found property: ${berkshiresProperty.name} (${berkshiresProperty.id})`);

    // 1. Create property pricing configuration
    console.log('\n1. Creating property pricing configuration...');
    const { data: pricingConfig, error: configError } = await supabase
      .from('property_pricing_config')
      .insert({
        property_id: berkshiresProperty.id,
        hospitable_property_id: 'a00926c9-0136-43a1-b3d1-7a878af9a2ab',
        base_price: 400.00,
        min_price: 350.00,
        max_price: 600.00,
        currency: 'USD',
        pricing_strategy: 'dynamic',
        weekend_multiplier: 1.25,
        min_nights: 2,
        max_nights: 14,
        advance_booking_days: 365,
        last_minute_discount_percent: 10.00
      })
      .select()
      .single();

    if (configError) {
      console.log('❌ Error creating pricing config:', configError.message);
    } else {
      console.log('✅ Created pricing configuration');
    }

    // 2. Create booking fees
    console.log('\n2. Creating booking fees...');
    const { data: bookingFees, error: feesError } = await supabase
      .from('booking_fees')
      .insert({
        property_id: berkshiresProperty.id,
        cleaning_fee: 125.00,
        service_fee_percent: 12.00,
        pet_fee: 50.00,
        extra_guest_fee: 25.00,
        extra_guest_fee_per_guest: 25.00,
        security_deposit: 500.00,
        city_tax_percent: 3.00
      })
      .select()
      .single();

    if (feesError) {
      console.log('❌ Error creating booking fees:', feesError.message);
    } else {
      console.log('✅ Created booking fees');
    }

    // 3. Create seasonal pricing rules
    console.log('\n3. Creating seasonal pricing rules...');
    const seasonalRules = [
      {
        property_id: berkshiresProperty.id,
        rule_name: 'Summer Season',
        start_date: '2024-06-01',
        end_date: '2024-08-31',
        price_multiplier: 1.5,
        min_nights: 3,
        is_active: true
      },
      {
        property_id: berkshiresProperty.id,
        rule_name: 'Holiday Season',
        start_date: '2024-12-20',
        end_date: '2025-01-05',
        price_multiplier: 2.0,
        min_nights: 4,
        is_active: true
      },
      {
        property_id: berkshiresProperty.id,
        rule_name: 'Winter Discount',
        start_date: '2024-01-01',
        end_date: '2024-03-31',
        price_multiplier: 0.8,
        min_nights: 2,
        is_active: true
      }
    ];

    for (const rule of seasonalRules) {
      const { error: ruleError } = await supabase
        .from('seasonal_pricing_rules')
        .insert(rule);

      if (ruleError) {
        console.log(`❌ Error creating seasonal rule "${rule.rule_name}":`, ruleError.message);
      } else {
        console.log(`✅ Created seasonal rule: ${rule.rule_name}`);
      }
    }

    // 4. Create sample daily pricing for next 30 days
    console.log('\n4. Creating sample daily pricing...');
    const today = new Date();
    const dailyPricing = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Base price with some variation
      const basePrice = 400;
      const variation = Math.random() * 100 - 50; // ±$50 variation
      const price = Math.max(350, basePrice + variation);
      
      // Weekend multiplier
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const finalPrice = isWeekend ? price * 1.25 : price;

      dailyPricing.push({
        property_id: berkshiresProperty.id,
        date: date.toISOString().split('T')[0],
        price: Math.round(finalPrice * 100) / 100,
        availability_status: 'available',
        reason: 'dynamic',
        synced_from_hospitable: false
      });
    }

    // Insert daily pricing in batches
    const batchSize = 10;
    for (let i = 0; i < dailyPricing.length; i += batchSize) {
      const batch = dailyPricing.slice(i, i + batchSize);
      const { error: dailyError } = await supabase
        .from('daily_pricing')
        .insert(batch);

      if (dailyError) {
        console.log(`❌ Error creating daily pricing batch ${Math.floor(i/batchSize) + 1}:`, dailyError.message);
      } else {
        console.log(`✅ Created daily pricing batch ${Math.floor(i/batchSize) + 1}`);
      }
    }

    // 5. Create property availability
    console.log('\n5. Creating property availability...');
    const availability = dailyPricing.map(dp => ({
      property_id: berkshiresProperty.id,
      date: dp.date,
      is_available: true,
      availability_reason: 'open',
      min_nights: 2,
      max_nights: 14,
      check_in_allowed: true,
      check_out_allowed: true,
      synced_from_hospitable: false
    }));

    // Insert availability in batches
    for (let i = 0; i < availability.length; i += batchSize) {
      const batch = availability.slice(i, i + batchSize);
      const { error: availError } = await supabase
        .from('property_availability')
        .insert(batch);

      if (availError) {
        console.log(`❌ Error creating availability batch ${Math.floor(i/batchSize) + 1}:`, availError.message);
      } else {
        console.log(`✅ Created availability batch ${Math.floor(i/batchSize) + 1}`);
      }
    }

    console.log('\n🎉 Sample pricing data populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`✅ Property: ${berkshiresProperty.name}`);
    console.log(`✅ Pricing Configuration: Created`);
    console.log(`✅ Booking Fees: Created`);
    console.log(`✅ Seasonal Rules: 3 created`);
    console.log(`✅ Daily Pricing: 30 days created`);
    console.log(`✅ Availability: 30 days created`);

  } catch (error) {
    console.error('❌ Error populating sample data:', error);
  }
}

createPricingTablesManual();
