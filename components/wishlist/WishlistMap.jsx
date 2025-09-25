import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { escapeHtml } from "../../utils/sanitize";

// Dynamically import Leaflet components to avoid SSR issues
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

const WishlistMap = ({ places }) => {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import L to avoid SSR issues
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  if (!isClient || !L || !places || places.length === 0) {
    return (
      <div className="w-full h-full min-h-[60vh] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[places[0].lat, places[0].lng]}
      zoom={7}
      scrollWheelZoom={true}
      className="w-full h-full min-h-[60vh]"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {places?.map((place) => {
        return (
          <Marker
            key={uuidv4()}
            position={[place?.lat, place?.lng]}
            icon={L.divIcon({
              html: `<div class="px-4 py-2 rounded-full text-md flex gap-1 font-bold w-[80px] shadow ${
                place?.hovered
                  ? "bg-blackColor text-white"
                  : "bg-white text-blackColor"
              }">
              <span>${escapeHtml(place?.price)}</span>
              <span>❤️</span>
              </div> `,
            })}
          />
        );
      })}
    </MapContainer>
  );
};

export default WishlistMap;
