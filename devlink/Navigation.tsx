import React from 'react'
import Link from 'next/link'

export function Navigation() {
  return (
    <div className="navbar w-nav" data-collapse="medium" data-animation="default" data-duration="600" data-doc-height="1" data-easing="ease" data-easing2="ease" role="banner">
      <div className="top-nav-wrapper">
        <div className="flyout-menu-wrapper">
          <div className="flyout-menu-content">
            <div className="flyout-heading">
              <h2>Navigation</h2>
            </div>
            <div id="scrollbar" className="scroll-flyout-wrapper">
              <div className="vacation-continents">
                <div className="flyout-info-box">
                  <div className="subtitle-intro-wrapper">
                    <div className="subtitle">Travel</div>
                    <div className="horizontal-line"></div>
                    <div data-hover="false" data-delay="0" className="nav-link-dropdown w-dropdown">
                      <div className="nav-dropdown-toggle w-dropdown-toggle">
                        <div>Our Stays</div>
                        <div className="card-arrow-icon dark">
                          <img src="/images/arrowhead-right-icon-dark001.svg" loading="lazy" alt="" className="vacation-card-arrow" />
                        </div>
                      </div>
                      <nav className="nav-dropdown-list w-dropdown-list">
                        <Link href="/search-properties" className="nav-dropdown-link w-inline-block">
                          <h4>Search Stays</h4>
                        </Link>
                        <div className="w-dyn-list">
                          <div role="list" className="continent-list w-dyn-items">
                            <div role="listitem" className="w-dyn-item">
                              <Link href="#" className="location-card w-inline-block">
                                <div className="location-name">
                                  <h4 className="w-dyn-bind-empty"></h4>
                                  <div className="subtitle-dynamic-text">
                                    <div className="subtitle w-dyn-bind-empty"></div>
                                    <div className="subtitle">Properties</div>
                                  </div>
                                </div>
                                <div className="card-arrow-icon"><img src="/images/arrowhead-right-icon-dark-light.svg" loading="lazy" alt="" className="vacation-card-arrow" /></div>
                                <div className="location-card-background">
                                  <div className="overlay"></div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </nav>
                    </div>
                  </div>
                  <div className="subtitle-intro-wrapper">
                    <div className="subtitle">Accounts<br />‍</div>
                    <div className="horizontal-line"></div>
                    <a href="https://calendly.com/" target="_blank" className="quick-link-item w-inline-block">
                      <div>Log-in/Sign-Up</div>
                      <div className="card-arrow-icon dark"><img src="/images/arrowhead-right-icon-dark001.svg" loading="lazy" alt="" className="vacation-card-arrow" /></div>
                    </a>
                  </div>
                </div>
                <div className="flyout-info-box">
                  <div className="subtitle-intro-wrapper">
                    <div className="subtitle">Contact us</div>
                    <div className="horizontal-line"></div>
                  </div>
                  <div className="quick-link-list">
                    <Link href="/contact" className="quick-link-item w-inline-block">
                      <div>Host Your Property</div>
                      <div className="card-arrow-icon dark"><img src="/images/arrowhead-right-icon-dark001.svg" loading="lazy" alt="" className="vacation-card-arrow" /></div>
                    </Link>
                    <Link href="/contact" className="quick-link-item w-inline-block">
                      <div>Become a Affiliate</div>
                      <div className="card-arrow-icon dark"><img src="/images/arrowhead-right-icon-dark001.svg" loading="lazy" alt="" className="vacation-card-arrow" /></div>
                    </Link>
                    <a href="mailto:thomas@easystayretreats.com?subject=Property%20Inquiry" className="quick-link-item w-inline-block">
                      <div>Email Us</div>
                      <div className="card-arrow-icon dark"><img src="/images/arrowhead-right-icon-dark001.svg" loading="lazy" alt="" className="vacation-card-arrow" /></div>
                    </a>
                    <a href="tel:+1(240)869-6702" className="quick-link-item w-inline-block">
                      <div>Call Us</div>
                      <div className="card-arrow-icon dark"><img src="/images/arrowhead-right-icon-dark001.svg" loading="lazy" alt="" className="vacation-card-arrow" /></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-w-id="6252b416-c3c5-73fa-7b6c-666bfb79e89e" className="close-flyout"></div>
        </div>
        <div data-w-id="69b0d3f6-d0cc-2db5-ee2d-841bd3468614" className="left-nav">
          <div data-w-id="69b0d3f6-d0cc-2db5-ee2d-841bd346861b" className="menu-button w-nav-button">
            <div data-is-ix2-target="1" className="menu-lottie" data-w-id="b66c9d5c-5d64-8ba7-12ad-b72b589f4229" data-animation-type="lottie" data-src="documents/menu-nav.json" data-loop="0" data-direction="1" data-autoplay="0" data-renderer="svg" data-default-duration="2.4791666666666665" data-duration="0" data-ix2-initial-state="0"></div>
          </div>
          <div data-w-id="69b0d3f6-d0cc-2db5-ee2d-841bd3468615" className="flyout-menu">
            <div data-is-ix2-target="1" className="menu-lottie" data-w-id="be81bbea-25f2-a6cd-a450-45c63ab5efef" data-animation-type="lottie" data-src="documents/menu-nav.json" data-loop="0" data-direction="1" data-autoplay="0" data-renderer="svg" data-default-duration="2.4791666666666665" data-duration="0" data-ix2-initial-state="0"></div>
          </div>
          <div data-w-id="88b0f067-982b-0642-fc5d-73df7d5b3c68" className="flyout-menu close">
            <div data-is-ix2-target="1" className="menu-lottie" data-w-id="88b0f067-982b-0642-fc5d-73df7d5b3c69" data-animation-type="lottie" data-src="documents/menu-nav.json" data-loop="0" data-direction="1" data-autoplay="0" data-renderer="svg" data-default-duration="2.4791666666666665" data-duration="0" data-ix2-initial-state="0"></div>
          </div>
        </div>
        <div data-w-id="199fb1dc-b4ea-99c3-f373-804a90f62445" className="navigation-content">
          <Link href="/" data-w-id="69b0d3f6-d0cc-2db5-ee2d-841bd3468616" aria-current="page" className="brand w-nav-brand w--current"></Link>
          <nav role="navigation" data-w-id="69b0d3f6-d0cc-2db5-ee2d-841bd346861d" className="nav-menu w-nav-menu">
            <div className="nav-menu-links">
              <div data-hover="false" data-delay="0" className="link-cover w-dropdown">
                <div className="dropdown-toggle w-dropdown-toggle">
                  <div className="icon w-icon-dropdown-toggle"></div>
                  <div className="dropdown-text">Travelers</div>
                </div>
                <nav className="dropdown-list w-dropdown-list">
                  <Link href="/travel/travel-services" className="nav-link w-inline-block">
                    <div className="link-text">Travel Services</div>
                    <div className="link-cover mobile-hide"></div>
                  </Link>
                  <Link href="/travel/about-us" className="nav-link w-inline-block">
                    <div className="link-text">About Us</div>
                    <div className="link-cover mobile-hide"></div>
                  </Link>
                  <Link href="/search-properties" className="nav-link w-inline-block">
                    <div className="link-text">Travel Now</div>
                    <div className="link-cover mobile-hide"></div>
                  </Link>
                </nav>
              </div>
              <div data-hover="false" data-delay="0" className="link-cover w-dropdown">
                <div className="dropdown-toggle w-dropdown-toggle">
                  <div className="icon w-icon-dropdown-toggle"></div>
                  <div className="dropdown-text">Owners</div>
                </div>
                <nav className="dropdown-list w-dropdown-list">
                  <Link href="/property-owners/rental-management" className="nav-link w-inline-block">
                    <div className="link-text">management</div>
                    <div className="link-cover mobile-hide"></div>
                  </Link>
                  <Link href="/property-owners/management-services" className="nav-link w-inline-block">
                    <div className="link-text">Services</div>
                    <div className="link-cover mobile-hide"></div>
                  </Link>
                  <Link href="/property-owners/about-property-management" className="nav-link w-inline-block">
                    <div className="link-text">About</div>
                    <div className="link-cover mobile-hide"></div>
                  </Link>
                </nav>
              </div>
            </div>
            <div className="mobile-destinations-wrapper">
              <div className="subtitle-intro-wrapper">
                <div className="subtitle">Destinations</div>
                <div className="horizontal-line"></div>
              </div>
              <div className="mobile-destinations w-dyn-list">
                {/* Dynamic list items would go here */}
              </div>
            </div>
          </nav>
          <div className="right-nav mobile-hide">
            <Link href="/login" className="nav-button w-button">Log-in</Link>
          </div>
        </div>
        <div className="mobile-navigation-shade"></div>
        <div className="navigation-shade"></div>
      </div>
    </div>
  )
}