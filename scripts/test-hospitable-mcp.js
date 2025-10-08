/**
 * Test script for Hospitable MCP Server
 * Demonstrates how to pull properties using the MCP server
 */

require('dotenv').config({ path: '.env.local' });

const HospitableClient = require('../mcp/hospitable/client');
const HospitableSync = require('../mcp/hospitable/sync');
const PropertyTools = require('../mcp/hospitable/tools/properties');

async function testHospitableMCP() {
  console.log('🏠 Testing Hospitable MCP Server - Property Pulling\n');

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

    // Initialize property tools
    const syncModule = new HospitableSync(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.HOSPITABLE_API_KEY
    );

    const propertyTools = new PropertyTools(hospitableClient, syncModule);

    // Test 1: List all properties from Hospitable
    console.log('📋 Test 1: Listing all properties from Hospitable...');
    const listResult = await propertyTools.listProperties();
    
    if (listResult.success) {
      console.log('✅ Successfully retrieved properties from Hospitable');
      console.log(`📊 Found ${listResult.data?.data?.length || 0} properties`);
      
      // Show first few properties
      if (listResult.data?.data?.length > 0) {
        console.log('\n🏠 Sample properties:');
        listResult.data.data.slice(0, 3).forEach((property, index) => {
          console.log(`   ${index + 1}. ${property.name || 'Untitled'} (ID: ${property.id})`);
          console.log(`      Location: ${property.city}, ${property.state}`);
          console.log(`      Base Price: $${property.base_price || 'N/A'}`);
        });
      }
    } else {
      console.error('❌ Failed to list properties:', listResult.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Get specific property (if we have properties)
    if (listResult.success && listResult.data?.data?.length > 0) {
      const firstProperty = listResult.data.data[0];
      console.log(`🔍 Test 2: Getting specific property (${firstProperty.id})...`);
      
      const propertyResult = await propertyTools.getProperty(firstProperty.id);
      
      if (propertyResult.success) {
        console.log('✅ Successfully retrieved property details');
        const property = propertyResult.data;
        console.log(`   Name: ${property.name || 'Untitled'}`);
        console.log(`   Location: ${property.city}, ${property.state}`);
        console.log(`   Base Price: $${property.base_price || 'N/A'}`);
        console.log(`   Description: ${property.description?.substring(0, 100) || 'No description'}...`);
      } else {
        console.error('❌ Failed to get property:', propertyResult.error);
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Sync property to Supabase (if we have properties)
    if (listResult.success && listResult.data?.data?.length > 0) {
      const firstProperty = listResult.data.data[0];
      console.log(`🔄 Test 3: Syncing property to Supabase (${firstProperty.id})...`);
      
      const syncResult = await propertyTools.syncProperty(firstProperty.id);
      
      if (syncResult.success) {
        console.log('✅ Successfully synced property to Supabase');
        console.log(`   Property ID in Supabase: ${syncResult.data.property_id}`);
        console.log(`   Action: ${syncResult.data.created ? 'Created' : 'Updated'}`);
      } else {
        console.error('❌ Failed to sync property:', syncResult.error);
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Get sync status
    if (listResult.success && listResult.data?.data?.length > 0) {
      const firstProperty = listResult.data.data[0];
      console.log(`📊 Test 4: Checking sync status for property (${firstProperty.id})...`);
      
      const statusResult = await propertyTools.getPropertySyncStatus(firstProperty.id);
      
      if (statusResult.success) {
        console.log('✅ Successfully retrieved sync status');
        const status = statusResult.data;
        if (status) {
          console.log(`   Property: ${status.title}`);
          console.log(`   Hospitable ID: ${status.hospitable_property_id}`);
          console.log(`   Pricing Config: ${status.pricing_config ? 'Yes' : 'No'}`);
          console.log(`   Daily Pricing Records: ${status.daily_pricing_count}`);
          console.log(`   Availability Records: ${status.availability_count}`);
          console.log(`   Last Sync: ${status.last_sync || 'Never'}`);
        } else {
          console.log('   Property not found in Supabase');
        }
      } else {
        console.error('❌ Failed to get sync status:', statusResult.error);
      }
    }

    console.log('\n🎉 Hospitable MCP Server testing completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Install dependencies: npm install');
    console.log('   2. Apply database schema: Run scripts/add-pricing-schema.sql in Supabase');
    console.log('   3. Start MCP server: node mcp/hospitable/server.js');
    console.log('   4. Use with Claude Desktop or other MCP clients');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testHospitableMCP();
}

module.exports = testHospitableMCP;
