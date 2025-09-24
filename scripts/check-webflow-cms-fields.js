#!/usr/bin/env node

/**
 * Webflow CMS Field Type Checker
 * 
 * This script checks Webflow CMS field types to ensure body descriptions
 * and property features are using Rich Text Format (RTF) instead of HTML.
 * 
 * Based on Webflow documentation:
 * - Rich Text Fields automatically convert content to HTML for formatting
 * - Plain Text Fields store content as plain text without HTML
 * - For RTF content, we want to ensure proper field type configuration
 */

require('dotenv').config({ path: '.env.local' })

const WebflowApi = require('webflow-api')

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

const webflow = new WebflowApi({ token: WEBFLOW_API_TOKEN })

/**
 * Check field types in a collection
 */
async function checkCollectionFields(collection) {
  console.log(`\n📋 Collection: ${collection.name} (${collection.slug})`)
  console.log(`   ID: ${collection.id}`)
  
  const fields = collection.fields || []
  const fieldAnalysis = {
    total: fields.length,
    richText: [],
    plainText: [],
    html: [],
    other: []
  }
  
  fields.forEach(field => {
    const fieldInfo = {
      name: field.name,
      slug: field.slug,
      type: field.type,
      id: field.id
    }
    
    switch (field.type) {
      case 'RichText':
        fieldAnalysis.richText.push(fieldInfo)
        break
      case 'PlainText':
        fieldAnalysis.plainText.push(fieldInfo)
        break
      case 'HTML':
        fieldAnalysis.html.push(fieldInfo)
        break
      default:
        fieldAnalysis.other.push(fieldInfo)
    }
  })
  
  // Display field analysis
  console.log(`   📊 Field Analysis:`)
  console.log(`      Total fields: ${fieldAnalysis.total}`)
  console.log(`      Rich Text: ${fieldAnalysis.richText.length}`)
  console.log(`      Plain Text: ${fieldAnalysis.plainText.length}`)
  console.log(`      HTML: ${fieldAnalysis.html.length}`)
  console.log(`      Other: ${fieldAnalysis.other.length}`)
  
  // Check for body description and property features fields
  const bodyDescriptionFields = fields.filter(f => 
    f.slug.includes('body') || 
    f.slug.includes('description') || 
    f.name.toLowerCase().includes('body') ||
    f.name.toLowerCase().includes('description')
  )
  
  const propertyFeatureFields = fields.filter(f => 
    f.slug.includes('feature') || 
    f.slug.includes('amenity') || 
    f.name.toLowerCase().includes('feature') ||
    f.name.toLowerCase().includes('amenity')
  )
  
  if (bodyDescriptionFields.length > 0) {
    console.log(`   🔍 Body Description Fields:`)
    bodyDescriptionFields.forEach(field => {
      const status = field.type === 'RichText' ? '✅' : '⚠️'
      console.log(`      ${status} ${field.name} (${field.slug}) - Type: ${field.type}`)
    })
  }
  
  if (propertyFeatureFields.length > 0) {
    console.log(`   🔍 Property Feature Fields:`)
    propertyFeatureFields.forEach(field => {
      const status = field.type === 'RichText' ? '✅' : '⚠️'
      console.log(`      ${status} ${field.name} (${field.slug}) - Type: ${field.type}`)
    })
  }
  
  return fieldAnalysis
}

/**
 * Get sample content from a collection to analyze field content
 */
