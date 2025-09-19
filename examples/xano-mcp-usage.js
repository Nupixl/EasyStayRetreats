/**
 * Xano Meta API MCP Usage Examples
 * 
 * This file demonstrates how to use the Xano Meta API MCP server
 * for common operations in the Easy Stay Retreats project.
 */

import { XanoAPIClient } from '../lib/xano-mcp.js';

// Configuration
const XANO_BASE_URL = 'https://xxsw-1d5c-nopq.n7d.xano.io/api:meta';
const XANO_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiJ9.eyJ4YW5vIjp7ImRibyI6Im1hc3Rlcjp1c2VyIiwiaWQiOjQyMjQ2LCJhY2Nlc3NfdG9rZW4iOnsia2V5aWQiOiJmNjNlMDQwNS1kMTNlLTQ5NWMtOWYzZC1hNWQzZDM5NDMwMzAiLCJzY29wZSI6eyJ0ZW5hbnRfY2VudGVyOmJhY2t1cCI6MCwidGVuYW50X2NlbnRlcjpkZXBsb3kiOjAsInRlbmFudF9jZW50ZXI6aW1wZXJzb25hdGUiOjAsInRlbmFudF9jZW50ZXI6bWV0YWRhdGE6YXBpIjowLCJ0ZW5hbnRfY2VudGVyOmxvZyI6MCwidGVuYW50X2NlbnRlcjpyYmFjIjowLCJ0ZW5hbnRfY2VudGVyOnNlY3JldHMiOjAsInRlbmFudF9jZW50ZXIiOjAsIndvcmtzcGFjZTphZGRvbiI6MTUsIndvcmtzcGFjZTphcGkiOjE1LCJ3b3Jrc3BhY2U6Y29udGVudCI6MTUsIndvcmtzcGFjZTpkYXRhYmFzZSI6MTUsIndvcmtzcGFjZTpkYXRhc291cmNlOmxpdmUiOjE5LCJ3b3Jrc3BhY2U6ZmlsZSI6MTUsIndvcmtzcGFjZTpmdW5jdGlvbiI6MTUsIndvcmtzcGFjZTpzZXJ2aWNlIjoxNSwid29ya3NwYWNlOmxvZyI6MTUsIndvcmtzcGFjZTptaWRkbGV3YXJlIjoxNSwid29ya3NwYWNlOnJlcXVlc3RoaXN0b3J5IjoxNSwid29ya3NwYWNlOnRhc2siOjE1LCJ3b3Jrc3BhY2U6dG9vbCI6MTV9fSwiZXhwaXJlc19hdCI6IjIwMjUtMDktMjMgMTQ6NTY6MTUrMDAwMCJ9LCJpYXQiOjE3NTgwMzQ1NzUsIm5iZiI6MTc1ODAzNDU3NSwiYXVkIjoieGFubzptZXRhIn0.YpD_plz0pH77mSHDIQzGCqDgfEWRh4ABBgOlR_DsEnQMevu4pi5sZpMDt7dnBAQphk6gd7kUvQPyrTvA1gQRfcaMgyLA5KRBWN-Kflmrb4TkJWM9Fj6_uYXZwGa0sJfxIFhXiy7NsXhEB8cZzOUsaFQSaPhE9fSKfT8xIHVbRuiERO5Qy95NsiZgf0EEMb-eoxlEhiFzfPngrXg8gw0tvAi1wAXiw7en-VcmGzMHRkl8BzldoSHoKu0biy8ZOtkGXEbG9r_AP6UWeaW_yNM4k453LfkbZUtxMnY90WxNokPaBWonisRYkrIPYoYoi12q6f-wcUO1GThoQCXeW5HD800LULgzWfEfbg0xns6Ry8u3d19RL6hLEJec5tntzfRe9p4af5IxqJmp0GMqFzifQoLt1hsqKpISWzrPW48fbyHUsEjiToru_oo2lbZIJX6jPjafJigzzlPbhvM5zIPknq57GOv7EEQ9IfdeY6-fS6IsToyOApO9l-hBJilw2kLSmjXkVnzXnUWVMR6Io3dOmGX3AZO9CbOTq8xx5MFJ04RhOB-H7o43qf29tjcdLlSb5Hs4ymOYSilmA95e_jV_aohVsyuHG_NAYXi4XQgswPDM8vVgKjHfqPDYoqGKA5EZBb5ZQGXTruSIaGuUlKMAjiHoLqvqlaQu4jUcwNBZ8es';

const client = new XanoAPIClient(XANO_BASE_URL, XANO_ACCESS_TOKEN);

/**
 * Example 1: Get all properties from a properties table
 */
