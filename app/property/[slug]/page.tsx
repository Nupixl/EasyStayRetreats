import { Property } from '@/lib/types'
import { notFound } from 'next/navigation'

// Sample properties data (same as in API)
const sampleProperties: Property[] = [
  {
    id: '68c0b6c4f37fb75b80189302',
    title: 'Downtown Loft with City Views',
    primaryImage: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    lat: 30.2672,
    lng: -97.7431,
    locationLabel: 'Austin, 1100 Congress Ave',
    rating: 4.5,
    reviewCount: 0,
    shortDescription: 'Modern downtown loft with panoramic city views and rooftop access',
    beds: 1,
    baths: 1,
    price: 120,
    badge: null,
    isFavorite: false,
    url: '/property/downtown-loft-city-views',
    location: 'Austin, 1100 Congress Ave',
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    reviews: 0,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    coordinates: { lat: 30.2672, lng: -97.7431 },
    superHost: false,
    amenities: [],
    description: 'Modern downtown loft with panoramic city views and rooftop access',
    fullDescription: 'Experience urban living at its finest in this stylish downtown loft. Features exposed brick walls, high ceilings, and access to a shared rooftop with city views. Walking distance to restaurants, bars, and entertainment.',
    availability: true,
    popular: false,
    deal: false,
    cleaningFee: 35,
    serviceFeePercentage: 12,
    taxPercentage: 8,
    comparePrice: null,
    slug: 'downtown-loft-city-views'
  },
  {
    id: '68c0b6c0eebdac2d33049622',
    title: 'Beachfront Condo with Ocean Views',
    primaryImage: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    lat: 25.7907,
    lng: -80.1393,
    locationLabel: 'Miami Beach, 4441 Collins Ave',
    rating: 4.5,
    reviewCount: 0,
    shortDescription: 'Luxury beachfront condo with stunning ocean views and pool access',
    beds: 2,
    baths: 2,
    price: 250,
    badge: 'Popular',
    isFavorite: false,
    url: '/property/beachfront-condo-ocean-views',
    location: 'Miami Beach, 4441 Collins Ave',
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    reviews: 0,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    coordinates: { lat: 25.7907, lng: -80.1393 },
    superHost: false,
    amenities: [],
    description: 'Luxury beachfront condo with stunning ocean views and pool access',
    fullDescription: 'Wake up to breathtaking ocean views in this modern beachfront condo. Features floor-to-ceiling windows, private balcony, and access to resort amenities including pools, spa, and beach service.',
    availability: true,
    popular: true,
    deal: false,
    cleaningFee: 75,
    serviceFeePercentage: 15,
    taxPercentage: 10,
    comparePrice: null,
    slug: 'beachfront-condo-ocean-views'
  },
  {
    id: '68c0b6bcec294bdf0a7fa687',
    title: 'Mountain View Cabin with Hot Tub',
    primaryImage: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    lat: 35.5951,
    lng: -82.5515,
    locationLabel: 'Asheville, 1 Page Ave, Asheville, NC 28801',
    rating: 4.5,
    reviewCount: 0,
    shortDescription: 'Cozy mountain cabin with stunning views and private hot tub',
    beds: 3,
    baths: 2,
    price: 150,
    badge: 'Deal',
    isFavorite: false,
    url: '/property/mountain-view-cabin-hot-tub',
    location: 'Asheville, 1 Page Ave, Asheville, NC 28801',
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    reviews: 0,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    coordinates: { lat: 35.5951, lng: -82.5515 },
    superHost: false,
    amenities: [],
    description: 'Cozy mountain cabin with stunning views and private hot tub',
    fullDescription: 'Escape to this beautiful mountain cabin with panoramic views of the Blue Ridge Mountains. Features a private hot tub, fireplace, and fully equipped kitchen. Perfect for romantic getaways or small family retreats.',
    availability: true,
    popular: true,
    deal: false,
    cleaningFee: 50,
    serviceFeePercentage: 10,
    taxPercentage: 7,
    comparePrice: null,
    slug: 'mountain-view-cabin-hot-tub'
  },
  {
    id: '68bc94aaca19f1d472cb11e6',
    title: 'Youghiogheny Hot Tub Cabin',
    primaryImage: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    lat: 39.4073,
    lng: -79.4067,
    locationLabel: 'Oakland, 15 S 3rd St, Oakland, MD 21550',
    rating: 4.5,
    reviewCount: 0,
    shortDescription: 'Youghiogheny hot tub cabin in Oakland, Maryland.',
    beds: 7,
    baths: 1,
    price: 180,
    badge: null,
    isFavorite: false,
    url: '/property/youghiogheny-hot-tub-cabin',
    location: 'Oakland, 15 S 3rd St, Oakland, MD 21550',
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    reviews: 0,
    guests: 8,
    bedrooms: 7,
    bathrooms: 1,
    coordinates: { lat: 39.4073, lng: -79.4067 },
    superHost: false,
    amenities: [],
    description: 'Youghiogheny hot tub cabin in Oakland, Maryland.',
    fullDescription: 'Escape to this cozy cabin in Yough Mountain Resort, just 20 minutes from Deep Creek Lake and Oakland. Enjoy a private hot tub, indoor fireplace, outdoor fire pit, lofted sleeping area, full kitchen, and peaceful wooded views.',
    availability: true,
    popular: false,
    deal: false,
    cleaningFee: 60,
    serviceFeePercentage: 14,
    taxPercentage: 9,
    comparePrice: null,
    slug: 'youghiogheny-hot-tub-cabin'
  },
  {
    id: '68bc94a967f3b690b1bb3bca',
    title: 'Hot Tub, Pool Table, Ping Pong & Poker: Big Sky',
    primaryImage: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    lat: 39.5581,
    lng: -79.3522,
    locationLabel: 'McHenry, 296 Marsh Hill Rd, McHenry, MD 21541',
    rating: 4.5,
    reviewCount: 0,
    shortDescription: 'Big Sky property with hot tub, pool table, ping pong, and poker.',
    beds: 10,
    baths: 5,
    price: 450,
    badge: null,
    isFavorite: false,
    url: '/property/hot-tub-pool-table-ping-pong-poker-big-sky',
    location: 'McHenry, 296 Marsh Hill Rd, McHenry, MD 21541',
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    reviews: 0,
    guests: 16,
    bedrooms: 10,
    bathrooms: 5,
    coordinates: { lat: 39.5581, lng: -79.3522 },
    superHost: false,
    amenities: [],
    description: 'Big Sky property with hot tub, pool table, ping pong, and poker.',
    fullDescription: 'Discover Big Sky, a luxurious ski-in/ski-out mountain retreat with a rich rental history and breathtaking panoramic views near Deep Creek Lake and the surrounding peaks.',
    availability: true,
    popular: false,
    deal: false,
    cleaningFee: 150,
    serviceFeePercentage: 18,
    taxPercentage: 12,
    comparePrice: null,
    slug: 'hot-tub-pool-table-ping-pong-poker-big-sky'
  },
  {
    id: '68bc94a791a1fc50f9505861',
    title: 'Luxurious Abode',
    primaryImage: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    lat: 35.0844,
    lng: -106.6504,
    locationLabel: 'Albuquerque, 600 Central Ave SE, Albuquerque, NM 87102',
    rating: 4.5,
    reviewCount: 0,
    shortDescription: 'Luxurious abode with hot tub and rooftop deck.',
    beds: 4,
    baths: 4,
    price: 275,
    badge: null,
    isFavorite: false,
    url: '/property/luxurious-abode',
    location: 'Albuquerque, 600 Central Ave SE, Albuquerque, NM 87102',
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    reviews: 0,
    guests: 10,
    bedrooms: 4,
    bathrooms: 4,
    coordinates: { lat: 35.0844, lng: -106.6504 },
    superHost: false,
    amenities: [],
    description: 'Luxurious abode with hot tub and rooftop deck.',
    fullDescription: 'Discover the perfect blend of comfort, luxury, and peaceful living in our newly constructed home, designed with your ultimate relaxation in mind!',
    availability: true,
    popular: false,
    deal: false,
    cleaningFee: 85,
    serviceFeePercentage: 13,
    taxPercentage: 9,
    comparePrice: null,
    slug: 'luxurious-abode'
  }
]

