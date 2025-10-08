require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabaseStructure() {
  console.log('🔍 Checking database structure...\n');

  try {
    // Try different table names that might exist
    const tableNames = [
      'properties',
      'App-Properties', 
      'app-properties',
      'app_properties',
      'property_images',
      'hosts',
      'app_hosts'
    ];

    for (const tableName of tableNames) {
      console.log(`📋 Checking table: ${tableName}`);
      
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(1);

        if (error) {
          console.log(`   ❌ Error: ${error.message}`);
        } else {
          console.log(`   ✅ Found ${count || 0} records`);
          if (data && data.length > 0) {
            console.log(`   📊 Sample record keys: ${Object.keys(data[0]).join(', ')}`);
          }
        }
      } catch (err) {
        console.log(`   ❌ Exception: ${err.message}`);
      }
      console.log('');
    }

    // Check if we can get table information
    console.log('🔍 Trying to get table information...');
    try {
      const { data, error } = await supabase
        .rpc('get_schema_info');
      
      if (error) {
        console.log('⚠️  Could not get schema info:', error.message);
      } else {
        console.log('✅ Schema info:', data);
      }
    } catch (err) {
      console.log('⚠️  Could not get schema info:', err.message);
    }

  } catch (error) {
    console.error('❌ Error checking database structure:', error);
  }
}

checkDatabaseStructure();
