#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🚀 EasyStay Retreats - Supabase Environment Setup\n')

console.log('This script will help you set up your Supabase environment variables.\n')

console.log('First, you need to:')
console.log('1. Go to https://supabase.com and create a new project')
console.log('2. Get your project URL and API keys from Project Settings → API')
console.log('3. Run the database schema from supabase-schema.sql in the SQL Editor\n')

const questions = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    prompt: 'Enter your Supabase Project URL (e.g., https://your-project.supabase.co): ',
    validate: (value) => value.startsWith('https://') && value.includes('supabase.co')
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    prompt: 'Enter your Supabase Anon Key: ',
    validate: (value) => value.length > 50
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    prompt: 'Enter your Supabase Service Role Key: ',
    validate: (value) => value.length > 50
  }
]

const envVars = {}

function askQuestion(index) {
  if (index >= questions.length) {
    createEnvFile()
    return
  }

  const question = questions[index]
  rl.question(question.prompt, (answer) => {
    if (question.validate(answer.trim())) {
      envVars[question.key] = answer.trim()
      askQuestion(index + 1)
    } else {
      console.log('❌ Invalid input. Please try again.\n')
      askQuestion(index)
    }
  })
}

function createEnvFile() {
  const envPath = path.join(__dirname, '../.env.local')
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${envVars.NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${envVars.SUPABASE_SERVICE_ROLE_KEY}

# Google Maps API Key (optional)
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_google_maps_api_key
`

  try {
    fs.writeFileSync(envPath, envContent)
    console.log('\n✅ Environment file created successfully!')
    console.log('📁 Location: .env.local')
    console.log('\n📋 Next steps:')
    console.log('1. Run the database schema in Supabase SQL Editor')
    console.log('2. Run: node scripts/migrate-to-supabase.js')
    console.log('3. Start your app: npm run dev')
    console.log('\n🎉 Your app will now use Supabase instead of JSON data!')
  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message)
  }

  rl.close()
}

// Start the setup
askQuestion(0)
