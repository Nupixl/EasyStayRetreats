#!/usr/bin/env node

/**
 * Webflow CMS Rich Text Field Setup
 * 
 * This script helps configure Webflow CMS fields to use Rich Text Format (RTF)
 * instead of HTML for body descriptions and property features.
 * 
 * Note: Field type changes in Webflow CMS require manual intervention in the Designer.
 * This script provides guidance and can help analyze current field types.
 */

require('dotenv').config({ path: '.env.local' })

const { WebflowClient } = require('webflow-api')

// Configuration
const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN
const WEBFLOW_SITE_ID = process.env.WEBFLOW_SITE_ID

if (!WEBFLOW_API_TOKEN || !WEBFLOW_SITE_ID) {
  console.error('❌ Missing required environment variables:')
  console.error('   WEBFLOW_API_TOKEN - Your Webflow API token')
  console.error('   WEBFLOW_SITE_ID - Your Webflow site ID')
  console.error('')
  console.error('Add these to your .env.local file:')
  console.error('WEBFLOW_API_TOKEN=your_api_token_here')
  console.error('WEBFLOW_SITE_ID=your_site_id_here')
  process.exit(1)
}

const webflow = new WebflowClient({ token: WEBFLOW_API_TOKEN })

/**
 * Generate field conversion recommendations
 */
function generateFieldRecommendations(collection, fields) {
  const recommendations = []
  
  // Check for body description fields
  const bodyFields = fields.filter(f => 
    f.slug.includes('body') || 
    f.slug.includes('description') || 
    f.name.toLowerCase().includes('body') ||
    f.name.toLowerCase().includes('description')
  )
  
  // Check for property feature fields
  const featureFields = fields.filter(f => 
    f.slug.includes('feature') || 
    f.slug.includes('amenity') || 
    f.name.toLowerCase().includes('feature') ||
    f.name.toLowerCase().includes('amenity')
  )
  
  bodyFields.forEach(field => {
    if (field.type !== 'RichText') {
      recommendations.push({
        collection: collection.name,
        field: field.name,
        currentType: field.type,
        recommendedType: 'RichText',
        reason: 'Body descriptions should use Rich Text for proper formatting',
        action: 'Convert to Rich Text field in Webflow Designer'
      })
    }
  })
  
  featureFields.forEach(field => {
    if (field.type !== 'RichText') {
      recommendations.push({
        collection: collection.name,
        field: field.name,
        currentType: field.type,
        recommendedType: 'RichText',
        reason: 'Property features should use Rich Text for formatting',
        action: 'Convert to Rich Text field in Webflow Designer'
      })
    }
  })
  
  return recommendations
}

/**
 * Analyze content and provide conversion guidance
 */
async function analyzeContentForConversion(collection) {
  try {
    console.log(`\n🔍 Analyzing content in ${collection.name} for conversion needs...`)
    
    const items = await webflow.items({ collectionId: collection.id })
    
    if (items.length === 0) {
      console.log(`   No items found in ${collection.name}`)
      return []
    }
    
    const conversionNeeds = []
    
    // Analyze sample items
    const sampleSize = Math.min(5, items.length)
    console.log(`   Analyzing ${sampleSize} sample items...`)
    
    for (let i = 0; i < sampleSize; i++) {
      const item = items[i]
      const fieldData = item.fieldData || {}
      
      // Check each field for content that might need Rich Text
      Object.keys(fieldData).forEach(fieldKey => {
        const content = fieldData[fieldKey]
        if (content && typeof content === 'string') {
          const hasLineBreaks = content.includes('\n')
          const hasFormatting = content.includes('*') || content.includes('_') || content.includes('#')
          const hasHtml = /<[^>]+>/.test(content)
          const isLongText = content.length > 100
          
          if ((hasLineBreaks || hasFormatting || hasHtml) && isLongText) {
            conversionNeeds.push({
              collection: collection.name,
              field: fieldKey,
              item: item.name || item.id,
              content: content.substring(0, 100) + '...',
              needsRichText: true,
              reasons: [
                hasLineBreaks && 'Contains line breaks',
                hasFormatting && 'Contains formatting markers',
                hasHtml && 'Contains HTML tags',
                isLongText && 'Long text content'
              ].filter(Boolean)
            })
          }
        }
      })
    }
    
    return conversionNeeds
    
  } catch (error) {
    console.error(`   ❌ Error analyzing content: ${error.message}`)
    return []
  }
}

/**
 * Generate conversion guide
 */
