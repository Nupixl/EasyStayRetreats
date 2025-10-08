require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyPricingSchema() {
  console.log('🏗️  Applying Hospitable MCP pricing schema to Supabase...\n');

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'add-pricing-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Schema SQL loaded from add-pricing-schema.sql');
    console.log(`📏 Schema size: ${schemaSQL.length} characters`);

    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.length === 0) {
        continue;
      }

      try {
        console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}...`);
        
        // Use rpc to execute SQL (if available) or direct query
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // If rpc doesn't work, try alternative approach
          console.log(`⚠️  RPC failed, trying alternative approach...`);
          
          // For now, we'll just log the statement and continue
          // In a real implementation, you'd need to use the Supabase SQL editor
          // or a database migration tool
          console.log(`📝 Statement to execute manually:`);
          console.log(`   ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
          
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Error executing statement ${i + 1}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 Schema Application Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📋 Total statements: ${statements.length}`);

    if (errorCount > 0) {
      console.log('\n⚠️  Some statements failed. You may need to:');
      console.log('1. Execute the SQL manually in Supabase SQL Editor');
      console.log('2. Use a database migration tool');
      console.log('3. Check the Supabase dashboard for any permission issues');
      
      console.log('\n📋 Manual execution steps:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of scripts/add-pricing-schema.sql');
      console.log('4. Execute the SQL');
    }

    // Test if tables were created by checking if we can query them
    console.log('\n🧪 Testing if pricing tables exist...');
    
    const tablesToTest = [
      'property_pricing_config',
      'daily_pricing', 
      'booking_fees',
      'seasonal_pricing_rules',
      'property_availability',
      'property_pricing_history'
    ];

    for (const tableName of tablesToTest) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ Table ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ Table ${tableName}: Exists and accessible`);
        }
      } catch (err) {
        console.log(`❌ Table ${tableName}: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error applying schema:', error);
  }
}

applyPricingSchema();
