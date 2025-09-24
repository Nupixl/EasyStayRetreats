#!/usr/bin/env node

/**
 * Simple Webflow CMS Field Type Checker
 * 
 * This script checks Webflow CMS field types using direct API calls
 * to ensure body descriptions and property features are using Rich Text Format (RTF).
 */

require('dotenv').config({ path: '.env.local' })

const https = require('https')

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

/**
 * Make HTTP request to Webflow API
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json)
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${json.message || data}`))
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message}`))
        }
      })
    })
    
    req.on('error', reject)
    if (options.body) {
      req.write(JSON.stringify(options.body))
    }
    req.end()
  })
}

/**
 * Get site information
 */
async function getSiteInfo() {
  try {
    const response = await makeRequest(`https://api.webflow.com/v2/sites/${WEBFLOW_SITE_ID}`)
    return response
  } catch (error) {
    console.error('❌ Error fetching site info:', error.message)
    return null
  }
}

/**
 * Get collections for the site
 */
async function getCollections() {
  try {
    const response = await makeRequest(`https://api.webflow.com/v2/sites/${WEBFLOW_SITE_ID}/collections`)
    return response.collections || []
  } catch (error) {
    console.error('❌ Error fetching collections:', error.message)
    return []
  }
}

/**
 * Get collection details including fields
 */
async function getCollectionDetails(collectionId) {
  try {
    const response = await makeRequest(`https://api.webflow.com/v2/collections/${collectionId}`)
    return response
  } catch (error) {
    console.error(`❌ Error fetching collection ${collectionId}:`, error.message)
    return null
  }
}

/**
 * Analyze field types in a collection
 */
function analyzeCollectionFields(collection) {
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
 * Main function to check all collections
 */
async function checkWebflowCMS() {
  try {
    console.log('🚀 Starting Webflow CMS Field Type Analysis...')
    console.log(`   Site ID: ${WEBFLOW_SITE_ID}`)
    
    // Get site information
    const site = await getSiteInfo()
    if (site) {
      console.log(`\n🏠 Site: ${site.displayName}`)
      console.log(`   Domain: ${site.shortName}.webflow.io`)
    }
    
    // Get all collections
    const collections = await getCollections()
    console.log(`\n📚 Found ${collections.length} collections`)
    
    if (collections.length === 0) {
      console.log('❌ No collections found. This might be a new site or the API token might not have access.')
      return
    }
    
    let totalFields = 0
    let richTextFields = 0
    let htmlFields = 0
    let issuesFound = 0
    
    // Analyze each collection
    for (const collection of collections) {
      const details = await getCollectionDetails(collection.id)
      if (details) {
        const analysis = analyzeCollectionFields(details)
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
    process.exit(1)
  }
}

// Run the analysis
if (require.main === module) {
  checkWebflowCMS()
}

module.exports = { checkWebflowCMS }
