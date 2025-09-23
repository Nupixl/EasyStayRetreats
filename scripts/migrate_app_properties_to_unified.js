const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function parseNumber(value) {
  if (value === null || value === undefined) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function parseDate(value, fallback = null) {
  if (!value) return fallback || new Date().toISOString()
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return fallback || new Date().toISOString()
  }
  return date.toISOString()
}

function extractStateFromAddress(address) {
  if (!address) return null
  const match = address.match(/,\s*([A-Z]{2})\s+\d{5}/)
  return match ? match[1] : null
}

function buildImageList(record) {
  const candidates = [
    record.card_image,
    record.hero_slider_image_first,
    record.hero_slider_image_second,
    record.hero_slider_image_third,
    record.showcase_featured_image,
    record.showcase_images_4,
  ]

  const seen = new Set()
  const urls = []
  for (const url of candidates) {
    if (!url || typeof url !== 'string') continue
    const trimmed = url.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    urls.push(trimmed)
  }
  return urls
}

async function upsertUnifiedProperty(appProperty) {
  const stateFromAddress = extractStateFromAddress(appProperty.street_address)
  const priceStartsAt = parseNumber(appProperty.price_starts_at ?? appProperty.nightly_rate ?? appProperty.daily_rate)
  const pricePerNight = parseNumber(appProperty.nightly_rate ?? appProperty.daily_rate ?? appProperty.price_starts_at)

  const payload = {
    name: appProperty.name || appProperty.title || 'Untitled Property',
    city: appProperty.city || null,
    state: stateFromAddress,
    country: 'USA',
    address: appProperty.street_address || null,
    price_starts_at: priceStartsAt,
    price_per_night: pricePerNight,
    currency: 'USD',
    body_description: appProperty.body_description || null,
    short_description: appProperty.short_description || null,
    property_type: appProperty.room_types || null,
    bedrooms: parseNumber(appProperty.beds),
    bathrooms: parseNumber(appProperty.baths),
    max_guests: parseNumber(appProperty.guests),
    latitude: parseNumber(appProperty.latitude),
    longitude: parseNumber(appProperty.longitude),
    property_rating: parseNumber(appProperty.property_rating),
    total_reviews: parseNumber(appProperty.total_reviews) || 0,
    card_image: appProperty.card_image || appProperty.hero_slider_image_first || null,
    whalesync_postgres_id: appProperty.whalesync_postgres_id || null,
    external_id: appProperty.webflow_record_id || appProperty.slug || appProperty.whalesync_postgres_id || null,
    is_active: (appProperty.webflow_status || '').toLowerCase() === 'active',
    is_featured: Boolean(appProperty.popular || appProperty.deal),
    availability_status: appProperty.availability === false ? 'unavailable' : 'available',
    created_at: parseDate(appProperty.created),
    updated_at: parseDate(appProperty.last_updated, parseDate(appProperty.created)),
  }

  const selectors = []
  if (appProperty.whalesync_postgres_id) {
    selectors.push({ column: 'whalesync_postgres_id', value: appProperty.whalesync_postgres_id })
  }
  if (appProperty.webflow_record_id) {
    selectors.push({ column: 'external_id', value: appProperty.webflow_record_id })
  }

  let existingId = null
  for (const selector of selectors) {
    const { data: existingRows, error: lookupError } = await supabase
      .from('unified_properties')
      .select('id')
      .eq(selector.column, selector.value)
      .limit(1)

    if (lookupError) {
      console.error('⚠️  Failed to look up existing property:', lookupError.message)
      continue
    }

    if (existingRows && existingRows.length > 0) {
      existingId = existingRows[0].id
      break
    }
  }

  if (existingId) {
    const { error: updateError } = await supabase
      .from('unified_properties')
      .update({
        ...payload,
        created_at: undefined, // preserve original created_at
      })
      .eq('id', existingId)

    if (updateError) {
      throw new Error(`Failed to update property ${payload.name}: ${updateError.message}`)
    }

    return { id: existingId, wasUpdate: true }
  }

  const { data: inserted, error: insertError } = await supabase
    .from('unified_properties')
    .insert([payload])
    .select('id')
    .limit(1)

  if (insertError) {
    throw new Error(`Failed to insert property ${payload.name}: ${insertError.message}`)
  }

  const newId = inserted?.[0]?.id || null
  return { id: newId, wasUpdate: false }
}

async function replacePropertyImages(propertyId, imageUrls) {
  if (!propertyId) return

  await supabase
    .from('property_images')
    .delete()
    .eq('property_id', propertyId)

  if (!imageUrls || imageUrls.length === 0) {
    return
  }

  const payload = imageUrls.map((url, index) => ({
    property_id: propertyId,
    url,
    alt_text: null,
    caption: null,
    display_order: index,
    is_hero: index === 0,
  }))

  const { error } = await supabase
    .from('property_images')
    .insert(payload)

  if (error) {
    throw new Error(`Failed to insert property images for ${propertyId}: ${error.message}`)
  }
}

async function migrate() {
  console.log('🚀 Starting migration from App-Properties → unified_properties')

  const { data: appProperties, error: fetchError } = await supabase
    .from('App-Properties')
    .select('*')

  if (fetchError) {
    console.error('❌ Failed to fetch App-Properties data:', fetchError.message)
    process.exit(1)
  }

  if (!appProperties || appProperties.length === 0) {
    console.log('⚠️  No records found in App-Properties. Nothing to migrate.')
    return
  }

  const { data: existingUnified, error: countError } = await supabase
    .from('unified_properties')
    .select('id')
    .limit(1)

  if (countError) {
    console.error('❌ Failed to inspect unified_properties:', countError.message)
    process.exit(1)
  }

  if (existingUnified && existingUnified.length > 0) {
    console.log('⚠️  unified_properties already contains data.')
    console.log('    The script will upsert records based on whalesync_postgres_id, updating existing rows as needed.')
  }

  let insertedCount = 0
  let updatedCount = 0
  let imageCount = 0
  const failures = []

  for (const record of appProperties) {
    try {
      const result = await upsertUnifiedProperty(record)
      const propertyId = result?.id
      if (!propertyId) {
        console.warn('⚠️  Skipping record with no property ID:', record.name)
        continue
      }

      const images = buildImageList(record)
      await replacePropertyImages(propertyId, images)
      if (images.length > 0) {
        imageCount += images.length
      }

      if (result.wasUpdate) {
        updatedCount += 1
      } else {
        insertedCount += 1
      }

      console.log(`✅ Processed property: ${record.name || propertyId}`)
    } catch (error) {
      console.error(`❌ Failed to migrate property ${record.name || record.whalesync_postgres_id}:`, error.message)
      failures.push({ id: record.whalesync_postgres_id, name: record.name, error: error.message })
    }
  }

  console.log('\n🎉 Migration summary')
  console.log(`   Properties processed: ${appProperties.length}`)
  console.log(`   Inserted: ${insertedCount}`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Images inserted: ${imageCount}`)

  if (failures.length > 0) {
    console.log('\n⚠️  Failures:')
    failures.forEach((failure) => {
      console.log(`   - ${failure.name || failure.id}: ${failure.error}`)
    })
  }

  const { count: unifiedCount, error: unifiedError } = await supabase
    .from('unified_properties')
    .select('*', { count: 'exact', head: true })

  if (unifiedError) {
    console.error('⚠️  Unable to fetch unified_properties count:', unifiedError.message)
  } else {
    console.log(`\n📊 unified_properties total rows: ${unifiedCount ?? 'unknown'}`)
  }

  console.log('\n✅ Migration routine finished.')
}

migrate().catch((error) => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})
