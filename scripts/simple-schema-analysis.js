const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function analyzeTableStructure(tableName) {
  console.log(`\n🔍 Analyzing ${tableName}...`)
  
  try {
    // Get a sample record to understand the structure
    const { data: sampleData, error: dataError } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .limit(1)

    if (dataError) {
      console.error(`❌ Error getting sample data from ${tableName}:`, dataError)
      return null
    }

    if (sampleData && sampleData.length > 0) {
      const columns = Object.keys(sampleData[0])
      console.log(`📋 Columns in ${tableName}:`)
      columns.forEach(col => {
        const value = sampleData[0][col]
        const type = typeof value
        console.log(`  - ${col}: ${type} (example: ${JSON.stringify(value).substring(0, 50)}...)`)
      })
      return { tableName, columns, sampleRecord: sampleData[0] }
    } else {
      console.log(`⚠️  No data found in ${tableName}`)
      return { tableName, columns: [], sampleRecord: null }
    }
  } catch (error) {
    console.error(`❌ Unexpected error analyzing ${tableName}:`, error)
    return null
  }
}

async function analyzeSchema() {
  console.log('🚀 Starting schema analysis...')

  // Analyze both tables
  const propertiesAnalysis = await analyzeTableStructure('properties')
  const appPropertiesAnalysis = await analyzeTableStructure('App-Properties')

  if (!propertiesAnalysis || !appPropertiesAnalysis) {
    console.error('❌ Failed to analyze one or both tables')
    return
  }

  // Compare schemas
  console.log('\n📊 Schema Comparison:')
  console.log('\nProperties table columns:')
  propertiesAnalysis.columns.forEach(col => console.log(`  - ${col}`))
  
  console.log('\nApp-Properties table columns:')
  appPropertiesAnalysis.columns.forEach(col => console.log(`  - ${col}`))

  // Find common columns
  const commonColumns = propertiesAnalysis.columns.filter(col => 
    appPropertiesAnalysis.columns.includes(col)
  )
  
  console.log('\n🔗 Common columns:')
  commonColumns.forEach(col => console.log(`  - ${col}`))

  // Find columns only in properties
  const propertiesOnly = propertiesAnalysis.columns.filter(col => 
    !appPropertiesAnalysis.columns.includes(col)
  )
  
  console.log('\n📋 Columns only in properties:')
  propertiesOnly.forEach(col => console.log(`  - ${col}`))

  // Find columns only in App-Properties
  const appPropertiesOnly = appPropertiesAnalysis.columns.filter(col => 
    !propertiesAnalysis.columns.includes(col)
  )
  
  console.log('\n📋 Columns only in App-Properties:')
  appPropertiesOnly.forEach(col => console.log(`  - ${col}`))

  // Create field mapping
  console.log('\n🗺️  Suggested Field Mapping (properties → App-Properties):')
  const fieldMapping = {
    'id': 'whalesync_postgres_id', // or create new UUID
    'title': 'name',
    'location': 'city', // or address
    'price': 'price_starts_at',
    'about': 'body_description',
    'latitude': 'latitude',
    'longitude': 'longitude',
    'rating': 'property_rating',
    'review_count': 'total_reviews',
    'created_at': 'created',
    'updated_at': 'updated'
  }

  Object.entries(fieldMapping).forEach(([from, to]) => {
    const fromExists = propertiesAnalysis.columns.includes(from)
    const toExists = appPropertiesAnalysis.columns.includes(to)
    console.log(`  ${from} → ${to} (${fromExists ? '✓' : '✗'} → ${toExists ? '✓' : '✗'})`)
  })

  // Save analysis to file
  const analysisResult = {
    timestamp: new Date().toISOString(),
    properties: propertiesAnalysis,
    appProperties: appPropertiesAnalysis,
    commonColumns,
    propertiesOnly,
    appPropertiesOnly,
    fieldMapping
  }

  const outputPath = path.join(__dirname, '..', 'backups', 'schema-analysis.json')
  fs.writeFileSync(outputPath, JSON.stringify(analysisResult, null, 2))
  console.log(`\n💾 Analysis saved to: ${outputPath}`)

  return analysisResult
}

analyzeSchema().catch(console.error)