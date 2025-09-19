#!/usr/bin/env node

/**
 * Complete 42 Properties Migration Script: Webflow to Airtable
 * 
 * This script migrates ALL 42 property data from Webflow CMS to Airtable.
 * It includes all fields from Webflow and handles duplicates by updating existing records.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  webflow: {
    siteId: '609dfa12a141dd6e70976d48',
    collectionId: '648b412e0dd822359604117b'
  },
  airtable: {
    baseId: 'appvXDVDF1pQDoZ02',
    tableId: 'tbld0hcaejq9RJxoA'
  }
};

// Complete field mapping from Webflow to Airtable
const FIELD_MAPPING = {
  // Basic Information
  'name': 'Name',
  'slug': 'Slug',
  'popular': 'Popular',
  'deal-2': 'Deal 2',
  'availability': 'Availability',
  'tour-guide': 'Tour Guide',
  
  // Pricing
  'price-starts-at': 'Price Starts At',
  'nightly-rate': 'Nightly Rate',
  'cleaning-fee': 'Cleaning Fee',
  'service-fee-percentage': 'Service Fee Percentage',
  'tax-percentage': 'Tax Percentage',
  'daily-rate': 'Daily Rate',
  'weekly-rate': 'Weekly Rate',
  'monthly-rate': 'Monthly Rate',
  'compare-daily-rate': 'Compare Daily Rate',
  'compare-weekly-rate': 'Compare Weekly Rate',
  'compare-monthly-rate': 'Compare Monthly Rate',
  
  // Property Details
  'beds': 'Beds',
  'baths': 'Baths',
  'guests': 'Guests',
  'city': 'City',
  'street-address': 'Street',
  'latitude': 'Latitude',
  'longitude': 'Longitude',
  
  // Descriptions
  'short-description': 'Short Description',
  'body-description': 'Body Description',
  
  // Images
  'card-image': 'Card Image URL',
  'showcase-featured-image': 'Showcase Featured Image URL',
  'hero-slider-image-first': 'Hero Slider Image First URL',
  'hero-slider-image-second': 'Hero Slider Image Second URL',
  'hero-slider-image-third': 'Hero Slider Image Third URL',
  'showcase-images-4': 'Showcase Images 4 URLs',
  
  // Amenities
  'vacation-amenity-first': 'Vacation Amenity First',
  'vacation-amenity-second': 'Vacation Amenity Second',
  'vacation-amenity-third': 'Vacation Amenity Third',
  
  // Host Information
  'super-host': 'Super Host',
  'plus-host': 'Plus Host',
  'premium-host': 'Premium Host',
  'verified-host': 'Verified Host',
  'host-accolades-switch-2': 'Host Accolades Switch',
  'host-accolade-image-switch': 'Host Accolade Image Switch',
  'accolade-icon': 'Accolade Icon URL',
  
  // Ratings and Reviews
  'property-rating': 'Property Rating',
  'total-reviews': 'Total Reviews',
  
  // Dates
  'vacant-availability': 'Vacant Availability',
  
  // Additional Fields
  'map': 'Map',
  'link-listing': 'Link Listing',
  'test-address': 'Test Address',
  
  // Webflow ID for tracking
  'webflow-id': 'Webflow ID'
};

// Function to map Webflow data to Airtable format
function mapWebflowToAirtable(webflowProperty) {
  const airtableRecord = {};
  
  // Map each field
  Object.keys(FIELD_MAPPING).forEach(webflowField => {
    const airtableField = FIELD_MAPPING[webflowField];
    const value = webflowProperty[webflowField];
    
    if (value !== undefined && value !== null) {
      // Handle special field types
      if (webflowField === 'showcase-images-4' && Array.isArray(value)) {
        // Convert array of images to comma-separated URLs
        airtableRecord[airtableField] = value.map(img => img.url).join(', ');
      } else if (webflowField === 'card-image' && value && value.url) {
        airtableRecord[airtableField] = value.url;
      } else if (webflowField === 'showcase-featured-image' && value && value.url) {
        airtableRecord[airtableField] = value.url;
      } else if (webflowField === 'hero-slider-image-first' && value && value.url) {
        airtableRecord[airtableField] = value.url;
      } else if (webflowField === 'hero-slider-image-second' && value && value.url) {
        airtableRecord[airtableField] = value.url;
      } else if (webflowField === 'hero-slider-image-third' && value && value.url) {
        airtableRecord[airtableField] = value.url;
      } else if (webflowField === 'accolade-icon' && value && value.url) {
        airtableRecord[airtableField] = value.url;
      } else if (webflowField === 'vacant-availability' && value) {
        // Convert date to proper format
        airtableRecord[airtableField] = new Date(value).toISOString().split('T')[0];
      } else {
        airtableRecord[airtableField] = value;
      }
    }
  });
  
  // Add Webflow ID for tracking
  airtableRecord['Webflow ID'] = webflowProperty.id;
  
  return airtableRecord;
}

// Function to check for duplicates based on Webflow ID
function findDuplicateRecord(webflowId, existingRecords) {
  return existingRecords.find(record => 
    record.fields['Webflow ID'] === webflowId
  );
}

// Main migration function
async function migrateAllProperties() {
  console.log('🚀 Starting comprehensive migration of all 42 properties from Webflow to Airtable...');
  
  const migrationReport = {
    startTime: new Date().toISOString(),
    totalProperties: 0,
    created: 0,
    updated: 0,
    errors: [],
    details: []
  };
  
  try {
    // Get all Webflow properties
    console.log('📋 Fetching all properties from Webflow...');
    const webflowItems = await mcp_webflow_collections_items_list_items({
      collection_id: CONFIG.webflow.collectionId,
      limit: 100
    });
    
    console.log(`Found ${webflowItems.items.length} properties in Webflow`);
    migrationReport.totalProperties = webflowItems.items.length;
    
    // Get existing Airtable records
    console.log('📋 Fetching existing Airtable records...');
    const existingRecords = await mcp_airtable_list_records({
      baseId: CONFIG.airtable.baseId,
      tableId: CONFIG.airtable.tableId,
      maxRecords: 100
    });
    
    console.log(`Found ${existingRecords.records.length} existing records in Airtable`);
    
    // Process each Webflow property
    for (const webflowItem of webflowItems.items) {
      try {
        const fieldData = webflowItem.fieldData;
        const propertyName = fieldData.name || 'Untitled Property';
        
        console.log(`\n🔄 Processing: ${propertyName}`);
        
        // Create property object with all fields
        const webflowProperty = {
          id: webflowItem.id,
          name: fieldData.name || '',
          slug: fieldData.slug || '',
          popular: fieldData.popular || false,
          'deal-2': fieldData['deal-2'] || false,
          availability: fieldData.availability || true,
          'tour-guide': fieldData['tour-guide'] || false,
          beds: fieldData.beds || 0,
          baths: fieldData.baths || 0,
          guests: fieldData.guests || 0,
          'price-starts-at': fieldData['price-starts-at'] || 0,
          'short-description': fieldData['short-description'] || '',
          'body-description': fieldData['body-description'] || '',
          city: fieldData.city || '',
          'street-address': fieldData['street-address'] || '',
          latitude: fieldData.latitude || 0,
          longitude: fieldData.longitude || 0,
          'cleaning-fee': fieldData['cleaning-fee'] || 0,
          'nightly-rate': fieldData['nightly-rate'] || 0,
          'service-fee-percentage': fieldData['service-fee-percentage'] || 0,
          'tax-percentage': fieldData['tax-percentage'] || 0,
          'daily-rate': fieldData['daily-rate'] || 0,
          'weekly-rate': fieldData['weekly-rate'] || 0,
          'monthly-rate': fieldData['monthly-rate'] || 0,
          'compare-daily-rate': fieldData['compare-daily-rate'] || 0,
          'compare-weekly-rate': fieldData['compare-weekly-rate'] || 0,
          'compare-monthly-rate': fieldData['compare-monthly-rate'] || 0,
          'super-host': fieldData['super-host'] || false,
          'plus-host': fieldData['plus-host'] || false,
          'premium-host': fieldData['premium-host'] || false,
          'verified-host': fieldData['verified-host'] || false,
          'host-accolades-switch-2': fieldData['host-accolades-switch-2'] || false,
          'host-accolade-image-switch': fieldData['host-accolade-image-switch'] || false,
          'property-rating': fieldData['property-rating'] || 0,
          'total-reviews': fieldData['total-reviews'] || 0,
          'vacant-availability': fieldData['vacant-availability'] || null,
          'card-image': fieldData['card-image'] || null,
          'showcase-featured-image': fieldData['showcase-featured-image'] || null,
          'hero-slider-image-first': fieldData['hero-slider-image-first'] || null,
          'hero-slider-image-second': fieldData['hero-slider-image-second'] || null,
          'hero-slider-image-third': fieldData['hero-slider-image-third'] || null,
          'showcase-images-4': fieldData['showcase-images-4'] || [],
          'vacation-amenity-first': fieldData['vacation-amenity-first'] || '',
          'vacation-amenity-second': fieldData['vacation-amenity-second'] || '',
          'vacation-amenity-third': fieldData['vacation-amenity-third'] || '',
          'accolade-icon': fieldData['accolade-icon'] || null,
          map: fieldData.map || null,
          'link-listing': fieldData['link-listing'] || '',
          'test-address': fieldData['test-address'] || '',
          'webflow-id': webflowItem.id
        };
        
        // Map Webflow data to Airtable format
        const airtableData = mapWebflowToAirtable(webflowProperty);
        
        // Check for duplicates
        const duplicateRecord = findDuplicateRecord(webflowItem.id, existingRecords.records);
        
        if (duplicateRecord) {
          // Update existing record
          console.log(`  📝 Updating existing record: ${duplicateRecord.id}`);
          
          await mcp_airtable_update_records({
            baseId: CONFIG.airtable.baseId,
            tableId: CONFIG.airtable.tableId,
            records: [{
              id: duplicateRecord.id,
              fields: airtableData
            }]
          });
          
          migrationReport.updated++;
          migrationReport.details.push({
            action: 'updated',
            name: propertyName,
            webflowId: webflowItem.id,
            airtableId: duplicateRecord.id
          });
        } else {
          // Create new record
          console.log(`  ➕ Creating new record`);
          
          const newRecord = await mcp_airtable_create_record({
            baseId: CONFIG.airtable.baseId,
            tableId: CONFIG.airtable.tableId,
            fields: airtableData
          });
          
          migrationReport.created++;
          migrationReport.details.push({
            action: 'created',
            name: propertyName,
            webflowId: webflowItem.id,
            airtableId: newRecord.id
          });
        }
        
        console.log(`  ✅ Successfully processed: ${propertyName}`);
        
      } catch (error) {
        console.error(`  ❌ Error processing ${fieldData.name || 'Unknown'}:`, error.message);
        migrationReport.errors.push({
          name: fieldData.name || 'Unknown',
          webflowId: webflowItem.id,
          error: error.message
        });
      }
    }
    
    migrationReport.endTime = new Date().toISOString();
    migrationReport.duration = new Date(migrationReport.endTime) - new Date(migrationReport.startTime);
    
    // Save migration report
    const reportPath = path.join(__dirname, 'complete-42-properties-migration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(migrationReport, null, 2));
    
    // Print summary
    console.log('\n🎉 Migration completed!');
    console.log(`📊 Summary:`);
    console.log(`   Total Properties: ${migrationReport.totalProperties}`);
    console.log(`   Created: ${migrationReport.created}`);
    console.log(`   Updated: ${migrationReport.updated}`);
    console.log(`   Errors: ${migrationReport.errors.length}`);
    console.log(`   Duration: ${Math.round(migrationReport.duration / 1000)}s`);
    
    if (migrationReport.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      migrationReport.errors.forEach(error => {
        console.log(`   - ${error.name}: ${error.error}`);
      });
    }
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    migrationReport.errors.push({
      type: 'general',
      error: error.message
    });
  }
}

// Run migration
if (require.main === module) {
  migrateAllProperties().catch(console.error);
}

module.exports = { migrateAllProperties, mapWebflowToAirtable, FIELD_MAPPING };
