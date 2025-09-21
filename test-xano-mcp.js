/**
 * Test script for Xano Meta API MCP Server
 * 
 * This script tests the basic functionality of the Xano MCP server
 * by making sample API calls to verify connectivity and authentication.
 */

import { XanoAPIClient } from './lib/xano-mcp.js';

// Test configuration
const XANO_BASE_URL = 'https://xxsw-1d5c-nopq.n7d.xano.io/api:meta';
const XANO_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiJ9.eyJ4YW5vIjp7ImRibyI6Im1hc3Rlcjp1c2VyIiwiaWQiOjQyMjQ2LCJhY2Nlc3NfdG9rZW4iOnsia2V5aWQiOiJmNjNlMDQwNS1kMTNlLTQ5NWMtOWYzZC1hNWQzZDM5NDMwMzAiLCJzY29wZSI6eyJ0ZW5hbnRfY2VudGVyOmJhY2t1cCI6MCwidGVuYW50X2NlbnRlcjpkZXBsb3kiOjAsInRlbmFudF9jZW50ZXI6aW1wZXJzb25hdGUiOjAsInRlbmFudF9jZW50ZXI6bWV0YWRhdGE6YXBpIjowLCJ0ZW5hbnRfY2VudGVyOmxvZyI6MCwidGVuYW50X2NlbnRlcjpyYmFjIjowLCJ0ZW5hbnRfY2VudGVyOnNlY3JldHMiOjAsInRlbmFudF9jZW50ZXIiOjAsIndvcmtzcGFjZTphZGRvbiI6MTUsIndvcmtzcGFjZTphcGkiOjE1LCJ3b3Jrc3BhY2U6Y29udGVudCI6MTUsIndvcmtzcGFjZTpkYXRhYmFzZSI6MTUsIndvcmtzcGFjZTpkYXRhc291cmNlOmxpdmUiOjE1LCJ3b3Jrc3BhY2U6ZmlsZSI6MTUsIndvcmtzcGFjZTpmdW5jdGlvbiI6MTUsIndvcmtzcGFjZTpzZXJ2aWNlIjoxNSwid29ya3NwYWNlOmxvZyI6MTUsIndvcmtzcGFjZTptaWRkbGV3YXJlIjoxNSwid29ya3NwYWNlOnJlcXVlc3RoaXN0b3J5IjoxNSwid29ya3NwYWNlOnRhc2siOjE1LCJ3b3Jrc3BhY2U6dG9vbCI6MTV9fSwiZXhwaXJlc19hdCI6IjIwMjUtMDktMjMgMTQ6NTY6MTUrMDAwMCJ9LCJpYXQiOjE3NTgwMzQ1NzUsIm5iZiI6MTc1ODAzNDU3NSwiYXVkIjoieGFubzptZXRhIn0.YpD_plz0pH77mSHDIQzGCqDgfEWRh4ABBgOlR_DsEnQMevu4pi5sZpMDt7dnBAQphk6gd7kUvQPyrTvA1gQRfcaMgyLA5KRBWN-Kflmrb4TkJWM9Fj6_uYXZwGa0sJfxIFhXiy7NsXhEB8cZzOUsaFQSaPhE9fSKfT8xIHVbRuiERO5Qy95NsiZgf0EEMb-eoxlEhiFzfPngrXg8gw0tvAi1wAXiw7en-VcmGzMHRkl8BzldoSHoKu0biy8ZOtkGXEbG9r_AP6UWeaW_yNM4k453LfkbZUtxMnY90WxNokPaBWonisRYkrIPYoYoi12q6f-wcUO1GThoQCXeW5HD800LULgzWfEfbg0xns6Ry8u3d19RL6hLEJec5tntzfRe9p4af5IxqJmp0GMqFzifQoLt1hsqKpISWzrPW48fbyHUsEjiToru_oo2lbZIJX6jPjafJigzzlPbhvM5zIPknq57GOv7EEQ9IfdeY6-fS6IsToyOApO9l-hBJilw2kLSmjXkVnzXnUWVMR6Io3dOmGX3AZO9CbOTq8xx5MFJ04RhOB-H7o43qf29tjcdLlSb5Hs4ymOYSilmA95e_jV_aohVsyuHG_NAYXi4XQgswPDM8vVgKjHfqPDYoqGKA5EZBb5ZQGXTruSIaGuUlKMAjiHoLqvqlaQu4jUcwNBZ8es';

async function testXanoMCP() {
  console.log('🧪 Testing Xano Meta API MCP Server...\n');
  
  const client = new XanoAPIClient(XANO_BASE_URL, XANO_ACCESS_TOKEN);
  
  try {
    // Test 1: Get account information
    console.log('1️⃣ Testing account API...');
    const account = await client.getAccount();
    console.log('✅ Account API working');
    console.log('Account ID:', account.id);
    console.log('Account Name:', account.name);
    console.log('');
    
    // Test 2: Get instances
    console.log('2️⃣ Testing instances API...');
    const instances = await client.getInstances();
    console.log('✅ Instances API working');
    console.log('Number of instances:', instances.length);
    if (instances.length > 0) {
      console.log('First instance:', instances[0].name);
    }
    console.log('');
    
    // Test 3: Get workspaces (if instances exist)
    if (instances.length > 0) {
      const instanceId = instances[0].id;
      console.log('3️⃣ Testing workspaces API...');
      const workspaces = await client.getWorkspaces(instanceId);
      console.log('✅ Workspaces API working');
      console.log('Number of workspaces:', workspaces.length);
      if (workspaces.length > 0) {
        console.log('First workspace:', workspaces[0].name);
        console.log('');
        
        // Test 4: Get tables (if workspaces exist)
        const workspaceId = workspaces[0].id;
        console.log('4️⃣ Testing tables API...');
        const tables = await client.getTables(workspaceId);
        console.log('✅ Tables API working');
        console.log('Number of tables:', tables.length);
        if (tables.length > 0) {
          console.log('First table:', tables[0].name);
          console.log('');
          
          // Test 5: Get table details
          const tableId = tables[0].id;
          console.log('5️⃣ Testing table details API...');
          const tableDetails = await client.getTable(workspaceId, tableId);
          console.log('✅ Table details API working');
          console.log('Table fields:', tableDetails.fields?.length || 0);
          console.log('');
          
          // Test 6: Get records (if table has content)
          console.log('6️⃣ Testing records API...');
          const records = await client.getRecords(workspaceId, tableId, { limit: 5 });
          console.log('✅ Records API working');
          console.log('Number of records:', records.length);
          console.log('');
        }
      }
    }
    
    // Test 7: Get files
    if (instances.length > 0 && workspaces.length > 0) {
      console.log('7️⃣ Testing files API...');
      const files = await client.getFiles(workspaces[0].id);
      console.log('✅ Files API working');
      console.log('Number of files:', files.length);
      console.log('');
    }
    
    console.log('🎉 All tests passed! Xano Meta API MCP Server is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run tests
testXanoMCP();
