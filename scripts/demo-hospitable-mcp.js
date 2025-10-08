/**
 * Demo script showing how to use the Hospitable MCP Server
 * This demonstrates the MCP server functionality without requiring actual API keys
 */

const HospitableClient = require('../mcp/hospitable/client');
const HospitableSync = require('../mcp/hospitable/sync');
const PropertyTools = require('../mcp/hospitable/tools/properties');
const PricingTools = require('../mcp/hospitable/tools/pricing');
const CalendarTools = require('../mcp/hospitable/tools/calendar');

async function demoHospitableMCP() {
  console.log('🏠 Hospitable MCP Server Demo\n');
  console.log('This demo shows how the MCP server works once configured.\n');

  // Simulate environment variables
  const mockEnv = {
    HOSPITABLE_API_KEY: 'demo_api_key',
    HOSPITABLE_API_URL: 'https://api.hospitable.com/v1',
    NEXT_PUBLIC_SUPABASE_URL: 'https://demo.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'demo_service_key'
  };

  console.log('📋 Available MCP Tools:\n');

  // 1. Property Management Tools
  console.log('🏠 Property Management Tools:');
  console.log('   • get_property - Get property by Hospitable ID');
  console.log('   • list_properties - List all properties from Hospitable');
  console.log('   • sync_property - Sync property from Hospitable to Supabase');
  console.log('   • get_property_sync_status - Check sync status\n');

  // 2. Pricing Tools
  console.log('💰 Pricing Management Tools:');
  console.log('   • get_property_pricing - Get pricing for date range');
  console.log('   • sync_property_pricing - Sync pricing from Hospitable');
  console.log('   • get_pricing_suggestions - Get dynamic pricing suggestions\n');

  // 3. Calendar Tools
  console.log('📅 Calendar Management Tools:');
  console.log('   • get_calendar - Get availability calendar');
  console.log('   • sync_calendar - Sync calendar from Hospitable');
  console.log('   • update_calendar - Update availability in Hospitable\n');

  // 4. Reservation Tools
  console.log('📝 Reservation Management Tools:');
  console.log('   • get_reservations - Get reservations for property');
  console.log('   • get_reservation - Get specific reservation by ID');
  console.log('   • update_reservation - Update reservation details\n');

  console.log('=' .repeat(60));
  console.log('🔧 MCP Server Usage Examples:\n');

  // Example 1: List Properties
  console.log('Example 1: List all properties from Hospitable');
  console.log('```json');
  console.log('{');
  console.log('  "name": "list_properties",');
  console.log('  "arguments": {}');
  console.log('}');
  console.log('```\n');

  // Example 2: Get Property Pricing
  console.log('Example 2: Get pricing for a property');
  console.log('```json');
  console.log('{');
  console.log('  "name": "get_property_pricing",');
  console.log('  "arguments": {');
  console.log('    "propertyId": "hospitable_property_123",');
  console.log('    "startDate": "2024-01-15",');
  console.log('    "endDate": "2024-01-22"');
  console.log('  }');
  console.log('}');
  console.log('```\n');

  // Example 3: Sync Property
  console.log('Example 3: Sync property to Supabase');
  console.log('```json');
  console.log('{');
  console.log('  "name": "sync_property",');
  console.log('  "arguments": {');
  console.log('    "propertyId": "hospitable_property_123"');
  console.log('  }');
  console.log('}');
  console.log('```\n');

  console.log('=' .repeat(60));
  console.log('🌐 API Endpoints Available:\n');

  console.log('1. Price Estimation:');
  console.log('   POST /api/pricing/estimate');
  console.log('   Body: { "propertyId": "uuid", "checkIn": "2024-01-15", "checkOut": "2024-01-22" }\n');

  console.log('2. Calendar Data:');
  console.log('   GET /api/pricing/calendar?propertyId=uuid&startDate=2024-01-01&endDate=2024-01-31\n');

  console.log('3. Manual Sync:');
  console.log('   POST /api/pricing/sync');
  console.log('   Body: { "startDate": "2024-01-01", "endDate": "2024-01-31", "syncType": "all" }\n');

  console.log('=' .repeat(60));
  console.log('🚀 Getting Started:\n');

  console.log('1. Get your Hospitable API key:');
  console.log('   • Go to https://app.hospitable.com');
  console.log('   • Navigate to Settings → API');
  console.log('   • Generate a new API key\n');

  console.log('2. Add to your .env.local file:');
  console.log('   HOSPITABLE_API_KEY=your_actual_api_key_here\n');

  console.log('3. Test the connection:');
  console.log('   node scripts/pull-hospitable-properties.js\n');

  console.log('4. Start the MCP server:');
  console.log('   node mcp/hospitable/server.js\n');

  console.log('5. Use with Claude Desktop:');
  console.log('   • Add the MCP server to your Claude Desktop configuration');
  console.log('   • Use natural language to interact with your properties\n');

  console.log('=' .repeat(60));
  console.log('📊 Database Schema Added:\n');

  console.log('The integration adds these new tables to Supabase:');
  console.log('• property_pricing_config - Base pricing configuration');
  console.log('• daily_pricing - Daily price variations');
  console.log('• booking_fees - Cleaning, service, and other fees');
  console.log('• seasonal_pricing_rules - Seasonal pricing multipliers');
  console.log('• property_availability - Calendar availability\n');

  console.log('🎉 Your Hospitable MCP Server is ready to use!');
  console.log('\nNext: Get your API key and start pulling properties!');
}

// Run the demo
if (require.main === module) {
  demoHospitableMCP();
}

module.exports = demoHospitableMCP;
