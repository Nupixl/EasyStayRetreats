export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, NY",
      retreat: "Mountain Zen Retreat",
      content: "The Mountain Zen Retreat completely transformed my perspective on life. The combination of meditation, nature, and community created an experience I'll never forget.",
      rating: 5
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA",
      retreat: "Coastal Mindfulness",
      content: "I came to the retreat feeling burned out and disconnected. I left feeling renewed, centered, and with tools I use every day to maintain my peace.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      location: "Austin, TX",
      retreat: "Forest Sanctuary",
      content: "The Costa Rica retreat was magical. Being surrounded by nature while learning mindfulness practices helped me find clarity I didn't know I was missing.",
      rating: 5
    }
  ]

  return (
    <section className="section_testimonials">
      <div className="container-large padding-global padding-section-medium">
        <div className="testimonials_header text-align-center margin-bottom-xl">
          <h2 className="heading-style-h2 margin-bottom-medium">
            What Our Guests Say
          </h2>
          <p className="text-size-large text-color-neutral-600">
            Real stories from real people who found transformation
          </p>
        </div>
        
        <div className="testimonials_grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial_card">
              <div className="testimonial_rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="testimonial_star">⭐</span>
                ))}
              </div>
              
              <blockquote className="testimonial_content">
                "{testimonial.content}"
              </blockquote>
              
              <div className="testimonial_author">
                <div className="testimonial_author-info">
                  <h4 className="testimonial_author-name">{testimonial.name}</h4>
                  <p className="testimonial_author-location">{testimonial.location}</p>
                </div>
                <div className="testimonial_retreat">
                  <span className="testimonial_retreat-label">Attended:</span>
                  <span className="testimonial_retreat-name">{testimonial.retreat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
