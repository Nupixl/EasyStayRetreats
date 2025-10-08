/**
 * Direct script to pull properties from Hospitable API
 * This script demonstrates how to use the Hospitable client directly
 */

require('dotenv').config({ path: '.env.local' });

const HospitableClient = require('../mcp/hospitable/client');

async function pullHospitableProperties() {
  console.log('🏠 Pulling Properties from Hospitable API\n');

  try {
    // Check for required environment variables
    if (!process.env.HOSPITABLE_API_KEY) {
      console.error('❌ HOSPITABLE_API_KEY is required');
      console.error('Please add HOSPITABLE_API_KEY to your .env.local file');
      return;
    }

    console.log('✅ Environment variables configured\n');

    // Initialize Hospitable client
    const hospitableClient = new HospitableClient(
      process.env.HOSPITABLE_API_KEY,
      process.env.HOSPITABLE_API_URL || 'https://public.api.hospitable.com/v2'
    );

    // Test connection first
    console.log('🔍 Testing connection to Hospitable API...');
    const connectionTest = await hospitableClient.testConnection();
    
    if (!connectionTest.success) {
      console.error('❌ Failed to connect to Hospitable API:', connectionTest.message);
      console.error('\nTroubleshooting:');
      console.error('1. Check your HOSPITABLE_API_KEY is correct');
      console.error('2. Verify your Hospitable account has API access');
      console.error('3. Check if your API key has the required permissions');
      return;
    }

    console.log('✅ Connection successful!\n');

    // Pull all properties
    console.log('📋 Pulling all properties from Hospitable...');
    const properties = await hospitableClient.getProperties();
    
    if (!properties || !properties.data) {
      console.error('❌ No properties data received from Hospitable API');
      return;
    }

    const propertyList = properties.data;
    console.log(`✅ Successfully retrieved ${propertyList.length} properties\n`);

    // Display properties summary
    console.log('📊 Properties Summary:');
    console.log('=' .repeat(60));
    
    propertyList.forEach((property, index) => {
      console.log(`\n${index + 1}. ${property.name || 'Untitled Property'}`);
      console.log(`   ID: ${property.id}`);
      console.log(`   Location: ${property.city || 'N/A'}, ${property.state || 'N/A'}`);
      console.log(`   Base Price: $${property.base_price || 'N/A'}`);
      console.log(`   Status: ${property.status || 'N/A'}`);
      console.log(`   Created: ${property.created_at || 'N/A'}`);
      
      if (property.description) {
        const shortDesc = property.description.substring(0, 100);
        console.log(`   Description: ${shortDesc}${property.description.length > 100 ? '...' : ''}`);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log(`\n📈 Total Properties: ${propertyList.length}`);

    // Show property details for first property
    if (propertyList.length > 0) {
      const firstProperty = propertyList[0];
      console.log('\n🔍 Detailed view of first property:');
      console.log('=' .repeat(60));
      
      try {
        const propertyDetails = await hospitableClient.getProperty(firstProperty.id);
        console.log(JSON.stringify(propertyDetails, null, 2));
      } catch (error) {
        console.error('❌ Failed to get property details:', error.message);
      }
    }

    console.log('\n🎉 Property pulling completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review the properties above');
    console.log('   2. Use the property IDs to sync to Supabase');
    console.log('   3. Set up pricing and calendar data');
    console.log('   4. Configure the MCP server for ongoing use');

  } catch (error) {
    console.error('❌ Error pulling properties:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your internet connection');
    console.error('2. Verify your Hospitable API key is valid');
    console.error('3. Check if Hospitable API is accessible');
    console.error('4. Review the error details above');
  }
}

// Run the script
if (require.main === module) {
  pullHospitableProperties();
}

module.exports = pullHospitableProperties;
