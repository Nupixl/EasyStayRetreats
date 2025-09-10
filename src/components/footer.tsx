export function Footer() {
  return (
    <footer className="section_footer">
      <div className="container-large padding-global padding-section-medium">
        <div className="footer_content">
          <div className="footer_brand">
            <h3 className="heading-style-h4 margin-bottom-small">
              Easy Stay Retreats
            </h3>
            <p className="text-size-regular text-color-neutral-600 margin-bottom-medium">
              Transform your life through mindful retreats in the world's most beautiful locations.
            </p>
            <div className="footer_social">
              <a href="#" className="footer_social-link">Instagram</a>
              <a href="#" className="footer_social-link">Facebook</a>
              <a href="#" className="footer_social-link">Twitter</a>
            </div>
          </div>
          
          <div className="footer_links">
            <div className="footer_link-group">
              <h4 className="heading-style-h6 margin-bottom-small">Retreats</h4>
              <ul className="footer_link-list">
                <li><a href="/retreats/mountain" className="footer_link">Mountain Zen</a></li>
                <li><a href="/retreats/coastal" className="footer_link">Coastal Mindfulness</a></li>
                <li><a href="/retreats/forest" className="footer_link">Forest Sanctuary</a></li>
                <li><a href="/retreats/custom" className="footer_link">Custom Retreats</a></li>
              </ul>
            </div>
            
            <div className="footer_link-group">
              <h4 className="heading-style-h6 margin-bottom-small">Support</h4>
              <ul className="footer_link-list">
                <li><a href="/faq" className="footer_link">FAQ</a></li>
                <li><a href="/contact" className="footer_link">Contact Us</a></li>
                <li><a href="/booking" className="footer_link">Booking Info</a></li>
                <li><a href="/cancellation" className="footer_link">Cancellation Policy</a></li>
              </ul>
            </div>
            
            <div className="footer_link-group">
              <h4 className="heading-style-h6 margin-bottom-small">Company</h4>
              <ul className="footer_link-list">
                <li><a href="/about" className="footer_link">About Us</a></li>
                <li><a href="/team" className="footer_link">Our Team</a></li>
                <li><a href="/sustainability" className="footer_link">Sustainability</a></li>
                <li><a href="/careers" className="footer_link">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer_bottom">
          <div className="footer_copyright">
            <p className="text-size-small text-color-neutral-500">
              © 2024 Easy Stay Retreats. All rights reserved.
            </p>
          </div>
          <div className="footer_legal">
            <a href="/privacy" className="footer_legal-link">Privacy Policy</a>
            <a href="/terms" className="footer_legal-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
