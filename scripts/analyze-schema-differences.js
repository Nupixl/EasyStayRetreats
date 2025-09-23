const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function analyzeTableSchema(tableName) {
  console.log(`\n📋 Analyzing ${tableName} schema...`)
  
  try {
    // Get column information
    const { data: columns, error: columnsError } = await supabaseAdmin
      .rpc('exec_sql', {
        sql: `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = '${tableName}'
          ORDER BY ordinal_position;
        `
      })

    if (columnsError) {
      console.error(`❌ Error getting columns for ${tableName}:`, columnsError)
      return null
    }

    // Get sample data
    const { data: sampleData, error: sampleError } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .limit(3)

    if (sampleError) {
      console.error(`❌ Error getting sample data for ${tableName}:`, sampleError)
    }

    return {
      columns,
      sampleData: sampleData || [],
      recordCount: sampleData ? sampleData.length : 0
    }

  } catch (error) {
    console.error(`❌ Unexpected error analyzing ${tableName}:`, error)
    return null
  }
}

async function compareSchemas() {
  console.log('🔍 Analyzing schema differences between properties and App-Properties...')

  const propertiesSchema = await analyzeTableSchema('properties')
  const appPropertiesSchema = await analyzeTableSchema('App-Properties')

  if (!propertiesSchema || !appPropertiesSchema) {
    console.error('❌ Could not analyze one or both schemas')
    return
  }

  console.log('\n📊 SCHEMA COMPARISON REPORT')
  console.log('=' .repeat(50))

  // Properties table analysis
  console.log('\n🏠 PROPERTIES TABLE:')
  console.log(`Columns: ${propertiesSchema.columns.length}`)
  console.log(`Sample records: ${propertiesSchema.recordCount}`)
  console.log('Columns:')
  propertiesSchema.columns.forEach(col => {
    console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'YES' ? ' (nullable)' : ' (not null)'}`)
  })

  // App-Properties table analysis
  console.log('\n🏢 APP-PROPERTIES TABLE:')
  console.log(`Columns: ${appPropertiesSchema.columns.length}`)
  console.log(`Sample records: ${appPropertiesSchema.recordCount}`)
  console.log('Columns:')
  appPropertiesSchema.columns.forEach(col => {
    console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'YES' ? ' (nullable)' : ' (not null)'}`)
  })

  // Find common columns
  const propertiesColumns = propertiesSchema.columns.map(c => c.column_name)
  const appPropertiesColumns = appPropertiesSchema.columns.map(c => c.column_name)
  
  const commonColumns = propertiesColumns.filter(col => appPropertiesColumns.includes(col))
  const propertiesOnly = propertiesColumns.filter(col => !appPropertiesColumns.includes(col))
  const appPropertiesOnly = appPropertiesColumns.filter(col => !propertiesColumns.includes(col))

  console.log('\n🔗 COLUMN ANALYSIS:')
  console.log(`Common columns (${commonColumns.length}): ${commonColumns.join(', ')}`)
  console.log(`Properties only (${propertiesOnly.length}): ${propertiesOnly.join(', ')}`)
  console.log(`App-Properties only (${appPropertiesOnly.length}): ${appPropertiesOnly.join(', ')}`)

  // Data type differences for common columns
  console.log('\n📋 DATA TYPE DIFFERENCES:')
  commonColumns.forEach(colName => {
    const propCol = propertiesSchema.columns.find(c => c.column_name === colName)
    const appCol = appPropertiesSchema.columns.find(c => c.column_name === colName)
    
    if (propCol && appCol && propCol.data_type !== appCol.data_type) {
      console.log(`  - ${colName}: properties(${propCol.data_type}) vs App-Properties(${appCol.data_type})`)
    }
  })

  // Sample data comparison
  if (propertiesSchema.sampleData.length > 0) {
    console.log('\n📄 PROPERTIES SAMPLE DATA:')
    console.log(JSON.stringify(propertiesSchema.sampleData[0], null, 2))
  }

  if (appPropertiesSchema.sampleData.length > 0) {
    console.log('\n📄 APP-PROPERTIES SAMPLE DATA:')
    console.log(JSON.stringify(appPropertiesSchema.sampleData[0], null, 2))
  }

  // Migration recommendations
  console.log('\n💡 MIGRATION RECOMMENDATIONS:')
  console.log('1. Canonical schema should be based on App-Properties (your main dataset)')
  console.log('2. Add missing columns from properties table to App-Properties')
  console.log('3. Normalize data types for consistency')
  console.log('4. Create supporting tables (images, hosts, reviews, amenities, categories)')
  console.log('5. Set up proper foreign key relationships')
  console.log('6. Migrate data from properties to App-Properties structure')
  console.log('7. Update API endpoints to use unified schema')

  return {
    propertiesSchema,
    appPropertiesSchema,
    commonColumns,
    propertiesOnly,
    appPropertiesOnly
  }
}

async function main() {
  console.log('🚀 Starting schema analysis...')
  
  try {
    await compareSchemas()
  } catch (error) {
    console.error('❌ Analysis failed:', error)
  }
}

main().catch(console.error)
