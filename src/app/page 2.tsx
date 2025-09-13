'use client';

import { PropertyCard } from '@/components/PropertyCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Easy Stay Retreats
          </h1>
          <p className="text-xl text-gray-600">
            Discover transformative wellness retreats in stunning locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Property Card using your Webflow component */}
          <PropertyCard
            propertyTitle="Mountain Wellness Retreat"
            firstLine="Aspen, Colorado"
            secoundLine="Luxury Cabin"
            price="$450"
            duration="night"
            propertyRating="4.9"
            numberOfReviews="(127)"
            propertyAccolade={true}
            propertyAccoladeType="Super Host"
            accoladeImageDispaly={true}
            accoladeIcon=""
            imageAccoladeAltText="Super Host"
            accoladeImageSrc="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"
            propertyImageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
            propertyImageAltText="Mountain retreat cabin"
            onBookNow={() => console.log('Book now clicked')}
            onViewDetails={() => console.log('View details clicked')}
            onFavorite={() => console.log('Toggle favorite')}
            onShare={() => console.log('Share property')}
            isFavorite={false}
            isAvailable={true}
            discountPercentage={0}
            amenities={["WiFi", "Pool", "Spa", "Kitchen"]}
            hostName="Sarah Johnson"
            hostAvatar="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"
            propertyType="Luxury Cabin"
            maxGuests={6}
            bedrooms={3}
            bathrooms={2}
            checkInTime="3:00 PM"
            checkOutTime="11:00 AM"
            cancellationPolicy="Flexible"
            instantBook={true}
            verified={true}
          />

          <PropertyCard
            propertyTitle="Coastal Meditation Center"
            firstLine="Big Sur, California"
            secoundLine="Ocean View Villa"
            price="$650"
            duration="night"
            propertyRating="4.8"
            numberOfReviews="(89)"
            propertyAccolade={true}
            propertyAccoladeType="Super Host"
            accoladeImageDispaly={true}
            accoladeIcon=""
            imageAccoladeAltText="Super Host"
            accoladeImageSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
            propertyImageSrc="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
            propertyImageAltText="Coastal meditation center"
            onBookNow={() => console.log('Book now clicked')}
            onViewDetails={() => console.log('View details clicked')}
            onFavorite={() => console.log('Toggle favorite')}
            onShare={() => console.log('Share property')}
            isFavorite={false}
            isAvailable={true}
            discountPercentage={0}
            amenities={["WiFi", "Ocean View", "Spa", "Kitchen"]}
            hostName="Michael Chen"
            hostAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
            propertyType="Ocean View Villa"
            maxGuests={8}
            bedrooms={4}
            bathrooms={3}
            checkInTime="3:00 PM"
            checkOutTime="11:00 AM"
            cancellationPolicy="Flexible"
            instantBook={true}
            verified={true}
          />

          <PropertyCard
            propertyTitle="Forest Yoga Sanctuary"
            firstLine="Sedona, Arizona"
            secoundLine="Desert Retreat"
            price="$380"
            duration="night"
            propertyRating="4.7"
            numberOfReviews="(156)"
            propertyAccolade={false}
            propertyAccoladeType=""
            accoladeImageDispaly={false}
            accoladeIcon=""
            imageAccoladeAltText=""
            accoladeImageSrc=""
            propertyImageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
            propertyImageAltText="Forest yoga sanctuary"
            onBookNow={() => console.log('Book now clicked')}
            onViewDetails={() => console.log('View details clicked')}
            onFavorite={() => console.log('Toggle favorite')}
            onShare={() => console.log('Share property')}
            isFavorite={false}
            isAvailable={true}
            discountPercentage={0}
            amenities={["WiFi", "Gym", "Kitchen", "Parking"]}
            hostName="Emma Rodriguez"
            hostAvatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
            propertyType="Desert Retreat"
            maxGuests={4}
            bedrooms={2}
            bathrooms={1}
            checkInTime="3:00 PM"
            checkOutTime="11:00 AM"
            cancellationPolicy="Moderate"
            instantBook={false}
            verified={false}
          />
        </div>
      </div>
    </div>
  );
}