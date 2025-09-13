export function Features() {
  const features = [
    {
      icon: "🧘‍♀️",
      title: "Mindfulness & Meditation",
      description: "Learn ancient practices and modern techniques to cultivate inner peace and mental clarity."
    },
    {
      icon: "🌿",
      title: "Natural Healing",
      description: "Immerse yourself in pristine natural environments that promote healing and restoration."
    },
    {
      icon: "👥",
      title: "Community Connection",
      description: "Connect with like-minded individuals on similar journeys of personal growth and transformation."
    },
    {
      icon: "🍃",
      title: "Holistic Wellness",
      description: "Experience comprehensive wellness through yoga, nutrition, and mindful living practices."
    }
  ]

  return (
    <section className="section_features">
      <div className="container-large padding-global padding-section-medium">
        <div className="features_header text-align-center margin-bottom-xl">
          <h2 className="heading-style-h2 margin-bottom-medium">
            Why Choose Easy Stay Retreats
          </h2>
          <p className="text-size-large text-color-neutral-600">
            Our retreats are designed to provide transformative experiences that last a lifetime
          </p>
        </div>
        
        <div className="features_grid">
          {features.map((feature, index) => (
            <div key={index} className="feature_item">
              <div className="feature_icon-wrapper">
                <span className="feature_icon">{feature.icon}</span>
              </div>
              <h3 className="heading-style-h4 margin-bottom-small">
                {feature.title}
              </h3>
              <p className="text-size-regular text-color-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
