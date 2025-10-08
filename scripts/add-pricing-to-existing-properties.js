require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPricingSchema() {
  console.log('🔧 Adding pricing schema to existing database...\n');

  try {
    // First, let's check if the pricing tables already exist
    console.log('1. Checking existing tables...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_names');

    if (tablesError) {
      console.log('⚠️  Could not check existing tables, proceeding with schema creation...');
    } else {
      console.log('📋 Existing tables:', tables);
    }

    // Add pricing-related columns to the existing properties table
    console.log('\n2. Adding pricing columns to properties table...');
    
    const pricingColumns = [
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS hospitable_property_id TEXT;',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2);',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS min_price DECIMAL(10,2);',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS max_price DECIMAL(10,2);',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT \'USD\';',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS pricing_strategy TEXT DEFAULT \'static\';',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS weekend_multiplier DECIMAL(3,2) DEFAULT 1.0;',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS min_nights INTEGER DEFAULT 1;',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS cleaning_fee DECIMAL(10,2) DEFAULT 0;',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS service_fee_percent DECIMAL(5,2) DEFAULT 0;',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS pet_fee DECIMAL(10,2) DEFAULT 0;',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS extra_guest_fee DECIMAL(10,2) DEFAULT 0;',
      'ALTER TABLE properties ADD COLUMN IF NOT EXISTS extra_guest_threshold INTEGER DEFAULT 0;'
    ];

    for (const column of pricingColumns) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: column });
        if (error) {
          console.log(`⚠️  Column might already exist: ${error.message}`);
        } else {
          console.log(`✅ Added column: ${column.split(' ')[5]}`);
        }
      } catch (err) {
        console.log(`⚠️  Column might already exist: ${err.message}`);
      }
    }

    // Create the detailed pricing tables
    console.log('\n3. Creating detailed pricing tables...');
    
    const createTablesSQL = `
      -- Property Pricing Configuration table
      CREATE TABLE IF NOT EXISTS property_pricing_config (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
        base_price DECIMAL(10,2) NOT NULL,
        min_price DECIMAL(10,2),
        max_price DECIMAL(10,2),
        currency TEXT DEFAULT 'USD',
        pricing_strategy TEXT DEFAULT 'static',
        weekend_multiplier DECIMAL(3,2) DEFAULT 1.0,
        min_nights INTEGER DEFAULT 1,
        hospitable_property_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Daily Pricing table
      CREATE TABLE IF NOT EXISTS daily_pricing (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        availability_status TEXT DEFAULT 'available',
        reason TEXT,
        synced_from_hospitable BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(property_id, date)
      );

      -- Booking Fees table
      CREATE TABLE IF NOT EXISTS booking_fees (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
        cleaning_fee DECIMAL(10,2) DEFAULT 0,
        service_fee_percent DECIMAL(5,2) DEFAULT 0,
        pet_fee DECIMAL(10,2) DEFAULT 0,
        extra_guest_fee DECIMAL(10,2) DEFAULT 0,
        extra_guest_threshold INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Seasonal Pricing Rules table
      CREATE TABLE IF NOT EXISTS seasonal_pricing_rules (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
        rule_name TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        price_multiplier DECIMAL(3,2) DEFAULT 1.0,
        fixed_price DECIMAL(10,2),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Property Availability table
      CREATE TABLE IF NOT EXISTS property_availability (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status TEXT NOT NULL,
        min_nights INTEGER DEFAULT 1,
        check_in_allowed BOOLEAN DEFAULT TRUE,
        check_out_allowed BOOLEAN DEFAULT TRUE,
        synced_from_hospitable BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(property_id, date)
      );
    `;

    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    if (createError) {
      console.log('⚠️  Some tables might already exist:', createError.message);
    } else {
      console.log('✅ Created pricing tables');
    }

    // Create indexes
    console.log('\n4. Creating indexes...');
    const indexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_property_pricing_config_property_id ON property_pricing_config(property_id);
      CREATE INDEX IF NOT EXISTS idx_daily_pricing_property_id ON daily_pricing(property_id);
      CREATE INDEX IF NOT EXISTS idx_daily_pricing_date ON daily_pricing(date);
      CREATE INDEX IF NOT EXISTS idx_booking_fees_property_id ON booking_fees(property_id);
      CREATE INDEX IF NOT EXISTS idx_seasonal_pricing_rules_property_id ON seasonal_pricing_rules(property_id);
      CREATE INDEX IF NOT EXISTS idx_seasonal_pricing_rules_dates ON seasonal_pricing_rules(start_date, end_date);
      CREATE INDEX IF NOT EXISTS idx_property_availability_property_id ON property_availability(property_id);
      CREATE INDEX IF NOT EXISTS idx_property_availability_date ON property_availability(date);
    `;

    const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexesSQL });
    if (indexError) {
      console.log('⚠️  Some indexes might already exist:', indexError.message);
    } else {
      console.log('✅ Created indexes');
    }

    // Enable RLS and create policies
    console.log('\n5. Setting up RLS policies...');
    const rlsSQL = `
      ALTER TABLE property_pricing_config ENABLE ROW LEVEL SECURITY;
      ALTER TABLE daily_pricing ENABLE ROW LEVEL SECURITY;
      ALTER TABLE booking_fees ENABLE ROW LEVEL SECURITY;
      ALTER TABLE seasonal_pricing_rules ENABLE ROW LEVEL SECURITY;
      ALTER TABLE property_availability ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Public read access for property_pricing_config" ON property_pricing_config;
      DROP POLICY IF EXISTS "Public read access for daily_pricing" ON daily_pricing;
      DROP POLICY IF EXISTS "Public read access for booking_fees" ON booking_fees;
      DROP POLICY IF EXISTS "Public read access for seasonal_pricing_rules" ON seasonal_pricing_rules;
      DROP POLICY IF EXISTS "Public read access for property_availability" ON property_availability;

      CREATE POLICY "Public read access for property_pricing_config" ON property_pricing_config FOR SELECT USING (true);
      CREATE POLICY "Public read access for daily_pricing" ON daily_pricing FOR SELECT USING (true);
      CREATE POLICY "Public read access for booking_fees" ON booking_fees FOR SELECT USING (true);
      CREATE POLICY "Public read access for seasonal_pricing_rules" ON seasonal_pricing_rules FOR SELECT USING (true);
      CREATE POLICY "Public read access for property_availability" ON property_availability FOR SELECT USING (true);
    `;

    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSQL });
    if (rlsError) {
      console.log('⚠️  RLS setup error:', rlsError.message);
    } else {
      console.log('✅ RLS policies created');
    }

    console.log('\n✅ Pricing schema addition completed!');
    
    // Test the new schema
    console.log('\n6. Testing new schema...');
    const { data: properties, error: testError } = await supabase
      .from('properties')
      .select('id, title, base_price, hospitable_property_id')
      .limit(3);

    if (testError) {
      console.log('❌ Error testing schema:', testError.message);
    } else {
      console.log('✅ Schema test successful! Found', properties.length, 'properties');
      if (properties.length > 0) {
        console.log('📋 Sample property with new fields:', properties[0]);
      }
    }

  } catch (error) {
    console.error('❌ Error adding pricing schema:', error);
  }
}

addPricingSchema();
