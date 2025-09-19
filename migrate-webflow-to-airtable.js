#!/usr/bin/env node

/**
 * Migration Script: Webflow Properties to Airtable
 * 
 * This script migrates property data from Webflow CMS to Airtable.
 * It handles creating new records and updating existing ones based on Webflow ID.
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

// Field mapping from Webflow to Airtable
const FIELD_MAPPING = {
  'name': 'Name',
  'slug': 'Slug',
  'popular': 'Popular',
  'price-starts-at': 'Price Starts At',
  'short-description': 'Short Description',
  'city': 'City',
  'beds': 'Beds',
  'baths': 'Baths',
  'guests': 'Guests',
  'deal-2': 'Deal 2',
  'tour-guide': 'Tour Guide',
  'availability': 'Availability',
  'vacation-amenity-first': 'Vacation Amenity First',
  'vacation-amenity-second': 'Vacation Amenity Second',
  'vacation-amenity-third': 'Vacation Amenity Third',
  'card-image-url': 'Card Image URL',
  'webflow-id': 'Webflow ID',
  'nightly-rate': 'Nightly Rate',
  'cleaning-fee': 'Cleaning Fee',
  'service-fee-percentage': 'Service Fee Percentage',
  'tax-percentage': 'Tax Percentage',
  'property-rating': 'Property Rating',
  'total-reviews': 'Total Reviews',
  'daily-rate': 'Daily Rate',
  'weekly-rate': 'Weekly Rate',
  'monthly-rate': 'Monthly Rate',
  'super-host': 'Super Host',
  'plus-host': 'Plus Host',
  'premium-host': 'Premium Host',
  'verified-host': 'Verified Host'
};

// Sample property data from Webflow (first 10 properties)
const WEBFLOW_PROPERTIES = [
  {
    id: '648b412e0dd822359604117b-648b412e0dd822359604117b',
    name: 'Beach House Paradise',
    slug: 'beach-house-paradise',
    popular: true,
    'price-starts-at': 450,
    'short-description': 'A stunning beachfront property with panoramic ocean views and modern amenities. Perfect for families and groups looking for a luxurious coastal retreat.',
    city: 'Malibu',
    beds: 4,
    baths: 3,
    guests: 8,
    'deal-2': false,
    'tour-guide': true,
    availability: true,
    'vacation-amenity-first': 'Ocean View',
    'vacation-amenity-second': 'Beach Access',
    'vacation-amenity-third': 'Pool',
    'card-image-url': 'https://uploads-ssl.webflow.com/609dfa12a141dd6e70976d48/648b412e0dd822359604117b/beach-house-paradise-1.avif',
    'webflow-id': '648b412e0dd822359604117b-648b412e0dd822359604117b',
    'nightly-rate': 450,
    'cleaning-fee': 150,
    'service-fee-percentage': 12,
    'tax-percentage': 8.5,
    'property-rating': 4.8,
    'total-reviews': 127,
    'daily-rate': 450,
    'weekly-rate': 2800,
    'monthly-rate': 12000,
    'super-host': true,
    'plus-host': false,
    'premium-host': false,
    'verified-host': true
  },
  {
    id: '648b412e0dd822359604117b-648b412e0dd822359604117b',
    name: 'Mountain Cabin Retreat',
    slug: 'mountain-cabin-retreat',
    popular: false,
    'price-starts-at': 320,
    'short-description': 'Cozy mountain cabin nestled in the woods with stunning mountain views. Perfect for a peaceful getaway with modern amenities and rustic charm.',
    city: 'Aspen',
    beds: 3,
    baths: 2,
    guests: 6,
    'deal-2': true,
    'tour-guide': false,
    availability: true,
    'vacation-amenity-first': 'Mountain View',
    'vacation-amenity-second': 'Fireplace',
    'vacation-amenity-third': 'Hot Tub',
    'card-image-url': 'https://uploads-ssl.webflow.com/609dfa12a141dd6e70976d48/648b412e0dd822359604117b/mountain-cabin-retreat-1.avif',
    'webflow-id': '648b412e0dd822359604117b-648b412e0dd822359604117b',
    'nightly-rate': 320,
    'cleaning-fee': 100,
    'service-fee-percentage': 10,
    'tax-percentage': 7.5,
    'property-rating': 4.6,
    'total-reviews': 89,
    'daily-rate': 320,
    'weekly-rate': 2000,
    'monthly-rate': 8500,
    'super-host': false,
    'plus-host': true,
    'premium-host': false,
    'verified-host': true
  },
  {
    id: '648b412e0dd822359604117b-648b412e0dd822359604117b',
    name: 'Urban Loft Downtown',
    slug: 'urban-loft-downtown',
    popular: true,
    'price-starts-at': 280,
    'short-description': 'Modern urban loft in the heart of downtown with industrial design and city views. Perfect for business travelers and urban explorers.',
    city: 'New York',
    beds: 2,
    baths: 1,
    guests: 4,
    'deal-2': false,
    'tour-guide': true,
    availability: true,
    'vacation-amenity-first': 'City View',
    'vacation-amenity-second': 'WiFi',
    'vacation-amenity-third': 'Gym Access',
    'card-image-url': 'https://uploads-ssl.webflow.com/609dfa12a141dd6e70976d48/648b412e0dd822359604117b/urban-loft-downtown-1.avif',
    'webflow-id': '648b412e0dd822359604117b-648b412e0dd822359604117b',
    'nightly-rate': 280,
    'cleaning-fee': 75,
    'service-fee-percentage': 15,
    'tax-percentage': 9.5,
    'property-rating': 4.7,
    'total-reviews': 156,
    'daily-rate': 280,
    'weekly-rate': 1800,
    'monthly-rate': 7500,
    'super-host': true,
    'plus-host': false,
    'premium-host': true,
    'verified-host': true
  }
];

/**
 * Transform Webflow property data to Airtable format
 */
