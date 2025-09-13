export function CTA() {
  return (
    <section className="section_cta">
      <div className="container-medium padding-global padding-section-large">
        <div className="cta_content text-align-center">
          <h2 className="heading-style-h2 margin-bottom-medium text-color-white">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-size-large margin-bottom-xl text-color-white opacity-90">
            Join thousands of people who have transformed their lives through our retreats. 
            Your journey to inner peace starts here.
          </p>
          
          <div className="cta_actions">
            <a href="/book" className="button is-primary margin-bottom-small">
              Book Your Retreat
            </a>
            <a href="/contact" className="button is-secondary">
              Get in Touch
            </a>
          </div>
          
          <div className="cta_guarantee margin-top-large">
            <p className="text-size-small text-color-white opacity-80">
              ✨ 30-day money-back guarantee • 🌍 Eco-friendly practices • 🧘‍♀️ Expert guidance
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
