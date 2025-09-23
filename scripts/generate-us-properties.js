const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Sample US properties data
const usProperties = [
  {
    title: "Cozy Mountain Cabin in Shenandoah",
    rating: 4.8,
    review_count: 127,
    location: "Shenandoah National Park, Virginia",
    price: 185.00,
    about: "Escape to this charming cabin nestled in the Blue Ridge Mountains. Perfect for hiking, stargazing, and reconnecting with nature.",
    latitude: 38.2923,
    longitude: -78.6756,
    images: [
      { url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800", alt_text: "Mountain cabin exterior" },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", alt_text: "Cabin interior" }
    ]
  },
  {
    title: "Historic Downtown Loft",
    rating: 4.9,
    review_count: 89,
    location: "Richmond, Virginia",
    price: 145.00,
    about: "Stylish loft in the heart of Richmond's historic district. Walking distance to restaurants, museums, and nightlife.",
    latitude: 37.5407,
    longitude: -77.4360,
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", alt_text: "Modern loft interior" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", alt_text: "Loft kitchen" }
    ]
  },
  {
    title: "Beachfront Cottage in Virginia Beach",
    rating: 4.7,
    review_count: 203,
    location: "Virginia Beach, Virginia",
    price: 220.00,
    about: "Wake up to ocean views in this charming beachfront cottage. Perfect for families and beach lovers.",
    latitude: 36.8529,
    longitude: -75.9780,
    images: [
      { url: "https://images.unsplash.com/photo-1520637836862-4d197d17c0a4?w=800", alt_text: "Beach cottage" },
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", alt_text: "Ocean view" }
    ]
  },
  {
    title: "Luxury Penthouse in Arlington",
    rating: 4.9,
    review_count: 156,
    location: "Arlington, Virginia",
    price: 295.00,
    about: "High-end penthouse with stunning DC skyline views. Modern amenities and premium location.",
    latitude: 38.8816,
    longitude: -77.0910,
    images: [
      { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", alt_text: "Penthouse living room" },
      { url: "https://images.unsplash.com/photo-1560448204-17c6bb9c5d09?w=800", alt_text: "City skyline view" }
    ]
  },
  {
    title: "Rustic Farmhouse in Charlottesville",
    rating: 4.6,
    review_count: 94,
    location: "Charlottesville, Virginia",
    price: 165.00,
    about: "Charming farmhouse on 5 acres with vineyard views. Perfect for wine country getaways.",
    latitude: 38.0293,
    longitude: -78.4767,
    images: [
      { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", alt_text: "Farmhouse exterior" },
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", alt_text: "Vineyard view" }
    ]
  },
  {
    title: "Modern Townhouse in Alexandria",
    rating: 4.8,
    review_count: 112,
    location: "Alexandria, Virginia",
    price: 195.00,
    about: "Contemporary townhouse in Old Town Alexandria. Close to metro and historic attractions.",
    latitude: 38.8048,
    longitude: -77.0469,
    images: [
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", alt_text: "Modern townhouse" },
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", alt_text: "Townhouse interior" }
    ]
  },
  {
    title: "Mountain Retreat in Roanoke",
    rating: 4.7,
    review_count: 78,
    location: "Roanoke, Virginia",
    price: 135.00,
    about: "Peaceful mountain retreat with hiking trails and scenic views. Perfect for outdoor enthusiasts.",
    latitude: 37.2710,
    longitude: -79.9414,
    images: [
      { url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800", alt_text: "Mountain retreat" },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", alt_text: "Mountain view" }
    ]
  },
  {
    title: "Waterfront Condo in Norfolk",
    rating: 4.5,
    review_count: 134,
    location: "Norfolk, Virginia",
    price: 175.00,
    about: "Beautiful waterfront condo with marina views. Close to downtown and waterfront attractions.",
    latitude: 36.8468,
    longitude: -76.2852,
    images: [
      { url: "https://images.unsplash.com/photo-1520637836862-4d197d17c0a4?w=800", alt_text: "Waterfront condo" },
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", alt_text: "Marina view" }
    ]
  }
]

async function updateSupabaseWithUSProperties() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('🗑️  Clearing existing properties...')
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows

    if (deleteError) {
      console.error('Error clearing properties:', deleteError)
      return
    }

    console.log('✅ Cleared existing properties')

    console.log('🏠 Inserting US properties...')
    
    for (const property of usProperties) {
      // Insert property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          title: property.title,
          rating: property.rating,
          review_count: property.review_count,
          location: property.location,
          price: property.price,
          about: property.about,
          latitude: property.latitude,
          longitude: property.longitude
        })
        .select()
        .single()

      if (propertyError) {
        console.error('Error inserting property:', propertyError)
        continue
      }

      console.log(`✅ Inserted: ${property.title}`)

      // Insert images for this property
      for (const image of property.images) {
        const { error: imageError } = await supabase
          .from('property_images')
          .insert({
            property_id: propertyData.id,
            url: image.url,
            alt_text: image.alt_text
          })

        if (imageError) {
          console.error('Error inserting image:', imageError)
        }
      }
    }

    console.log('🎉 Successfully updated Supabase with US properties!')
    console.log(`📊 Inserted ${usProperties.length} properties`)

  } catch (error) {
    console.error('Error updating Supabase:', error)
  }
}

updateSupabaseWithUSProperties()