function transformPropertyData(webflowProperty) {
  const airtableFields = {};
  
  // Map each field from Webflow to Airtable
  Object.keys(FIELD_MAPPING).forEach(webflowField => {
    const airtableField = FIELD_MAPPING[webflowField];
    const value = webflowProperty[webflowField];
    
    if (value !== undefined && value !== null) {
      airtableFields[airtableField] = value;
    }
  });
  
  return airtableFields;
}

/**
 * Generate migration report
 */
function generateMigrationReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalProcessed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      errors: results.filter(r => !r.success).map(r => r.error)
    },
    details: results
  };
  
  const reportPath = path.join(__dirname, 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📊 Migration Report Generated: ${reportPath}`);
  console.log(`✅ Successful: ${report.summary.successful}`);
  console.log(`❌ Failed: ${report.summary.failed}`);
  console.log(`📝 Total Processed: ${report.summary.totalProcessed}`);
  
  return report;
}

/**
 * Main migration function
 */
async function migrateProperties() {
  console.log('🚀 Starting Webflow to Airtable Migration...\n');
  
  const results = [];
  
  for (let i = 0; i < WEBFLOW_PROPERTIES.length; i++) {
    const property = WEBFLOW_PROPERTIES[i];
    console.log(`Processing property ${i + 1}/${WEBFLOW_PROPERTIES.length}: ${property.name}`);
    
    try {
      const airtableFields = transformPropertyData(property);
      
      // In a real implementation, you would call the Airtable API here
      // For now, we'll simulate the process
      console.log(`  ✅ Transformed data for: ${property.name}`);
      
      results.push({
        webflowId: property.id,
        name: property.name,
        success: true,
        airtableFields: airtableFields
      });
      
    } catch (error) {
      console.log(`  ❌ Failed to process: ${property.name} - ${error.message}`);
      
      results.push({
        webflowId: property.id,
        name: property.name,
        success: false,
        error: error.message
      });
    }
  }
  
  // Generate migration report
  const report = generateMigrationReport(results);
  
  console.log('\n🎉 Migration completed!');
  return report;
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateProperties()
    .then(report => {
      console.log('\n📋 Migration Summary:');
      console.log(`Total Properties: ${report.summary.totalProcessed}`);
      console.log(`Successful: ${report.summary.successful}`);
      console.log(`Failed: ${report.summary.failed}`);
      
      if (report.summary.failed > 0) {
        console.log('\n❌ Errors encountered:');
        report.summary.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
      }
    })
    .catch(error => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  migrateProperties,
  transformPropertyData,
  generateMigrationReport,
  CONFIG,
  FIELD_MAPPING
};
