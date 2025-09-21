#!/usr/bin/env node

/**
 * Script to retrieve all properties from Webflow CMS
 * This will get the complete data for all 42 properties
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  webflow: {
    siteId: '609dfa12a141dd6e70976d48',
    collectionId: '648b412e0dd822359604117b'
  }
};

async function getAllWebflowProperties() {
  console.log('🔍 Retrieving all properties from Webflow...');
  
  try {
    // Get all collection items
    const allItems = await mcp_webflow_collections_items_list_items({
      collection_id: CONFIG.webflow.collectionId,
      limit: 100
    });
    
    console.log(`Found ${allItems.items.length} properties in Webflow`);
    
    // Process and clean the data
    const processedProperties = allItems.items.map(item => {
      const fieldData = item.fieldData;
      
      return {
        id: item.id,
        name: fieldData.name || 'Untitled Property',
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
        'webflow-id': item.id
      };
    });
    
    // Save to file
    const outputPath = path.join(__dirname, 'all-webflow-properties.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedProperties, null, 2));
    
    console.log(`✅ Successfully retrieved ${processedProperties.length} properties`);
    console.log(`📄 Data saved to: ${outputPath}`);
    
    // Print summary
    console.log('\n📊 Property Summary:');
    processedProperties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.name} (${prop.city}) - $${prop['price-starts-at']}/night`);
    });
    
    return processedProperties;
    
  } catch (error) {
    console.error('❌ Error retrieving properties:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  getAllWebflowProperties().catch(console.error);
}

module.exports = { getAllWebflowProperties };
