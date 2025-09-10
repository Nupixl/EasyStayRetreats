import { BookingForm } from '@/components/booking-form'

export default function BookPage() {
  return (
    <section className="section_booking">
      <div className="container-medium padding-global padding-section-large">
        <div className="booking_header text-align-center margin-bottom-xl">
          <h1 className="heading-style-h1 margin-bottom-medium">
            Book Your Retreat
          </h1>
          <p className="text-size-large text-color-neutral-600">
            Ready to transform your life? Choose your perfect retreat and let's get started.
          </p>
        </div>
        
        <div className="booking_content">
          <div className="booking_info">
            <h2 className="heading-style-h2 margin-bottom-large">
              Why Choose Easy Stay Retreats?
            </h2>
            
            <div className="booking_benefits">
              <div className="booking_benefit">
                <h3 className="heading-style-h4 margin-bottom-small">
                  🧘‍♀️ Expert Guidance
                </h3>
                <p className="text-size-regular text-color-neutral-600">
                  Learn from certified meditation and yoga instructors with years of experience.
                </p>
              </div>
              
              <div className="booking_benefit">
                <h3 className="heading-style-h4 margin-bottom-small">
                  🌍 Stunning Locations
                </h3>
                <p className="text-size-regular text-color-neutral-600">
                  Immerse yourself in the world's most beautiful and peaceful natural settings.
                </p>
              </div>
              
              <div className="booking_benefit">
                <h3 className="heading-style-h4 margin-bottom-small">
                  👥 Small Groups
                </h3>
                <p className="text-size-regular text-color-neutral-600">
                  Intimate retreats with maximum 12 participants for personalized attention.
                </p>
              </div>
              
              <div className="booking_benefit">
                <h3 className="heading-style-h4 margin-bottom-small">
                  🍃 Holistic Approach
                </h3>
                <p className="text-size-regular text-color-neutral-600">
                  Comprehensive wellness including meditation, yoga, nutrition, and nature therapy.
                </p>
              </div>
            </div>
          </div>
          
          <div className="booking_form-section">
            <BookingForm retreatId={1} retreatTitle="Mountain Zen Retreat" />
          </div>
        </div>
      </div>
    </section>
  )
}