async function getProperty(slug: string): Promise<Property | null> {
  // Find property by slug
  const property = sampleProperties.find(p => p.slug === slug)
  return property || null
}

export async function generateStaticParams() {
  return sampleProperties.map((property) => ({
    slug: property.slug,
  }))
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property = await getProperty(slug)

  if (!property) {
    notFound()
  }

  return (
    <main className="property-detail-page">
      <div className="container">
        <div className="property-header">
          <h1 className="property-title">{property.title}</h1>
          <div className="property-location">{property.locationLabel}</div>
          <div className="property-rating">
            <span className="rating-stars">⭐</span>
            <span className="rating-value">{property.rating}</span>
            <span className="rating-count">({property.reviewCount} reviews)</span>
          </div>
        </div>

        <div className="property-images">
          <div className="main-image">
            <img 
              src={property.primaryImage} 
              alt={property.title}
              className="property-main-image"
            />
          </div>
        </div>

        <div className="property-details">
          <div className="property-info">
            <h2>About this property</h2>
            <p className="property-description">{property.fullDescription}</p>
            
            <div className="property-amenities">
              <h3>Property details</h3>
              <ul className="amenities-list">
                <li>🏠 {property.beds} bedroom{property.beds !== 1 ? 's' : ''}</li>
                <li>🛁 {property.baths} bathroom{property.baths !== 1 ? 's' : ''}</li>
                <li>👥 Up to {property.guests} guests</li>
                <li>📍 {property.locationLabel}</li>
              </ul>
            </div>
          </div>

          <div className="property-booking">
            <div className="booking-card">
              <div className="price-section">
                <div className="price">${property.price}</div>
                <div className="price-period">per night</div>
              </div>
              
              <div className="booking-form">
                <div className="form-group">
                  <label>Check-in</label>
                  <input type="date" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Check-out</label>
                  <input type="date" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Guests</label>
                  <select className="form-input">
                    {Array.from({ length: property.guests }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} guest{i !== 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <button className="book-button">Reserve</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

