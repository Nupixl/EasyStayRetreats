'use client';

import { NavbarWrapper, NavbarContainer, NavbarBrand, NavbarMenu, NavbarLink, NavbarButton } from '@/components/_Builtin/Navbar';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
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
              <h1 className="heading-style-h1">Contact Us</h1>
              <p className="body-display large">
                Have questions? We're here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section">
          <div className="container-large">
            <div className="w-form">
              <form id="email-form" name="email-form" data-name="Email Form" method="get" className="form-block">
                <label htmlFor="name" className="field-label">Name</label>
                <input type="text" className="text-field w-input" maxLength={256} name="name" data-name="Name" placeholder="Enter your name" id="name" />
                <label htmlFor="email" className="field-label">Email Address</label>
                <input type="email" className="text-field w-input" maxLength={256} name="email" data-name="Email" placeholder="Enter your email address" id="email" required />
                <label htmlFor="message" className="field-label">Message</label>
                <textarea id="message" name="message" maxLength={5000} data-name="Message" placeholder="Your message here..." className="textarea w-input"></textarea>
                <input type="submit" value="Submit" data-wait="Please wait..." className="button w-button" />
              </form>
              <div className="success-message w-form-done">
                <div>Thank you! Your submission has been received!</div>
              </div>
              <div className="error-message w-form-fail">
                <div>Oops! Something went wrong while submitting the form.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="section">
          <div className="container-large">
            <div className="text-center margin-bottom-4xl">
              <h2 className="text-size-3xl text-weight-bold margin-bottom-lg">
                Why Choose StayBright?
              </h2>
              <p className="text-size-large text-color-neutral-600">
                We make property management simple, profitable, and stress-free.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-lg">
              <div className="text-center">
                <div className="text-size-4xl margin-bottom-md">📈</div>
                <h3 className="text-size-xl text-weight-semibold margin-bottom-sm">Maximize Revenue</h3>
                <p className="text-color-neutral-600">
                  Our dynamic pricing and marketing strategies help you earn more from your property.
                </p>
              </div>
              <div className="text-center">
                <div className="text-size-4xl margin-bottom-md">🧹</div>
                <h3 className="text-size-xl text-weight-semibold margin-bottom-sm">Professional Cleaning</h3>
                <p className="text-color-neutral-600">
                  Hotel-grade cleaning and maintenance ensure your property is always guest-ready.
                </p>
              </div>
              <div className="text-center">
                <div className="text-size-4xl margin-bottom-md">📞</div>
                <h3 className="text-size-xl text-weight-semibold margin-bottom-sm">24/7 Support</h3>
                <p className="text-color-neutral-600">
                  Round-the-clock guest support and property management for complete peace of mind.
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
