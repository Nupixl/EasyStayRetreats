'use client';

import { NavbarWrapper, NavbarContainer, NavbarBrand, NavbarMenu, NavbarLink, NavbarButton } from '@/components/_Builtin/Navbar';
import { PropertyCard } from '@/components/PropertyCard';
import { Footer } from '@/components/Footer';
import { ASSETS } from '@/utils/assets';

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <NavbarWrapper
        tag="nav"
        className="navbar"
        config={{
          animation: "over-right",
          collapse: "medium",
          docHeight: false,
          duration: 400,
          easing: "ease",
          easing2: "ease",
          noScroll: true,
        }}
      >
        <NavbarContainer className="container-large" tag="div" {...({} as any)}>
          <NavbarBrand
            options={{ href: "/" }}
            className="nav-brand"
          >
            Easy Stay Retreats
          </NavbarBrand>
          <NavbarButton className="nav-menu-button">
            <div className="w-icon-nav-menu"></div>
          </NavbarButton>
          <NavbarMenu className="nav-menu">
            <NavbarLink options={{ href: "/" }} className="nav-link">Home</NavbarLink>
            <NavbarLink options={{ href: "/search-properties" }} className="nav-link">Retreats</NavbarLink>
            <NavbarLink options={{ href: "/about-us" }} className="nav-link">About</NavbarLink>
            <NavbarLink options={{ href: "/contact" }} className="nav-link">Contact</NavbarLink>
          </NavbarMenu>
        </NavbarContainer>
      </NavbarWrapper>

             <main className="main-wrapper">
               {/* Hero Section */}
               <section className="section-intro">
                 <div className="hero-background-image easy-stay"></div>
                 <div className="container-large">
                   <div className="text-center">
                     <h1 className="xxl-heading">
                       <strong>Find Your Easy Stay</strong>
                     </h1>
                     <div className="body-display white">
                       From listings to guest support, cleaning, and financials—everything handled. Experience hassle-free property management with our expert team.
                     </div>
                     <div className="subtitle white">
                       24/7 Guest Support • Hotel-Grade Cleaning • Secure Payments
                     </div>
                     <a href="/search-properties" className="button">
                       Browse Stays
                     </a>
                   </div>
                 </div>
               </section>

        {/* Popular Properties Section */}
        <section className="section">
          <div className="container-large">
            <div className="text-center">
              <div className="subtitle">Your Travel MaDe Easy</div>
              <h1>Explore Our Most Popular Properties</h1>
            </div>
            
            <div className="grid grid-cols-3 gap-lg">
              {/* Property Cards will be populated from Webflow CMS */}
              <div className="text-center">
                <div className="subtitle">vacations</div>
                <div>No items found.</div>
              </div>
              <div className="text-center">
                <div className="subtitle">vacations</div>
                <div>No items found.</div>
              </div>
              <div className="text-center">
                <div className="subtitle">vacations</div>
                <div>No items found.</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section">
          <div className="container-large">
            <div className="text-center">
              <div className="subtitle">How It Works</div>
              <h2>Booking Your Easy Stay Is Simple</h2>
              <div className="body-display large">
                From searching destinations to check-out, Easy Stay makes travel effortless. Our streamlined process ensures you spend less time planning and more time enjoying your trip.
              </div>
            </div>

            <div className="grid grid-cols-4 gap-lg">
              <div className="text-center">
                <div>1</div>
                <h3>Step 1: Find Your Stay</h3>
                <div className="body-display">
                  Search by city, dates, and guests to discover handpicked vacation rentals that match your needs.
                </div>
              </div>
              <div className="text-center">
                <div>2</div>
                <h3>Step 2: Book Securely</h3>
                <div className="body-display">
                  Reserve instantly with transparent pricing and safe, hassle-free checkout.
                </div>
              </div>
              <div className="text-center">
                <div>3</div>
                <h3>Step 3: Check In with Ease</h3>
                <div className="body-display">
                  Get clear arrival instructions, smart lock access, and 24/7 guest support.
                </div>
              </div>
              <div className="text-center">
                <div>4</div>
                <h3>Enjoy Your Easy Stay</h3>
                <div className="body-display">
                  Relax in a professionally cleaned home, explore local recommendations, and make lasting memories.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Easy Stay Section */}
        <section className="section-why">
          <div className="container-large">
            <div className="text-center">
              <div className="subtitle">Why We Work</div>
              <h1>
                <strong>Why Guests Choose Easy Stay</strong>
              </h1>
              <div className="body-display large">
                Book confidently. Every home is professionally prepared, easy to access, and supported 24/7—so your trip stays simple from search to checkout.
              </div>
              <a href="/search-properties" className="button">
                See Stays
              </a>
            </div>
            <div className="grid grid-cols-4 gap-lg">
              <div className="text-center">
                <div className="subtitle">Really that easy</div>
                <div className="w-embed">
                  <img src={ASSETS.icons.icon1} alt="" className="icon-large" />
                </div>
                <h2 className="featured-location-heading heading">Effortless Booking</h2>
                <div className="body-display small">
                  Find the right place fast with clear photos, accurate details, and instant, secure checkout.
                </div>
              </div>
              <div className="text-center">
                <div className="subtitle">Really that easy</div>
                <div className="w-embed">
                  <img src={ASSETS.icons.icon2} alt="" className="icon-large" />
                </div>
                <h2 className="featured-location-heading heading">Hotel-Grade Clean</h2>
                <div className="body-display small">
                  <em>Every home is professionally cleaned and inspected before you arrive—linens fresh, essentials stocked.</em>
                </div>
              </div>
              <div className="text-center">
                <div className="subtitle">Really that easy</div>
                <div className="w-embed">
                  <img src={ASSETS.icons.icon3} alt="" className="icon-large" />
                </div>
                <h2 className="featured-location-heading heading">Smart, Seamless Check-In</h2>
                <div className="body-display small">
                  Keyless entry and step-by-step arrival instructions mean no waiting, no stress.
                </div>
              </div>
              <div className="text-center">
                <div className="subtitle">Really that easy</div>
                <div className="w-embed">
                  <img src={ASSETS.icons.icon4} alt="" className="icon-large" />
                </div>
                <h2 className="featured-location-heading heading">
                  <em>24/7 Human Support</em>
                </h2>
                <div className="body-display small">
                  <em>Real people on call day and night for questions, hiccups, or local tips.</em>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Owners Section */}
        <section className="section">
          <div className="container-large">
            <div className="text-center">
              <div className="subtitle">Own a Property?</div>
              <h1>
                <strong>Partner Turn Your Home Into a Hassle-Free Vacation RentalWith Easy Stay</strong>
              </h1>
              <a href="/contact" className="button">
                How it works
              </a>
            </div>
          </div>
        </section>

        {/* About Easy Stay Section */}
        <section className="section">
          <div className="container-large">
            <div className="text-center">
              <div className="subtitle">ABOUT Easystay</div>
              <h2>Trusted Property Management, Built for Peace of Mind</h2>
              <div className="body-display">
                Behind every Easy Stay is a dedicated property management team that makes hosting simple. From guest communications and 24/7 support to cleaning, maintenance, and financial reporting—we handle it all so owners can relax and earn more.
              </div>
              <div className="body-display">
                If you own a home or vacation rental, partnering with Easy Stay means less stress, more bookings, and peace of mind knowing your property is cared for as if it were our own.
              </div>
              <a href="/about-us" className="button">
                Contact us
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}