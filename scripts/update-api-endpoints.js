const fs = require('fs')
const path = require('path')

// API endpoint templates for unified schema
const apiTemplates = {
  'pages/api/properties/index.js': `import { supabase, isSupabaseConfigured } from '../../../lib/supabase'
import fallbackData from '../../../data.json'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using fallback data')
        const time = Math.floor(Math.random() * 1000);
        setTimeout(() => {
          return res.json({ success: true, data: fallbackData });
        }, time);
        return;
      }

      const { data: properties, error } = await supabase
        .from('unified_properties')
        .select(\`
          *,
          property_images(*),
          property_hosts(
            hosts(*)
          ),
          property_amenities(
            amenities(*)
          ),
          property_categories(
            categories(*)
          )
        \`)
        .eq('is_active', true)
        .order('created', { ascending: false })

      if (error) {
        console.error('Error fetching properties:', error)
        return res.status(500).json({ success: false, error: error.message })
      }

      // Transform the data to match the expected format
      const transformedProperties = (properties || []).map(property => ({
        _id: property.id,
        title: property.name,
        rating: property.property_rating?.toString() || '4.5',
        review: \`\${property.total_reviews || 0} review\${property.total_reviews !== 1 ? 's' : ''}\`,
        lt: property.city,
        images: property.property_images?.map(img => ({ url: img.url })) || [{ url: '/images/default_image.png' }],
        price: \`$\${property.price_starts_at}\`,
        about: property.body_description,
        user: property.property_hosts?.[0]?.hosts ? {
          name: property.property_hosts[0].hosts.name,
          profile_image_url: property.property_hosts[0].hosts.profile_image_url
        } : null,
        reviews: [], // Will be populated separately if needed
        geolocation: {
          lat: property.latitude,
          lng: property.longitude
        },
        amenities: property.property_amenities?.map(pa => pa.amenities?.name).filter(Boolean) || []
      }))

      return res.json({ success: true, data: transformedProperties })
    } catch (error) {
      console.error('Unexpected error:', error)
      return res.status(500).json({ success: false, error: 'Internal server error' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}`,

  'pages/api/properties/search.js': `import { supabase, isSupabaseConfigured } from '../../../lib/supabase'
import fallbackData from '../../../data.json'

// Fallback search function using original logic
function handleFallbackSearch(req, res) {
  const { markers, error: parseError } = parseMarkers(req.query)

  if (parseError) {
    return res.status(400).json({ success: false, error: parseError })
  }

  if (markers.length < 4) {
    return res
      .status(400)
      .json({ success: false, error: "Incomplete bounds payload" })
  }

  const calcLocation = (lat, lng) => {
    if (
      +lat < +markers[0].latitude &&
      +lat > +markers[2].latitude &&
      +lng > +markers[0].longitude &&
      +lng < +markers[3].longitude
    ) {
      return true;
    } else {
      return false;
    }
  };

  let result;
  const newP = new Promise((r) => {
    if (true) {
      setTimeout(() => {
        r(
          (result = fallbackData
            .map((post) => {
              const res = calcLocation(
                post.geolocation.lat,
                post.geolocation.lng
              );
              if (res) {
                return post;
              } else {
                return null;
              }
            })
            .filter((e) => e !== null))
        );
      }, Math.floor(Math.random() * 800));
    }
  });
  newP
    .then((response) => res.json({ success: true, data: response }))
    .catch((err) => res.json({ success: false, data: null }));
}

const parseMarkers = (query) => {
  const rawMarkers = query["data[]"] ?? query.data;

  const fromSerialized = (input) => {
    const serialized = Array.isArray(input) ? input : [input];

    try {
      const markers = serialized.map((entry) => {
        const value = typeof entry === "string" ? JSON.parse(entry) : entry;
        return {
          latitude: Number(value?.lat),
          longitude: Number(value?.lng),
        };
      });

      if (markers.some((marker) => !Number.isFinite(marker.latitude) || !Number.isFinite(marker.longitude))) {
        return { error: "Invalid bounds payload" };
      }

      return { markers };
    } catch (_err) {
      return { error: "Invalid bounds payload" };
    }
  };

  if (rawMarkers) {
    return fromSerialized(rawMarkers);
  }

  const bracketEntries = Object.entries(query).filter(([key]) => key.startsWith("data["));

  if (bracketEntries.length === 0) {
    return { error: "Missing map bounds payload" };
  }

  const markerMap = {};

  for (const [key, value] of bracketEntries) {
    const match = key.match(/^data\[(\d+)\]\[(lat|lng)\]$/);
    if (!match) {
      continue;
    }

    const [, index, coordKey] = match;
    const normalizedValue = Array.isArray(value) ? value[0] : value;

    if (!markerMap[index]) {
      markerMap[index] = {};
    }

    markerMap[index][coordKey] = Number(normalizedValue);
  }

  const markers = Object.keys(markerMap)
    .map((idx) => Number(idx))
    .sort((a, b) => a - b)
    .map((idx) => ({
      latitude: markerMap[idx]?.lat,
      longitude: markerMap[idx]?.lng,
    }));

  if (
    markers.length === 0 ||
    markers.some(
      (marker) =>
        !Number.isFinite(marker.latitude) || !Number.isFinite(marker.longitude)
    )
  ) {
    return { error: "Invalid bounds payload" };
  }

  return { markers };
};

export default async function handler(req, res) {
  if (req.method === 'HEAD') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using fallback search')
        return handleFallbackSearch(req, res)
      }

      const { markers, error: parseError } = parseMarkers(req.query)

      if (!supabase) {
        throw new Error('Supabase client unavailable on the server')
      }

      if (parseError) {
        return res.status(400).json({ success: false, error: parseError })
      }

      if (markers.length < 4) {
        return res
          .status(400)
          .json({ success: false, error: "Incomplete bounds payload" })
      }

      // Calculate bounds from markers
      const minLat = Math.min(...markers.map(m => m.latitude))
      const maxLat = Math.max(...markers.map(m => m.latitude))
      const minLng = Math.min(...markers.map(m => m.longitude))
      const maxLng = Math.max(...markers.map(m => m.longitude))

      const { data: properties, error } = await supabase
        .from('unified_properties')
        .select(\`
          *,
          property_images(*),
          property_hosts(
            hosts(*)
          ),
          property_amenities(
            amenities(*)
          )
        \`)
        .eq('is_active', true)
        .gte('latitude', minLat)
        .lte('latitude', maxLat)
        .gte('longitude', minLng)
        .lte('longitude', maxLng)

      if (error) {
        console.error('Error searching properties:', error)
        return res.status(500).json({ success: false, error: error.message })
      }

      // Transform the data to match the expected format
      const transformedProperties = (properties || []).map(property => ({
        _id: property.id,
        title: property.name,
        rating: property.property_rating?.toString() || '4.5',
        review: \`\${property.total_reviews || 0} review\${property.total_reviews !== 1 ? 's' : ''}\`,
        lt: property.city,
        images: property.property_images?.map(img => ({ url: img.url })) || [{ url: '/images/default_image.png' }],
        price: \`$\${property.price_starts_at}\`,
        about: property.body_description,
        user: property.property_hosts?.[0]?.hosts ? {
          name: property.property_hosts[0].hosts.name,
          profile_image_url: property.property_hosts[0].hosts.profile_image_url
        } : null,
        reviews: [],
        geolocation: {
          lat: property.latitude,
          lng: property.longitude,
        },
        amenities: property.property_amenities?.map(pa => pa.amenities?.name).filter(Boolean) || [],
      }))

      // Add artificial delay to match original behavior
      const delay = Math.floor(Math.random() * 800)
      setTimeout(() => {
        res.json({ success: true, data: transformedProperties })
      }, delay)
      
      return // Important: return here to prevent further execution
    } catch (error) {
      console.error('Unexpected error:', error)
      return res.status(500).json({ success: false, error: error.message || 'Internal server error' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}`,

  'pages/api/properties/[id].js': `import { supabase, isSupabaseConfigured } from '../../../lib/supabase'
import fallbackData from '../../../data.json'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using fallback data')
        const property = fallbackData.find(p => p._id === id)
        if (!property) {
          return res.status(404).json({ success: false, error: 'Property not found' })
        }
        return res.json({ success: true, data: property })
      }

      const { data: property, error } = await supabase
        .from('unified_properties')
        .select(\`
          *,
          property_images(*),
          property_hosts(
            hosts(*)
          ),
          property_amenities(
            amenities(*)
          ),
          property_categories(
            categories(*)
          ),
          reviews(*)
        \`)
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching property:', error)
        return res.status(404).json({ success: false, error: 'Property not found' })
      }

      // Transform the data to match the expected format
      const transformedProperty = {
        _id: property.id,
        title: property.name,
        rating: property.property_rating?.toString() || '4.5',
        review: \`\${property.total_reviews || 0} review\${property.total_reviews !== 1 ? 's' : ''}\`,
        lt: property.city,
        images: property.property_images?.map(img => ({ url: img.url })) || [{ url: '/images/default_image.png' }],
        price: \`$\${property.price_starts_at}\`,
        about: property.body_description,
        user: property.property_hosts?.[0]?.hosts ? {
          name: property.property_hosts[0].hosts.name,
          profile_image_url: property.property_hosts[0].hosts.profile_image_url,
          bio: property.property_hosts[0].hosts.bio,
          is_superhost: property.property_hosts[0].hosts.is_superhost,
          response_rate: property.property_hosts[0].hosts.response_rate,
          response_time: property.property_hosts[0].hosts.response_time
        } : null,
        reviews: property.reviews?.map(review => ({
          user_name: review.user_name,
          user_profile_image_url: review.user_profile_image_url,
          review_text: review.review_text,
          rating: review.rating,
          created_at: review.created_at
        })) || [],
        geolocation: {
          lat: property.latitude,
          lng: property.longitude
        },
        amenities: property.property_amenities?.map(pa => pa.amenities?.name).filter(Boolean) || [],
        categories: property.property_categories?.map(pc => pc.categories?.name).filter(Boolean) || []
      }

      return res.json({ success: true, data: transformedProperty })
    } catch (error) {
      console.error('Unexpected error:', error)
      return res.status(500).json({ success: false, error: 'Internal server error' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}`
}

