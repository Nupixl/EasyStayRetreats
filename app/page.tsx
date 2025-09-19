export default function Home() {
  return (
    <main>
      <section className="section hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Effortless Property Management for Your Vacation Rentals
            </h1>
            <p className="hero-subtitle">
              Maximize your rental income and minimize your stress. Easy Stay handles everything from guest communication to maintenance.
            </p>
            <div className="hero-buttons">
              <a href="/services" className="cta-button primary">
                Explore Our Services
              </a>
              <a href="/contact" className="cta-button secondary">
                Get a Free Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-us">
        <div className="container">
          <div className="w-layout-grid about-us-grid">
            <div className="about-us-content">
              <h2 className="section-title">About Easy Stay Property Management</h2>
              <p className="paragraph-large">
                Easy Stay is dedicated to providing seamless and profitable property management solutions for vacation rental owners. We combine cutting-edge technology with personalized service to ensure your property is always booked, well-maintained, and generating maximum returns.
              </p>
              <ul role="list" className="w-list-unstyled">
                <li className="list-item">
                  <img src="/images/check-icon.svg" loading="lazy" alt="" className="list-icon" />
                  <div>24/7 Guest Support & Communication</div>
                </li>
                <li className="list-item">
                  <img src="/images/check-icon.svg" loading="lazy" alt="" className="list-icon" />
                  <div>Dynamic Pricing & Marketing Strategies</div>
                </li>
                <li className="list-item">
                  <img src="/images/check-icon.svg" loading="lazy" alt="" className="list-icon" />
                  <div>Professional Cleaning & Maintenance</div>
                </li>
                <li className="list-item">
                  <img src="/images/check-icon.svg" loading="lazy" alt="" className="list-icon" />
                  <div>Transparent Financial Reporting</div>
                </li>
              </ul>
              <a href="/about" className="cta-button primary">
                Learn More About Us
              </a>
            </div>
            <div className="about-us-image-wrapper">
              <img src="/images/about-us-image.jpg" loading="lazy" alt="Property Management" className="about-us-image" />
            </div>
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Maximize Your Rental Income?</h2>
            <p className="cta-subtitle">
              Join Easy Stay today and experience stress-free property management.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="cta-button primary">
                Get Started Now
              </a>
              <a href="/contact" className="cta-button secondary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
