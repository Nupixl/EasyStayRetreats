import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Location = React.forwardRef(({ listing }, ref) => {
  const [isClient, setIsClient] = useState(false);
  const center = listing?.geolocation || [45.745, 5.65];

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div ref={ref} className="py-8">
      <h1 className="text-2xl mb-4 font-semibold">Location</h1>
      <p className="text-md mb-4">{listing.lt}</p>
      <div className="h-[400px] w-full">
        {isClient ? (
          <MapContainer
            style={{ width: "100%", height: "100%" }}
            center={center}
            zoom={15}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={center} />
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default React.memo(Location);