async function updateApiEndpoints() {
  console.log('🔄 Updating API endpoints for unified schema...')
  
  let successCount = 0
  let errorCount = 0
  
  for (const [filePath, content] of Object.entries(apiTemplates)) {
    try {
      const fullPath = path.join(process.cwd(), filePath)
      
      // Create directory if it doesn't exist
      const dir = path.dirname(fullPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      // Write the file
      fs.writeFileSync(fullPath, content)
      console.log(\`✅ Updated \${filePath}\`)
      successCount++
      
    } catch (error) {
      console.error(\`❌ Error updating \${filePath}:\`, error)
      errorCount++
    }
  }
  
  console.log(\`\\n📊 API Update Summary:\`)
  console.log(\`  ✅ Successfully updated: \${successCount} files\`)
  console.log(\`  ❌ Failed to update: \${errorCount} files\`)
  
  if (errorCount === 0) {
    console.log('\\n🎉 All API endpoints updated successfully!')
    console.log('\\n📋 Next steps:')
    console.log('  1. Test the application to ensure everything works')
    console.log('  2. Check that the map search is working')
    console.log('  3. Verify property detail pages load correctly')
    console.log('  4. Test the fallback mechanism if needed')
  } else {
    console.log('\\n⚠️  Some API endpoints failed to update. Check the errors above.')
  }
}

// Run the update
updateApiEndpoints().catch(console.error)
