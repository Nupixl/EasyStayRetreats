/**
 * Test script to check availability using Hospitable MCP
 * Fetches availability from Hospitable API and syncs to Supabase property_availability table
 */

require('dotenv').config({ path: '.env.local' });

const HospitableClient = require('../mcp/hospitable/client');
const HospitableSync = require('../mcp/hospitable/sync');
const PropertyTools = require('../mcp/hospitable/tools/properties');
const CalendarTools = require('../mcp/hospitable/tools/calendar');

async function testCalendarAvailability() {
  console.log('📅 Testing Hospitable MCP Calendar Availability\n');

  try {
    // Check environment variables
    const requiredEnvVars = [
      'HOSPITABLE_API_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      console.error('\nPlease add these to your .env.local file');
      return;
    }

    console.log('✅ Environment variables configured\n');

    // Initialize Hospitable client
    console.log('🔌 Initializing Hospitable API client...');
    const hospitableClient = new HospitableClient(
      process.env.HOSPITABLE_API_KEY,
      process.env.HOSPITABLE_API_URL || 'https://api.hospitable.com/v1'
    );

    // Test connection
    console.log('🔍 Testing Hospitable API connection...');
    const connectionTest = await hospitableClient.testConnection();
    if (!connectionTest.success) {
      console.error('❌ Failed to connect to Hospitable API:', connectionTest.message);
      return;
    }
    console.log('✅ Hospitable API connection successful\n');

    // Initialize sync module and tools
    const syncModule = new HospitableSync(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.HOSPITABLE_API_KEY
    );

    const propertyTools = new PropertyTools(hospitableClient, syncModule);
    const calendarTools = new CalendarTools(hospitableClient, syncModule);

    // Step 1: List properties to get a property ID
    console.log('📋 Step 1: Listing properties from Hospitable...');
    const listResult = await propertyTools.listProperties();
    
    if (!listResult.success) {
      console.error('❌ Failed to list properties:', listResult.error);
      return;
    }

    const properties = listResult.data?.data || [];
    if (properties.length === 0) {
      console.error('❌ No properties found in Hospitable');
      return;
    }

    console.log(`✅ Found ${properties.length} properties`);
    const firstProperty = properties[0];
    console.log(`🏠 Using property: ${firstProperty.name || 'Untitled'} (ID: ${firstProperty.id})\n`);

    // Step 2: Set up date range (next 30 days)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    console.log(`📅 Step 2: Fetching availability for ${startDateStr} to ${endDateStr}...`);

    // Step 3: Get calendar availability from Hospitable
    console.log('🔍 Fetching calendar data from Hospitable API...');
    const calendarResult = await calendarTools.getCalendar(
      firstProperty.id,
      startDateStr,
      endDateStr
    );

    if (!calendarResult.success) {
      console.error('❌ Failed to get calendar:', calendarResult.error);
      return;
    }

    const calendarData = calendarResult.data;
    console.log('✅ Successfully fetched calendar data from Hospitable');
    
    // Display availability data
    console.log('📊 Full calendar response structure:');
    console.log(JSON.stringify(calendarData, null, 2));
    
    if (calendarData.availability && calendarData.availability.length > 0) {
      console.log(`📊 Found ${calendarData.availability.length} availability records`);
      console.log('\n📅 Sample availability data:');
      
      // Show first 5 days
      calendarData.availability.slice(0, 5).forEach((day, index) => {
        console.log(`   ${index + 1}. ${day.date}: ${day.status} (min_nights: ${day.min_nights || 1})`);
        console.log(`      Check-in: ${day.check_in_allowed !== false ? '✅' : '❌'}, Check-out: ${day.check_out_allowed !== false ? '✅' : '❌'}`);
      });
      
      if (calendarData.availability.length > 5) {
        console.log(`   ... and ${calendarData.availability.length - 5} more days`);
      }
    } else {
      console.log('⚠️  No availability data found in calendar response');
      console.log('📊 Calendar response keys:', Object.keys(calendarData));
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Check what properties exist in Supabase
    console.log('🔍 Checking Supabase properties...');
    const { data: supabaseProperties, error: supabasePropsError } = await syncModule.supabase
      .from('properties')
      .select('id, title, hospitable_property_id')
      .eq('hospitable_property_id', firstProperty.id);

    if (supabasePropsError) {
      console.error('❌ Failed to check Supabase properties:', supabasePropsError);
    } else {
      console.log(`📊 Found ${supabaseProperties?.length || 0} matching properties in Supabase`);
      if (supabaseProperties && supabaseProperties.length > 0) {
        console.log('   Property mapping:', supabaseProperties[0]);
      }
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Step 4: Sync calendar to Supabase
    console.log('🔄 Step 3: Syncing calendar to Supabase...');
    const syncResult = await calendarTools.syncPropertyCalendar(
      firstProperty.id,
      startDateStr,
      endDateStr
    );

    if (!syncResult.success) {
      console.error('❌ Failed to sync calendar:', syncResult.error);
      return;
    }

    console.log('✅ Successfully synced calendar to Supabase');
    console.log(`   Property ID in Supabase: ${syncResult.data.property_id}`);

    // Step 5: Verify sync by checking Supabase
    console.log('\n🔍 Step 4: Verifying sync in Supabase...');
    const { data: supabaseAvailability, error: supabaseError } = await syncModule.supabase
      .from('property_availability')
      .select('date, status, min_nights, check_in_allowed, check_out_allowed, synced_from_hospitable')
      .eq('property_id', syncResult.data.property_id)
      .gte('date', startDateStr)
      .lte('date', endDateStr)
      .order('date')
      .limit(10);

    if (supabaseError) {
      console.error('❌ Failed to verify sync in Supabase:', supabaseError);
    } else {
      console.log(`✅ Found ${supabaseAvailability?.length || 0} records in Supabase property_availability table`);
      
      if (supabaseAvailability && supabaseAvailability.length > 0) {
        console.log('\n📊 Sample Supabase data:');
        supabaseAvailability.slice(0, 3).forEach((record, index) => {
          console.log(`   ${index + 1}. ${record.date}: ${record.status} (min_nights: ${record.min_nights})`);
          console.log(`      Synced from Hospitable: ${record.synced_from_hospitable ? '✅' : '❌'}`);
        });
      }
    }

    console.log('\n🎉 Calendar availability test completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   • Fetched ${calendarData.availability?.length || 0} availability records from Hospitable`);
    console.log(`   • Synced to Supabase property_availability table`);
    console.log(`   • Property ID: ${firstProperty.id} → ${syncResult.data.property_id}`);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testCalendarAvailability();
}

module.exports = testCalendarAvailability;
