import React from 'react';
import Head from 'next/head';
import {
  NavBar, 
  Footer, 
  HeroSection, 
  PropertyCard, 
  StepCard,
  CtaSection,
  CtaSection2,
  ParallaxSection,
  TallSectionWPhotos,
  SmallCard,
  LargeImageCard,
  MobileNav,
  Preloader,
  ScrollIndicator
} from '../devlink';

export default function Homepage() {
  return (
    <>
      <Head>
        <title>Easy Stay Property Management | Stress-Free Hosting & More Bookings</title>
        <meta name="description" content="Turn your home into a vacation rental with Easy Stay. We handle guest communication, 24/7 support, cleaning, and finances—so you earn more and stress less." />
        <meta property="og:title" content="Easy Stay Property Management | Stress-Free Hosting & More Bookings" />
        <meta property="og:description" content="Turn your home into a vacation rental with Easy Stay. We handle guest communication, 24/7 support, cleaning, and finances—so you earn more and stress less." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Easy Stay Property Management | Stress-Free Hosting & More Bookings" />
        <meta name="twitter:description" content="Turn your home into a vacation rental with Easy Stay. We handle guest communication, 24/7 support, cleaning, and finances—so you earn more and stress less." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-wrapper">
        {/* Preloader */}
        <Preloader />
        
        {/* Scroll Indicator */}
        <ScrollIndicator />
        
        {/* Navigation */}
        <NavBar />
        
        {/* Hero Section */}
        <HeroSection 
          title="Find Your Easy Stay"
          subtitle="From listings to guest support, cleaning, and financials—everything handled. Experience hassle-free property management with our expert team."
          searchPlaceholder="Search location"
          features="24/7 Guest Support • Hotel-Grade Cleaning • Secure Payments"
          backgroundImage="/webflow-images/claire-rendall-rqckazRfbCs-unsplash-p-1600.jpg"
        />
        
        {/* Hero Links */}
        <div className="hero-links">
          <div className="container">
            <div className="hero-links-wrapper">
              <a href="/search-properties" className="hero-link">
                <div className="hero-link-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="hero-link-content">
                  <h3>Search Properties</h3>
                  <p>Browse our curated selection of vacation rentals</p>
                </div>
              </a>
              
              <a href="/s/all" className="hero-link">
                <div className="hero-link-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 2V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 6V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="hero-link-content">
                  <h3>View Map</h3>
                  <p>Explore properties on our interactive map</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* Popular Properties Section */}
        <section className="section">
          <div className="grid-wrapper">
            <div className="centered-intro">
              <div className="subtitle">Your Travel Made Easy</div>
              <h1>Explore Our Most Popular Properties</h1>
            </div>
          </div>
          
          <div className="grid-wrapper">
            <div className="properties-grid">
              <PropertyCard 
                title="Luxury Beach House"
                location="Miami, FL"
                price="$299/night"
                rating={4.9}
                image="/webflow-images/Villa0019_1.avif"
                link="/listings/luxury-beach-house"
              />
              <PropertyCard 
                title="Mountain Cabin Retreat"
                location="Aspen, CO"
                price="$199/night"
                rating={4.8}
                image="/webflow-images/knhr826qIMA_1.avif"
                link="/listings/mountain-cabin"
              />
              <PropertyCard 
                title="Urban Loft"
                location="New York, NY"
                price="$249/night"
                rating={4.7}
                image="/webflow-images/UVyOfX3v0Ls_1.avif"
                link="/listings/urban-loft"
              />
              <PropertyCard 
                title="Lakefront Villa"
                location="Lake Tahoe, CA"
                price="$399/night"
                rating={4.9}
                image="/webflow-images/Villa0017_1.avif"
                link="/listings/lakefront-villa"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section">
          <div className="grid-wrapper">
            <div className="centered-intro">
              <div className="subtitle">How It Works</div>
              <h1>Simple Steps to Your Perfect Stay</h1>
            </div>
          </div>
          
          <div className="grid-wrapper">
            <div className="steps-grid">
              <StepCard 
                step="01"
                title="Search & Discover"
                description="Browse our curated collection of unique properties in your desired destination."
                icon="/webflow-images/Planner001.svg"
              />
              <StepCard 
                step="02"
                title="Book with Confidence"
                description="Secure your stay with our easy booking process and 24/7 support."
                icon="/webflow-images/room002.svg"
              />
              <StepCard 
                step="03"
                title="Enjoy Your Stay"
                description="Arrive and relax - everything is taken care of for your perfect getaway."
                icon="/webflow-images/Guideyes.svg"
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section">
          <div className="grid-wrapper">
            <div className="benefits-content">
              <div className="benefits-text">
                <div className="subtitle">Why Choose Easy Stay</div>
                <h1>Everything You Need for the Perfect Vacation</h1>
                <p>From the moment you book to the day you check out, we're here to ensure your stay is seamless and memorable.</p>
                
                <div className="benefits-list">
                  <div className="benefit-item">
                    <div className="benefit-icon">✓</div>
                    <div className="benefit-text">
                      <h3>24/7 Guest Support</h3>
                      <p>Round-the-clock assistance for any questions or concerns</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">✓</div>
                    <div className="benefit-text">
                      <h3>Hotel-Grade Cleaning</h3>
                      <p>Professional housekeeping ensures every property meets our high standards</p>
            </div>
          </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">✓</div>
                    <div className="benefit-text">
                      <h3>Secure Payments</h3>
                      <p>Safe and encrypted payment processing for your peace of mind</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="benefits-image">
                <img src="/webflow-images/Easy-Stay-Retreasts-Logo.avif" alt="Easy Stay Benefits" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CtaSection 
          title="Ready to Start Your Easy Stay Journey?"
          subtitle="Join thousands of travelers who trust Easy Stay for their perfect getaway."
          buttonText="Start Exploring"
          buttonLink="/search"
          backgroundImage="/webflow-images/patrick-lalonde-EnFbpYeGIp0-unsplash_1.avif"
        />
        
        {/* Footer */}
        <Footer />
            </div>
      
      <style jsx>{`
        .hero-links {
          padding: 60px 0;
          background: #f8f9fa;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .hero-links-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .hero-link {
          display: flex;
          align-items: center;
          padding: 30px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          color: #333;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .hero-link:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          border-color: var(--travel-green, #478760);
        }
        
        .hero-link-icon {
          width: 60px;
          height: 60px;
          background: var(--travel-green, #478760);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          flex-shrink: 0;
        }
        
        .hero-link-icon svg {
          width: 24px;
          height: 24px;
          color: white;
        }
        
        .hero-link-content h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #333;
        }
        
        .hero-link-content p {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          .hero-links {
            padding: 40px 0;
          }
          
          .hero-links-wrapper {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .hero-link {
            padding: 20px;
          }
          
          .hero-link-icon {
            width: 50px;
            height: 50px;
            margin-right: 15px;
          }
          
          .hero-link-content h3 {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
}