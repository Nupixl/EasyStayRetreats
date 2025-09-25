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
    </>
  );
}