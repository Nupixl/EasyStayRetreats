#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Supabase migration for EasyStay Retreats...\n')

// Check if .env.local exists
const envPath = path.join(__dirname, '../.env.local')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...')
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

`
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env.local file')
  console.log('⚠️  Please update the Supabase credentials in .env.local\n')
} else {
  console.log('✅ .env.local file already exists\n')
}

// Check if data.json exists
const dataPath = path.join(__dirname, '../data.json')
if (!fs.existsSync(dataPath)) {
  console.log('❌ data.json not found. Please ensure the data file exists before running migration.')
  process.exit(1)
} else {
  console.log('✅ data.json found\n')
}

console.log('📋 Next steps:')
console.log('1. Set up your Supabase project at https://supabase.com')
console.log('2. Update the credentials in .env.local')
console.log('3. Run the SQL schema: supabase-schema.sql in your Supabase SQL editor')
console.log('4. Run the migration: node scripts/migrate-to-supabase.js')
console.log('5. Test the application with: npm run dev\n')

console.log('🔧 Database Schema:')
console.log('- properties: Main property data')
console.log('- property_images: Property photos')
console.log('- hosts: Property hosts/owners')
console.log('- reviews: Property reviews')
console.log('- amenities: Available amenities')
console.log('- categories: Property categories')
console.log('- Junction tables for many-to-many relationships\n')

console.log('📊 Migration will:')
console.log('- Create all unique amenities from existing data')
console.log('- Create all unique hosts from existing data')
console.log('- Migrate all properties with relationships')
console.log('- Preserve all existing data structure\n')

console.log('✨ Ready to migrate! Run: node scripts/migrate-to-supabase.js')
