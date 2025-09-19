import React from 'react'

export function Footer() {
  return (
    <div className="footer">
      <div className="grid-wrapper">
        <div className="horizontal-line left"></div>
        <div className="footer-wrapper">
          <div className="footer-pages">
            <div className="footer-destination-text">
              <div>Popular Spaces</div>
            </div>
            <div className="w-dyn-list">
              <div role="list" className="footer-destinations w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a href="#" className="footer-link w-inline-block">
                    <div className="link-text">Washington DC</div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a href="#" className="footer-link w-inline-block">
                    <div className="link-text">Massachusetts</div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a href="#" className="footer-link w-inline-block">
                    <div className="link-text">New Mexico</div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a href="#" className="footer-link w-inline-block">
                    <div className="link-text">Virginia</div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a href="#" className="footer-link w-inline-block">
                    <div className="link-text">Maryland</div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a href="#" className="footer-link w-inline-block">
                    <div className="link-text">New York</div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a href="#" className="footer-link w-inline-block">
                    <div className="link-text">California</div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a href="#" className="footer-link w-inline-block">
                    <div className="link-text">Texas</div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a href="#" className="footer-link w-inline-block">
                    <div className="link-text">Florida</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="credit-text">© 2025 Easy Stay Retreats</div>
        </div>
      </div>
    </div>
  )
}