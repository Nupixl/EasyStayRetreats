import Image from 'next/image'

export function Retreats() {
  const retreats = [
    {
      id: 1,
      title: "Mountain Zen Retreat",
      location: "Swiss Alps, Switzerland",
      duration: "7 days",
      price: "$2,499",
      image: "/images/retreat-mountain.jpg",
      description: "Find peace in the majestic Swiss Alps with daily meditation, yoga, and mountain hiking.",
      features: ["Daily meditation sessions", "Mountain yoga", "Organic meals", "Nature hikes"]
    },
    {
      id: 2,
      title: "Coastal Mindfulness",
      location: "Big Sur, California",
      duration: "5 days",
      price: "$1,899",
      image: "/images/retreat-coastal.jpg",
      description: "Reconnect with yourself along the stunning California coastline through mindful practices.",
      features: ["Beach meditation", "Ocean yoga", "Fresh seafood", "Sunset sessions"]
    },
    {
      id: 3,
      title: "Forest Sanctuary",
      location: "Costa Rica",
      duration: "10 days",
      price: "$3,299",
      image: "/images/retreat-forest.jpg",
      description: "Immerse yourself in the healing power of the Costa Rican rainforest.",
      features: ["Jungle meditation", "Wildlife encounters", "Plant-based cuisine", "Waterfall visits"]
    }
  ]

  return (
    <section className="section_retreats" id="retreats">
      <div className="container-large padding-global padding-section-large">
        <div className="retreats_header text-align-center margin-bottom-xl">
          <h2 className="heading-style-h2 margin-bottom-medium">
            Upcoming Retreats
          </h2>
          <p className="text-size-large text-color-neutral-600">
            Choose your perfect retreat experience
          </p>
        </div>
        
        <div className="retreats_grid">
          {retreats.map((retreat) => (
            <div key={retreat.id} className="retreat_card">
              <div className="retreat_image-wrapper">
                <Image
                  src={retreat.image}
                  alt={retreat.title}
                  width={400}
                  height={300}
                  className="retreat_image"
                />
                <div className="retreat_price-badge">
                  {retreat.price}
                </div>
              </div>
              
              <div className="retreat_content">
                <div className="retreat_meta">
                  <span className="retreat_location">{retreat.location}</span>
                  <span className="retreat_duration">{retreat.duration}</span>
                </div>
                
                <h3 className="heading-style-h4 margin-bottom-small">
                  {retreat.title}
                </h3>
                
                <p className="text-size-regular text-color-neutral-600 margin-bottom-medium">
                  {retreat.description}
                </p>
                
                <ul className="retreat_features">
                  {retreat.features.map((feature, index) => (
                    <li key={index} className="retreat_feature-item">
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="retreat_actions">
                  <a href={`/retreats/${retreat.id}`} className="button is-primary">
                    Learn More
                  </a>
                  <a href="/book" className="button is-secondary">
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
