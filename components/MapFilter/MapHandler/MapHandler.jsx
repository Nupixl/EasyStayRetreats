import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const MapConsumer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapConsumer),
  { ssr: false }
);

const MapHandler = ({ children, ...rest }) => {
  const [L, setL] = useState(null);
  const [ReactLeaflet, setReactLeaflet] = useState(null);

  useEffect(() => {
    // Dynamically import Leaflet and ReactLeaflet to avoid SSR issues
    Promise.all([
      import("leaflet"),
      import("react-leaflet")
    ]).then(([leaflet, reactLeaflet]) => {
      setL(leaflet.default);
      setReactLeaflet(reactLeaflet);
      
      // Configure Leaflet icons
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "/images/marker-icon-2x.png",
        iconUrl: "/images/marker-icon.png",
        shadowUrl: "/images/marker-shadow.png",
      });
    });
  }, []);

  if (!L || !ReactLeaflet) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer {...rest}>
      <MapConsumer>{(map) => children(ReactLeaflet, map)}</MapConsumer>
    </MapContainer>
  );
};

export default MapHandler;
