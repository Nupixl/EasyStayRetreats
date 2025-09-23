const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Load the existing data
const dataPath = path.join(__dirname, '../data.json')
const properties = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

async function migrateData() {
  console.log(`Starting migration of ${properties.length} properties...`)

  try {
    // First, create all unique amenities
    const allAmenities = new Set()
    properties.forEach(property => {
      if (property.amenities) {
        property.amenities.forEach(amenity => allAmenities.add(amenity.trim()))
      }
    })

    console.log(`Creating ${allAmenities.size} amenities...`)
    const amenityMap = new Map()
    
    for (const amenityName of allAmenities) {
      const { data: amenity, error } = await supabase
        .from('amenities')
        .insert({ name: amenityName })
        .select()
        .single()
      
      if (error && !error.message.includes('duplicate key')) {
        console.error('Error creating amenity:', error)
      } else if (amenity) {
        amenityMap.set(amenityName, amenity.id)
      }
    }

    // Get existing amenities if they already exist
    const { data: existingAmenities } = await supabase.from('amenities').select('*')
    existingAmenities?.forEach(amenity => {
      amenityMap.set(amenity.name, amenity.id)
    })

    // Create all unique hosts
    const hostMap = new Map()
    
    for (const property of properties) {
      if (property.user?.name) {
        const hostName = property.user.name.replace('Hosted by ', '').trim()
        const hostData = {
          name: hostName,
          profile_image_url: property.user.profile?.url?.trim() || null,
          joined_at: property.user.joinedAt?.trim() || null,
          review_count: parseInt(property.user.reviews?.replace(/\D/g, '') || '0')
        }

        if (!hostMap.has(hostName)) {
          const { data: host, error } = await supabase
            .from('hosts')
            .insert(hostData)
            .select()
            .single()
          
          if (error && !error.message.includes('duplicate key')) {
            console.error('Error creating host:', error)
          } else if (host) {
            hostMap.set(hostName, host.id)
          }
        }
      }
    }

    // Get existing hosts if they already exist
    const { data: existingHosts } = await supabase.from('hosts').select('*')
    existingHosts?.forEach(host => {
      hostMap.set(host.name, host.id)
    })

    // Create properties
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      console.log(`Migrating property ${i + 1}/${properties.length}: ${property.title}`)

      // Extract price number from string
      const priceMatch = property.price?.match(/\$?(\d+(?:\.\d{2})?)/)
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0

      // Extract rating number
      const rating = property.rating ? parseFloat(property.rating.trim()) : null

      // Extract review count
      const reviewCount = parseInt(property.review?.replace(/\D/g, '') || '0')

      const propertyData = {
        title: property.title?.trim() || '',
        rating: rating,
        review_count: reviewCount,
        location: property.lt?.trim() || '',
        price: price,
        about: property.about?.trim() || '',
        latitude: property.geolocation?.lat || 0,
        longitude: property.geolocation?.lng || 0
      }

      const { data: newProperty, error: propertyError } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single()

      if (propertyError) {
        console.error('Error creating property:', propertyError)
        continue
      }

      // Create property images
      if (property.images && property.images.length > 0) {
        const imageData = property.images.map((img, index) => ({
          property_id: newProperty.id,
          url: img.url?.trim() || '',
          order_index: index
        }))

        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imageData)

        if (imagesError) {
          console.error('Error creating property images:', imagesError)
        }
      }

      // Link property to host
      if (property.user?.name) {
        const hostName = property.user.name.replace('Hosted by ', '').trim()
        const hostId = hostMap.get(hostName)
        
        if (hostId) {
          const { error: hostError } = await supabase
            .from('property_hosts')
            .insert({
              property_id: newProperty.id,
              host_id: hostId
            })

          if (hostError) {
            console.error('Error linking property to host:', hostError)
          }
        }
      }

      // Create reviews
      if (property.reviews && property.reviews.length > 0) {
        const reviewData = property.reviews.map(review => ({
          property_id: newProperty.id,
          user_name: review.user?.name?.trim() || '',
          user_profile_image_url: review.user?.profile?.url?.trim() || null,
          review_text: review.reivew?.trim() || ''
        }))

        const { error: reviewsError } = await supabase
          .from('reviews')
          .insert(reviewData)

        if (reviewsError) {
          console.error('Error creating reviews:', reviewsError)
        }
      }

      // Link amenities
      if (property.amenities && property.amenities.length > 0) {
        const amenityLinks = property.amenities
          .map(amenity => amenity.trim())
          .filter(amenity => amenity)
          .map(amenity => ({
            property_id: newProperty.id,
            amenity_id: amenityMap.get(amenity)
          }))
          .filter(link => link.amenity_id)

        if (amenityLinks.length > 0) {
          const { error: amenitiesError } = await supabase
            .from('property_amenities')
            .insert(amenityLinks)

          if (amenitiesError) {
            console.error('Error linking amenities:', amenitiesError)
          }
        }
      }
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrateData()
