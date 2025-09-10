import Image from 'next/image'

export function Hero() {
  return (
    <section className="section_hero">
      <div className="container-large padding-global padding-section-large">
        <div className="hero_content">
          <div className="hero_text-wrapper">
            <h1 className="heading-style-h1 text-align-center margin-bottom-large">
              Transform Your Life Through
              <span className="text-color-primary"> Mindful Retreats</span>
            </h1>
            <p className="text-size-large text-align-center margin-bottom-xl text-color-neutral-600">
              Discover inner peace and renewal at our carefully curated wellness retreats 
              in the world's most beautiful locations.
            </p>
            <div className="hero_button-wrapper align-center">
              <a href="/search-properties" className="button is-primary margin-bottom-small">
                Search Properties
              </a>
              <a href="#retreats" className="button is-secondary">
                View Retreats
              </a>
            </div>
          </div>
          <div className="hero_image-wrapper">
            <div className="hero_image-container">
              <Image
                src="/images/hero-retreat.jpg"
                alt="Peaceful retreat setting with mountains and meditation"
                width={800}
                height={600}
                priority
                className="hero_image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
