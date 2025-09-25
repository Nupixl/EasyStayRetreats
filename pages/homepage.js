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
      </Head>
      
      <NavBar />
      
      <HeroSection 
        title="Turn Your Home Into a Vacation Rental"
        subtitle="We handle everything so you can earn more and stress less"
        backgroundImage="/webflow-images/claire-rendall-rqckazRfbCs-unsplash-p-1600.jpg"
      />
      
      <div className="properties-section">
        <div className="container">
          <h2>Featured Properties</h2>
          <div className="grid-wrapper">
            <PropertyCard 
              title="Luxury Beach House"
              location="Malibu, CA"
              price="$450/night"
              image="/webflow-images/property-1.jpg"
            />
            <PropertyCard 
              title="Mountain Cabin"
              location="Aspen, CO"
              price="$320/night"
              image="/webflow-images/property-2.jpg"
            />
            <PropertyCard 
              title="City Apartment"
              location="New York, NY"
              price="$280/night"
              image="/webflow-images/property-3.jpg"
            />
          </div>
        </div>
      </div>
      
      <div className="steps-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <StepCard 
              number="1"
              title="List Your Property"
              description="We help you create a stunning listing that attracts guests"
            />
            <StepCard 
              number="2"
              title="We Handle Everything"
              description="From guest communication to cleaning and maintenance"
            />
            <StepCard 
              number="3"
              title="Earn More"
              description="Maximize your rental income with our proven strategies"
            />
          </div>
        </div>
      </div>
      
      <div className="benefits-section">
        <div className="container">
          <h2>Why Choose Easy Stay?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <img src="/webflow-images/Easy-Stay-Retreasts-Logo.avif" alt="Easy Stay Benefits" />
              <h3>24/7 Guest Support</h3>
              <p>We handle all guest inquiries and issues around the clock</p>
            </div>
            <div className="benefit-item">
              <img src="/webflow-images/Easy-Stay-Retreasts-Logo.avif" alt="Easy Stay Benefits" />
              <h3>Professional Cleaning</h3>
              <p>Our vetted cleaning teams ensure your property is spotless</p>
            </div>
            <div className="benefit-item">
              <img src="/webflow-images/Easy-Stay-Retreasts-Logo.avif" alt="Easy Stay Benefits" />
              <h3>Revenue Optimization</h3>
              <p>Dynamic pricing and marketing to maximize your income</p>
            </div>
          </div>
        </div>
      </div>
      
      <CtaSection 
        title="Ready to Get Started?"
        subtitle="Join hundreds of hosts who trust Easy Stay with their properties"
        backgroundImage="/webflow-images/patrick-lalonde-EnFbpYeGIp0-unsplash_1.avif"
        buttonText="Get Started Today"
        buttonLink="/contact"
      />
      
      <Footer />
      <Preloader />
      <ScrollIndicator />
      
      <style jsx>{`
        .properties-section {
          padding: 80px 0;
          background: #f8f9fa;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .grid-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }
        
        .steps-section {
          padding: 80px 0;
          background: white;
        }
        
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-top: 40px;
        }
        
        .benefits-section {
          padding: 80px 0;
          background: #f8f9fa;
        }
        
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-top: 40px;
        }
        
        .benefit-item {
          text-align: center;
          padding: 30px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .benefit-item img {
          width: 60px;
          height: 60px;
          margin-bottom: 20px;
        }
        
        .benefit-item h3 {
          font-size: 24px;
          margin-bottom: 15px;
          color: #333;
        }
        
        .benefit-item p {
          color: #666;
          line-height: 1.6;
        }
        
        h2 {
          text-align: center;
          font-size: 36px;
          margin-bottom: 20px;
          color: #333;
        }
        
        @media (max-width: 768px) {
          .grid-wrapper {
            grid-template-columns: 1fr;
          }
          
          .steps-grid {
            grid-template-columns: 1fr;
          }
          
          .benefits-grid {
            grid-template-columns: 1fr;
          }
          
          h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
}