async function analyzeCollectionContent(collection) {
  try {
    console.log(`\n🔍 Analyzing content in ${collection.name}...`)
    
    const items = await webflow.items({ collectionId: collection.id })
    
    if (items.length === 0) {
      console.log(`   No items found in ${collection.name}`)
      return
    }
    
    // Analyze first few items
    const sampleSize = Math.min(3, items.length)
    console.log(`   Analyzing ${sampleSize} sample items...`)
    
    for (let i = 0; i < sampleSize; i++) {
      const item = items[i]
      console.log(`\n   📄 Item ${i + 1}: ${item.name || item.id}`)
      
      // Check for body description fields
      const bodyFields = Object.keys(item.fieldData || {}).filter(key => 
        key.includes('body') || 
        key.includes('description')
      )
      
      bodyFields.forEach(fieldKey => {
        const content = item.fieldData[fieldKey]
        if (content) {
          const hasHtml = /<[^>]+>/.test(content)
          const isRichText = content.includes('\n') || content.includes('>') || content.includes('*')
          
          console.log(`      ${fieldKey}:`)
          console.log(`         Content length: ${content.length} characters`)
          console.log(`         Contains HTML: ${hasHtml ? '⚠️ Yes' : '✅ No'}`)
          console.log(`         Rich formatting: ${isRichText ? '✅ Yes' : '❌ No'}`)
          
          if (hasHtml && !isRichText) {
            console.log(`         ⚠️  WARNING: This field contains HTML but may not be properly configured as Rich Text`)
          }
        }
      })
    }
    
  } catch (error) {
    console.error(`   ❌ Error analyzing content: ${error.message}`)
  }
}

/**
 * Main function to check all collections
 */
async function checkWebflowCMS() {
  try {
    console.log('🚀 Starting Webflow CMS Field Type Analysis...')
    console.log(`   Site ID: ${WEBFLOW_SITE_ID}`)
    
    // Get site information
    const site = await webflow.site({ siteId: WEBFLOW_SITE_ID })
    console.log(`\n🏠 Site: ${site.displayName}`)
    console.log(`   Domain: ${site.shortName}.webflow.io`)
    
    // Get all collections
    const collections = await webflow.collections({ siteId: WEBFLOW_SITE_ID })
    console.log(`\n📚 Found ${collections.length} collections`)
    
    let totalFields = 0
    let richTextFields = 0
    let htmlFields = 0
    let issuesFound = 0
    
    // Analyze each collection
    for (const collection of collections) {
      const analysis = await checkCollectionFields(collection)
      totalFields += analysis.total
      richTextFields += analysis.richText.length
      htmlFields += analysis.html.length
      
      // Check for potential issues
      const bodyFields = analysis.richText.concat(analysis.plainText).concat(analysis.html)
        .filter(f => f.name.toLowerCase().includes('body') || f.name.toLowerCase().includes('description'))
      
      if (bodyFields.some(f => f.type === 'HTML')) {
        issuesFound++
        console.log(`   ⚠️  WARNING: Found HTML field for body content in ${collection.name}`)
      }
      
      // Analyze content if this looks like a properties collection
      if (collection.name.toLowerCase().includes('property') || 
          collection.name.toLowerCase().includes('listing') ||
          collection.slug.includes('property') ||
          collection.slug.includes('listing')) {
        await analyzeCollectionContent(collection)
      }
    }
    
    // Summary
    console.log('\n📊 SUMMARY')
    console.log('=' * 50)
    console.log(`Total Collections: ${collections.length}`)
    console.log(`Total Fields: ${totalFields}`)
    console.log(`Rich Text Fields: ${richTextFields}`)
    console.log(`HTML Fields: ${htmlFields}`)
    console.log(`Potential Issues: ${issuesFound}`)
    
    if (issuesFound > 0) {
      console.log('\n⚠️  RECOMMENDATIONS:')
      console.log('1. Convert HTML fields to Rich Text for body descriptions')
      console.log('2. Ensure property features use Rich Text format')
      console.log('3. Review field types in Webflow Designer')
    } else {
      console.log('\n✅ All field types appear to be properly configured!')
    }
    
  } catch (error) {
    console.error('❌ Error checking Webflow CMS:', error.message)
    
    if (error.status === 401) {
      console.error('   Authentication failed. Check your WEBFLOW_API_TOKEN.')
    } else if (error.status === 404) {
      console.error('   Site not found. Check your WEBFLOW_SITE_ID.')
    }
    
    process.exit(1)
  }
}

// Run the analysis
if (require.main === module) {
  checkWebflowCMS()
}

module.exports = { checkWebflowCMS, checkCollectionFields }