function generateConversionGuide(recommendations, conversionNeeds) {
  console.log('\n📋 CONVERSION GUIDE')
  console.log('=' * 60)
  
  if (recommendations.length === 0 && conversionNeeds.length === 0) {
    console.log('✅ No field conversions needed! All fields appear to be properly configured.')
    return
  }
  
  console.log('\n🔧 MANUAL STEPS REQUIRED:')
  console.log('Field type changes must be done in Webflow Designer. Follow these steps:')
  console.log('')
  console.log('1. Open your Webflow project in Designer')
  console.log('2. Go to the CMS Collections tab')
  console.log('3. For each field listed below:')
  console.log('   a. Click on the field')
  console.log('   b. Change field type to "Rich Text"')
  console.log('   c. Save the collection')
  console.log('')
  
  if (recommendations.length > 0) {
    console.log('📝 RECOMMENDED FIELD CONVERSIONS:')
    console.log('')
    
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. Collection: ${rec.collection}`)
      console.log(`   Field: ${rec.field}`)
      console.log(`   Current Type: ${rec.currentType}`)
      console.log(`   Recommended: ${rec.recommendedType}`)
      console.log(`   Reason: ${rec.reason}`)
      console.log(`   Action: ${rec.action}`)
      console.log('')
    })
  }
  
  if (conversionNeeds.length > 0) {
    console.log('🔍 CONTENT ANALYSIS RESULTS:')
    console.log('')
    
    const groupedByField = conversionNeeds.reduce((acc, need) => {
      const key = `${need.collection}.${need.field}`
      if (!acc[key]) acc[key] = []
      acc[key].push(need)
      return acc
    }, {})
    
    Object.keys(groupedByField).forEach(fieldKey => {
      const needs = groupedByField[fieldKey]
      console.log(`Field: ${fieldKey}`)
      console.log(`   Items with rich content: ${needs.length}`)
      console.log(`   Reasons: ${needs[0].reasons.join(', ')}`)
      console.log(`   Sample content: "${needs[0].content}"`)
      console.log('')
    })
  }
  
  console.log('⚠️  IMPORTANT NOTES:')
  console.log('- Converting field types may affect existing content')
  console.log('- Test changes on a staging site first')
  console.log('- Backup your data before making changes')
  console.log('- Some content may need manual reformatting after conversion')
  console.log('')
  
  console.log('✅ AFTER CONVERSION:')
  console.log('- Run this script again to verify changes')
  console.log('- Test content display in your application')
  console.log('- Update any content processing logic if needed')
}

/**
 * Main function to analyze and provide conversion guidance
 */
async function setupWebflowCMSRTF() {
  try {
    console.log('🚀 Starting Webflow CMS Rich Text Field Setup...')
    console.log(`   Site ID: ${WEBFLOW_SITE_ID}`)
    
    // Get site information
    const site = await webflow.site({ siteId: WEBFLOW_SITE_ID })
    console.log(`\n🏠 Site: ${site.displayName}`)
    
    // Get all collections
    const collections = await webflow.collections({ siteId: WEBFLOW_SITE_ID })
    console.log(`\n📚 Found ${collections.length} collections`)
    
    let allRecommendations = []
    let allConversionNeeds = []
    
    // Analyze each collection
    for (const collection of collections) {
      console.log(`\n📋 Analyzing ${collection.name}...`)
      
      const fields = collection.fields || []
      const recommendations = generateFieldRecommendations(collection, fields)
      allRecommendations.push(...recommendations)
      
      // Analyze content for conversion needs
      const conversionNeeds = await analyzeContentForConversion(collection)
      allConversionNeeds.push(...conversionNeeds)
    }
    
    // Generate conversion guide
    generateConversionGuide(allRecommendations, allConversionNeeds)
    
    // Summary
    console.log('\n📊 SUMMARY')
    console.log('=' * 50)
    console.log(`Collections analyzed: ${collections.length}`)
    console.log(`Field recommendations: ${allRecommendations.length}`)
    console.log(`Content conversion needs: ${allConversionNeeds.length}`)
    
    if (allRecommendations.length > 0 || allConversionNeeds.length > 0) {
      console.log('\n🎯 NEXT STEPS:')
      console.log('1. Follow the conversion guide above')
      console.log('2. Make changes in Webflow Designer')
      console.log('3. Run this script again to verify')
      console.log('4. Test your application')
    } else {
      console.log('\n✅ All fields are properly configured for Rich Text!')
    }
    
  } catch (error) {
    console.error('❌ Error setting up Webflow CMS RTF:', error.message)
    
    if (error.status === 401) {
      console.error('   Authentication failed. Check your WEBFLOW_API_TOKEN.')
    } else if (error.status === 404) {
      console.error('   Site not found. Check your WEBFLOW_SITE_ID.')
    }
    
    process.exit(1)
  }
}

// Run the setup
if (require.main === module) {
  setupWebflowCMSRTF()
}

module.exports = { setupWebflowCMSRTF, generateFieldRecommendations }