async function getProperties(workspaceId, tableId) {
  try {
    console.log('🏠 Fetching properties...');
    const properties = await client.getRecords(workspaceId, tableId, {
      limit: 20,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    
    console.log(`Found ${properties.length} properties:`);
    properties.forEach((property, index) => {
      console.log(`${index + 1}. ${property.name || 'Unnamed Property'} - $${property.price || 'N/A'}`);
    });
    
    return properties;
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    throw error;
  }
}

/**
 * Example 2: Create a new property
 */
async function createProperty(workspaceId, tableId, propertyData) {
  try {
    console.log('➕ Creating new property...');
    const newProperty = await client.createRecord(workspaceId, tableId, {
      name: propertyData.name,
      description: propertyData.description,
      price: propertyData.price,
      location: propertyData.location,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      amenities: propertyData.amenities || [],
      images: propertyData.images || [],
      available: true,
      created_at: new Date().toISOString()
    });
    
    console.log('✅ Property created successfully:', newProperty.id);
    return newProperty;
  } catch (error) {
    console.error('Error creating property:', error.message);
    throw error;
  }
}

/**
 * Example 3: Search for properties by location
 */
async function searchPropertiesByLocation(workspaceId, tableId, location) {
  try {
    console.log(`🔍 Searching for properties in ${location}...`);
    const results = await client.searchContent(workspaceId, tableId, location, {
      limit: 10
    });
    
    console.log(`Found ${results.length} properties in ${location}:`);
    results.forEach((property, index) => {
      console.log(`${index + 1}. ${property.name} - ${property.location} - $${property.price}`);
    });
    
    return results;
  } catch (error) {
    console.error('Error searching properties:', error.message);
    throw error;
  }
}

/**
 * Example 4: Update property availability
 */
async function updatePropertyAvailability(workspaceId, tableId, propertyId, available) {
  try {
    console.log(`🔄 Updating property ${propertyId} availability to ${available}...`);
    const updatedProperty = await client.updateRecord(workspaceId, tableId, propertyId, {
      available: available,
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ Property availability updated successfully');
    return updatedProperty;
  } catch (error) {
    console.error('Error updating property:', error.message);
    throw error;
  }
}

/**
 * Example 5: Get workspace structure
 */
async function getWorkspaceStructure(workspaceId) {
  try {
    console.log('📊 Getting workspace structure...');
    
    // Get workspace details
    const workspace = await client.getWorkspace(workspaceId);
    console.log(`Workspace: ${workspace.name}`);
    
    // Get all tables
    const tables = await client.getTables(workspaceId);
    console.log(`Tables (${tables.length}):`);
    
    for (const table of tables) {
      console.log(`  - ${table.name} (${table.display_name})`);
      
      // Get table schema
      const tableDetails = await client.getTable(workspaceId, table.id);
      console.log(`    Fields: ${tableDetails.fields?.length || 0}`);
      
      // Get record count (first 1 record to check if table has data)
      try {
        const sampleRecords = await client.getRecords(workspaceId, table.id, { limit: 1 });
        console.log(`    Records: ${sampleRecords.length > 0 ? 'Has data' : 'Empty'}`);
      } catch (error) {
        console.log(`    Records: Error accessing`);
      }
    }
    
    return { workspace, tables };
  } catch (error) {
    console.error('Error getting workspace structure:', error.message);
    throw error;
  }
}

/**
 * Example 6: Bulk operations
 */
async function bulkUpdateProperties(workspaceId, tableId, updates) {
  try {
    console.log(`🔄 Performing bulk update on ${updates.length} properties...`);
    
    const results = [];
    for (const update of updates) {
      try {
        const result = await client.updateRecord(workspaceId, tableId, update.id, update.data);
        results.push({ id: update.id, success: true, data: result });
        console.log(`✅ Updated property ${update.id}`);
      } catch (error) {
        results.push({ id: update.id, success: false, error: error.message });
        console.log(`❌ Failed to update property ${update.id}: ${error.message}`);
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`Bulk update completed: ${successCount}/${updates.length} successful`);
    
    return results;
  } catch (error) {
    console.error('Error in bulk update:', error.message);
    throw error;
  }
}

/**
 * Example usage function
 */
async function runExamples() {
  try {
    // First, get account and workspace information
    console.log('🚀 Starting Xano MCP Examples...\n');
    
    const account = await client.getAccount();
    console.log(`Account: ${account.name} (ID: ${account.id})\n`);
    
    const instances = await client.getInstances();
    if (instances.length === 0) {
      console.log('No instances found');
      return;
    }
    
    const instanceId = instances[0].id;
    console.log(`Using instance: ${instances[0].name} (ID: ${instanceId})\n`);
    
    const workspaces = await client.getWorkspaces(instanceId);
    if (workspaces.length === 0) {
      console.log('No workspaces found');
      return;
    }
    
    const workspaceId = workspaces[0].id;
    console.log(`Using workspace: ${workspaces[0].name} (ID: ${workspaceId})\n`);
    
    // Get workspace structure
    await getWorkspaceStructure(workspaceId);
    console.log('');
    
    // Example: Get tables and find a properties table
    const tables = await client.getTables(workspaceId);
    const propertiesTable = tables.find(table => 
      table.name.toLowerCase().includes('property') || 
      table.name.toLowerCase().includes('listing')
    );
    
    if (propertiesTable) {
      console.log(`Found properties table: ${propertiesTable.name} (ID: ${propertiesTable.id})\n`);
      
      // Get properties
      await getProperties(workspaceId, propertiesTable.id);
      console.log('');
      
      // Search for properties
      await searchPropertiesByLocation(workspaceId, propertiesTable.id, 'beach');
      console.log('');
    } else {
      console.log('No properties table found. Available tables:');
      tables.forEach(table => console.log(`  - ${table.name}`));
    }
    
    console.log('✅ Examples completed successfully!');
    
  } catch (error) {
    console.error('❌ Examples failed:', error.message);
  }
}

// Export functions for use in other modules
export {
  getProperties,
  createProperty,
  searchPropertiesByLocation,
  updatePropertyAvailability,
  getWorkspaceStructure,
  bulkUpdateProperties,
  runExamples
};

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples();
}
