#!/usr/bin/env node

/**
 * Webflow Environment Setup
 * 
 * This script helps set up the required environment variables
 * for Webflow CMS integration.
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupWebflowEnvironment() {
  console.log('🚀 Setting up Webflow CMS Environment Variables')
  console.log('=' * 50)
  
  console.log('\n📋 Required Information:')
  console.log('1. WEBFLOW_API_TOKEN - Your Webflow API token')
  console.log('2. WEBFLOW_SITE_ID - Your Webflow site ID')
  console.log('')
  
  console.log('🔗 How to get your credentials:')
  console.log('1. Go to https://webflow.com/account/settings')
  console.log('2. Click on "Integrations" tab')
  console.log('3. Generate an API token')
  console.log('4. Get your site ID from your project settings')
  console.log('')
  
  try {
    const apiToken = await question('Enter your Webflow API Token: ')
    const siteId = await question('Enter your Webflow Site ID: ')
    
    if (!apiToken || !siteId) {
      console.log('❌ Both API token and Site ID are required!')
      process.exit(1)
    }
    
    // Read existing .env.local or create new one
    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = ''
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }
    
    // Update or add Webflow variables
    const lines = envContent.split('\n')
    const updatedLines = []
    let webflowTokenFound = false
    let webflowSiteFound = false
    
    for (const line of lines) {
      if (line.startsWith('WEBFLOW_API_TOKEN=')) {
        updatedLines.push(`WEBFLOW_API_TOKEN=${apiToken}`)
        webflowTokenFound = true
      } else if (line.startsWith('WEBFLOW_SITE_ID=')) {
        updatedLines.push(`WEBFLOW_SITE_ID=${siteId}`)
        webflowSiteFound = true
      } else {
        updatedLines.push(line)
      }
    }
    
    // Add new variables if not found
    if (!webflowTokenFound) {
      updatedLines.push(`WEBFLOW_API_TOKEN=${apiToken}`)
    }
    if (!webflowSiteFound) {
      updatedLines.push(`WEBFLOW_SITE_ID=${siteId}`)
    }
    
    // Write updated .env.local
    fs.writeFileSync(envPath, updatedLines.join('\n'))
    
    console.log('\n✅ Environment variables added to .env.local')
    console.log('')
    console.log('🧪 Test your setup:')
    console.log('   npm run check-webflow-cms')
    console.log('')
    console.log('🔧 Setup Rich Text fields:')
    console.log('   npm run setup-webflow-rtf')
    console.log('')
    console.log('📚 Read the documentation:')
    console.log('   docs/WEBFLOW_CMS_FIELD_TYPES.md')
    
  } catch (error) {
    console.error('❌ Error setting up environment:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Run the setup
if (require.main === module) {
  setupWebflowEnvironment()
}

module.exports = { setupWebflowEnvironment }

