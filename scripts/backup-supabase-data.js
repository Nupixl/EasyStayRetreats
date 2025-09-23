const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables (URL and Service Role Key) are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

async function backupTable(tableName, backupDir) {
  console.log(`📋 Backing up ${tableName}...`)
  try {
    const { data, error } = await supabaseAdmin.from(tableName).select('*')
    if (error) {
      console.error(`❌ Error backing up ${tableName}:`, error)
      return { tableName, status: 'failed', error: error.message }
    }
    const filePath = path.join(backupDir, `${tableName}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`✅ Backed up ${tableName}: ${data.length} records`)
    return { tableName, status: 'success', records: data.length }
  } catch (e) {
    console.error(`❌ Unexpected error backing up ${tableName}:`, e.message)
    return { tableName, status: 'failed', error: e.message }
  }
}

async function getTableSchema(tableName) {
  try {
    const { data, error } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)

    if (error) {
      console.error(`❌ Error getting schema for ${tableName}:`, error)
      return null
    }
    return data
  } catch (e) {
    console.error(`❌ Unexpected error getting schema for ${tableName}:`, e.message)
    return null
  }
}

async function backupSupabaseData() {
  console.log('🚀 Starting Supabase backup process...')

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.join(__dirname, '..', 'backups', `backup-${timestamp}`)
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  console.log(`📁 Backup directory: ${backupDir}`)

  // Tables to backup
  const tablesToBackup = [
    'properties',
    'App-Properties',
    'property_images',
    'property_hosts',
    'property_amenities',
    'property_categories',
    'reviews',
    'hosts',
    'amenities',
    'categories'
  ]

  const results = []

  // Backup data
  for (const tableName of tablesToBackup) {
    const result = await backupTable(tableName, backupDir)
    results.push(result)
  }

  // Backup schemas
  console.log('\n📋 Backing up table schemas...')
  for (const tableName of tablesToBackup) {
    const schema = await getTableSchema(tableName)
    if (schema) {
      const schemaPath = path.join(backupDir, `${tableName}-schema.json`)
      fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2))
      console.log(`✅ Backed up schema for ${tableName}`)
    }
  }

  // Summary
  console.log('\n📊 Backup Summary:')
  results.forEach(result => {
    if (result.status === 'success') {
      console.log(`✅ ${result.tableName}: ${result.records} records`)
    } else {
      console.log(`❌ ${result.tableName}: ${result.error}`)
    }
  })

  console.log(`\n🎉 Backup completed! Files saved to: ${backupDir}`)
}

backupSupabaseData().catch(console.error)