const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Supabase environment variables are not set.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

// Field mapping from properties to App-Properties
const fieldMapping = {
  'title': 'name',
  'location': 'city',
  'price': 'price_starts_at',
  'about': 'body_description',
  'latitude': 'latitude',
  'longitude': 'longitude',
  'rating': 'property_rating',
  'review_count': 'total_reviews',
  'created_at': 'created'
}

// Default values for App-Properties fields that don't exist in properties
const defaultValues = {
  availability: true,
  webflow_status: 'Active',
  account_owner: 'Easy Stay Retreats',
}

async function fetchPropertiesData() {
  console.log('📋 Fetching data from properties table...')
  const { data: properties, error } = await supabaseAdmin
    .from('properties')
    .select('*')

  if (error) {
    console.error('❌ Error fetching properties:', error)
    return null
  }

  console.log(`✅ Found ${properties.length} records in properties table`)
  return properties
}

async function fetchAppPropertiesData() {
  console.log('📋 Fetching data from App-Properties table...')
  const { data: appProperties, error } = await supabaseAdmin
    .from('App-Properties')
    .select('*')

  if (error) {
    console.error('❌ Error fetching App-Properties:', error)
    return null
  }

  console.log(`✅ Found ${appProperties.length} records in App-Properties table`)
  return appProperties
}

async function fetchPropertyImages() {
  console.log('📋 Fetching property images...')
  const { data: images, error } = await supabaseAdmin
    .from('property_images')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ Error fetching property images:', error)
    return null
  }

  console.log(`✅ Found ${images.length} image records`)
  return images
}

const mapFieldValue = (property, fromField, toField) => {
  if (property[fromField] === undefined || property[fromField] === null) {
    return undefined
  }

  let value = property[fromField]

  if (toField === 'property_rating' && typeof value === 'number') {
    value = Math.round(value)
  }

  return value
}

function buildInsertPayload(property, images = []) {
  const payload = { ...defaultValues }
  payload.whalesync_postgres_id = property.id

  Object.entries(fieldMapping).forEach(([fromField, toField]) => {
    const value = mapFieldValue(property, fromField, toField)
    if (value !== undefined) {
      payload[toField] = value
    }
  })

  if (!payload.slug && payload.name) {
    payload.slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  if (!payload.street_address) {
    payload.street_address = property.location || payload.city || ''
  }

  if (payload.body_description && !payload.short_description) {
    payload.short_description = `${payload.body_description.substring(0, 100)}...`
  }

  const propertyImages = images.filter((img) => img.property_id === property.id)
  if (propertyImages.length > 0) {
    payload.card_image = propertyImages[0].url
    if (propertyImages.length > 1) payload.hero_slider_image_first = propertyImages[1].url
    if (propertyImages.length > 2) payload.hero_slider_image_second = propertyImages[2].url
    if (propertyImages.length > 3) payload.hero_slider_image_third = propertyImages[3].url
  }

  return payload
}

function buildUpdatePayload(property, images = [], existingProperty) {
  const updates = {}

  Object.entries(fieldMapping).forEach(([fromField, toField]) => {
    const value = mapFieldValue(property, fromField, toField)
    if (value !== undefined) {
      updates[toField] = value
    }
  })

  const propertyImages = images.filter((img) => img.property_id === property.id)
  if (propertyImages.length > 0) {
    if (!existingProperty?.card_image) {
      updates.card_image = propertyImages[0].url
    }
    if (!existingProperty?.hero_slider_image_first && propertyImages[1]) {
      updates.hero_slider_image_first = propertyImages[1].url
    }
    if (!existingProperty?.hero_slider_image_second && propertyImages[2]) {
      updates.hero_slider_image_second = propertyImages[2].url
    }
    if (!existingProperty?.hero_slider_image_third && propertyImages[3]) {
      updates.hero_slider_image_third = propertyImages[3].url
    }
  }

  if (!existingProperty?.slug && property.title) {
    updates.slug = property.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  if (!existingProperty?.street_address && property.location) {
    updates.street_address = property.location
  }

  if (!existingProperty?.short_description && property.about) {
    updates.short_description = `${property.about.substring(0, 100)}...`
  }

  if (Object.keys(updates).length === 0) {
    return null
  }

  return updates
}

async function mergeProperties() {
  console.log('🚀 Starting enhanced properties merge process...')

  // Fetch existing data
  const properties = await fetchPropertiesData()
  if (!properties) return

  const appProperties = await fetchAppPropertiesData()
  if (!appProperties) return

  const images = await fetchPropertyImages()
  if (!images) return

  // Create a map of existing App-Properties for updates
  const existingProperties = new Map()
  appProperties.forEach(prop => {
    if (prop.whalesync_postgres_id) {
      existingProperties.set(prop.whalesync_postgres_id, prop)
      existingProperties.set(prop.id, prop)
    }
  })

  let insertedCount = 0
  let updatedCount = 0
  let skippedCount = 0
  const errors = []

  console.log('\n🔄 Processing properties...')

  for (const property of properties) {
    try {
      const existingProperty = existingProperties.get(property.id)

      if (existingProperty) {
        // Update existing property
        console.log(`🔄 Updating existing property: ${property.title}`)
        const updates = buildUpdatePayload(property, images, existingProperty)
        if (!updates || Object.keys(updates).length === 0) {
          console.log(`ℹ️  No changes needed for ${property.title}`)
          skippedCount++
          continue
        }

        const { data, error } = await supabaseAdmin
          .from('App-Properties')
          .update(updates)
          .eq('whalesync_postgres_id', property.id)
          .select()

        if (error) {
          console.error(`❌ Error updating ${property.title}:`, error)
          errors.push({ property: property.title, error: error.message, action: 'update' })
          continue
        }

        console.log(`✅ Updated: ${property.title}`)
        updatedCount++
      } else {
        // Insert new property
        console.log(`➕ Inserting new property: ${property.title}`)
        const insertPayload = buildInsertPayload(property, images)
        const { data, error } = await supabaseAdmin
          .from('App-Properties')
          .insert([insertPayload])
          .select()

        if (error) {
          console.error(`❌ Error inserting ${property.title}:`, error)
          errors.push({ property: property.title, error: error.message, action: 'insert' })
          continue
        }

        console.log(`✅ Inserted: ${property.title}`)
        insertedCount++
        existingProperties.set(property.id, insertPayload)
      }

    } catch (error) {
      console.error(`❌ Unexpected error processing ${property.title}:`, error)
      errors.push({ property: property.title, error: error.message, action: 'unknown' })
    }
  }

  // Summary
  console.log('\n📊 Enhanced Merge Summary:')
  console.log(`✅ Inserted: ${insertedCount} properties`)
  console.log(`🔄 Updated: ${updatedCount} properties`)
  console.log(`⚠️  Skipped: ${skippedCount} properties`)
  console.log(`❌ Errors: ${errors.length} properties`)

  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    errors.forEach(({ property, error, action }) => {
      console.log(`  - ${property} (${action}): ${error}`)
    })
  }

  console.log('\n🎉 Enhanced merge process completed!')
  return { insertedCount, updatedCount, skippedCount, errors }
}

mergeProperties().catch(console.error)
