import React from 'react';
import Head from 'next/head';
import { DevLinkProvider } from '../devlink/DevLinkProvider';
import { NavBar } from '../devlink/NavBar';
import { Footer } from '../devlink/Footer';
import AnimationWrapper from '../components/AnimationWrapper';
import PageTransition from '../components/PageTransition';
import { PropertyCard } from '../devlink/PropertyCard';
import { PropertyDirectory } from '../devlink/PropertyDirectory';
import { DashboardHeader } from '../devlink/DashboardHeader';
import { StatCard } from '../devlink/StatCard';
import { StatContainer } from '../devlink/StatContainer';
import { StepCard } from '../devlink/StepCard';
import { MapElement } from '../devlink/MapElement';
import { Preloader } from '../devlink/Preloader';
import { ScrollIndicator } from '../devlink/ScrollIndicator';
import { Status } from '../devlink/Status';
import { LoginButton } from '../devlink/LoginButton';
import { Locations } from '../devlink/Locations';
import { StickHeaderCard } from '../devlink/StickHeaderCard';
import { StatWrapper } from '../devlink/StatWrapper';

const DevLinkDemo = () => {
  return (
    <DevLinkProvider>
      <Head>
        <title>Webflow DevLink Components Demo - EasyStay Retreats</title>
        <meta name="description" content="Demo of Webflow DevLink components imported into Next.js" />
        <link href="/devlink/global.css" rel="stylesheet" type="text/css" />
      </Head>
      
      <PageTransition>
        <div className="page-wrapper">
          {/* Navigation */}
          <AnimationWrapper animation="fadeInDown" trigger="onMount">
            <NavBar />
          </AnimationWrapper>
          
          {/* Hero Section */}
          <section className="hero-section">
            <div className="container">
              <AnimationWrapper animation="fadeInUp" delay={0.2}>
                <h1>Webflow DevLink Components Demo</h1>
              </AnimationWrapper>
              <AnimationWrapper animation="fadeInUp" delay={0.4}>
                <p>This page showcases all the components imported from your Webflow project using DevLink.</p>
              </AnimationWrapper>
            </div>
          </section>

          {/* Dashboard Header */}
          <AnimationWrapper animation="fadeInUp" delay={0.6}>
            <section className="section">
              <div className="container">
                <h2>Dashboard Header</h2>
                <DashboardHeader />
              </div>
            </section>
          </AnimationWrapper>

          {/* Property Components */}
          <AnimationWrapper animation="fadeInUp" delay={0.8}>
            <section className="section">
              <div className="container">
                <h2>Property Components</h2>
                <div className="grid">
                  <PropertyCard />
                  <PropertyDirectory />
                </div>
              </div>
            </section>
          </AnimationWrapper>

        {/* Statistics Components */}
        <section className="section">
          <div className="container">
            <h2>Statistics Components</h2>
            <StatContainer>
              <StatCard />
              <StatCard />
              <StatCard />
            </StatContainer>
            <StatWrapper>
              <StatCard />
            </StatWrapper>
          </div>
        </section>

        {/* Step Cards */}
        <section className="section">
          <div className="container">
            <h2>Step Cards</h2>
            <div className="grid">
              <StepCard />
              <StepCard />
              <StepCard />
            </div>
          </div>
        </section>

        {/* Map Element */}
        <section className="section">
          <div className="container">
            <h2>Map Element</h2>
            <MapElement />
          </div>
        </section>

        {/* Locations */}
        <section className="section">
          <div className="container">
            <h2>Locations</h2>
            <Locations />
          </div>
        </section>

        {/* Utility Components */}
        <section className="section">
          <div className="container">
            <h2>Utility Components</h2>
            <div className="grid">
              <div>
                <h3>Preloader</h3>
                <Preloader />
              </div>
              <div>
                <h3>Scroll Indicator</h3>
                <ScrollIndicator />
              </div>
              <div>
                <h3>Status</h3>
                <Status />
              </div>
              <div>
                <h3>Login Button</h3>
                <LoginButton />
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Header Card */}
        <section className="section">
          <div className="container">
            <h2>Sticky Header Card</h2>
            <StickHeaderCard />
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          background: #f8f9fa;
        }
        
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }
        
        .hero-section h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .hero-section p {
          font-size: 1.2rem;
          opacity: 0.9;
        }
        
        .section {
          padding: 3rem 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .section:last-child {
          border-bottom: none;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .section h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #333;
        }
        
        .section h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #555;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .grid > div {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
      </PageTransition>
    </DevLinkProvider>
  );
};

export default DevLinkDemo;
