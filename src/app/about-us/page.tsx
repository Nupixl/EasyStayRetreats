'use client';

import { NavbarWrapper, NavbarContainer, NavbarBrand, NavbarMenu, NavbarLink, NavbarButton } from '@/components/_Builtin/Navbar';
import { Footer } from '@/components/Footer';

export default function AboutUsPage() {
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
        <section className="section">
          <div className="container-large">
            <div className="text-center">
              <h1 className="heading-style-h1">About Easy Stay Retreats</h1>
              <p className="body-display large">
                Discover our mission to provide transformative wellness retreats.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section">
          <div className="container-large">
            <div className="grid grid-cols-2 gap-lg">
              <div>
                <div className="subtitle">Our Story</div>
                <h2 className="heading-style-h2">Crafting Unforgettable Retreat Experiences</h2>
                <p className="body-display">
                  Easy Stay Retreats was founded with a simple vision: to create serene and inspiring spaces where individuals can reconnect with themselves, nature, and a community of like-minded people. We believe in the power of immersive experiences to foster well-being, personal growth, and lasting memories.
                </p>
                <p className="body-display">
                  From the tranquil beaches of Bali to the majestic mountains of Colorado, each of our retreats is carefully curated to offer a unique blend of relaxation, adventure, and self-discovery. We partner with expert facilitators and local communities to ensure every aspect of your stay is authentic, enriching, and deeply restorative.
                </p>
              </div>
              <div>
                {/* Placeholder for an image */}
                <img src="https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/68bb4a0ebc0d8f7407a48cf3_9USYbfMD250.avif" alt="About Us" className="image-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section">
          <div className="container-large">
            <div className="text-center margin-bottom-4xl">
              <div className="subtitle">Our Values</div>
              <h2 className="heading-style-h2">What Guides Us</h2>
            </div>
            <div className="grid grid-cols-3 gap-lg">
              <div className="text-center">
                <h3 className="heading-style-h3">Mindfulness</h3>
                <p className="body-display small">
                  We encourage presence and awareness in every moment, fostering a deeper connection to self and surroundings.
                </p>
              </div>
              <div className="text-center">
                <h3 className="heading-style-h3">Sustainability</h3>
                <p className="body-display small">
                  Committed to eco-friendly practices, we ensure our retreats respect and preserve natural environments.
                </p>
              </div>
              <div className="text-center">
                <h3 className="heading-style-h3">Community</h3>
                <p className="body-display small">
                  We build supportive environments where guests can connect, share, and grow together.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
