import React, { useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { obfuscateMarkerPositions, spreadOverlappingMarkers } from "../../utils/spreadMarkers";
// import { v4 as uuidv4 } from "uuid";

let center = {
  lat: 37.4316,
  lng: -78.6569,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

function Map({
  destination,
  markers,
  setData,
  location,
  userLocation,
  hoveredPlace,
  setHoveredPlace,
  places,
  setPlaces,
}) {
  center = location ? { lat: location[0], lng: location[1] } : center;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  const [map, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const pushPlaces = (results = []) => {
    if (typeof setPlaces !== "function") return;

    const formatted = results.map((e) => {
      const lat = Number(e?.geolocation?.lat);
      const lng = Number(e?.geolocation?.lng);
      return {
        lat: Number.isFinite(lat) ? lat : null,
        lng: Number.isFinite(lng) ? lng : null,
        price: e.price,
        _id: e._id,
        hovered: false,
      };
    });

    const obfuscated = obfuscateMarkerPositions(formatted, {
      maxOffsetKm: 3,
      minOffsetKm: 0.5,
      minSeparationKm: 1,
    });
    const spaced = spreadOverlappingMarkers(obfuscated, { radius: 0 });
    setPlaces(spaced);
  };

  const fallbackToAllProperties = async () => {
    try {
      const { data } = await axios.get("/api/properties");
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setData({ loading: false, results: data.data, error: null });
        pushPlaces(data.data);
        if (map) {
          const [first] = data.data;
          if (first?.geolocation?.lat && first?.geolocation?.lng) {
            map.panTo({ lat: first.geolocation.lat, lng: first.geolocation.lng });
            map.setZoom(6);
          }
        }
        return true;
      }
    } catch (fallbackError) {
      console.error("Fallback property load failed:", fallbackError.message);
    }

    setData({
      loading: false,
      results: [],
      error: "No retreats match the current map area. Try panning or zooming out.",
    });
    pushPlaces([]);
    return false;
  };

  const onIdle = async () => {
    if (map) {
      const bounds = map.getBounds();
      var NECorner = bounds.getNorthEast();
      var SWCorner = bounds.getSouthWest();
      var NWCorner = new google.maps.LatLng(NECorner.lat(), SWCorner.lng());
      var SECorner = new google.maps.LatLng(SWCorner.lat(), NECorner.lng());
      const markers = [
        {
          lat: NWCorner?.lat(),
          lng: NWCorner?.lng(),
        },
        {
          lat: NECorner?.lat(),
          lng: NECorner?.lng(),
        },
        {
          lat: SWCorner?.lat(),
          lng: SWCorner?.lng(),
        },
        {
          lat: SECorner?.lat(),
          lng: SECorner?.lng(),
        },
      ];
      try {
        const { data } = await axios("/api/properties/search", {
          params: {
            data: markers,
          },
        });

        if (data.success) {
          if (Array.isArray(data.data) && data.data.length > 0) {
            setData({ loading: false, results: data.data, error: null });
            pushPlaces(data.data);
          } else {
            setData({
              loading: false,
              results: [],
              error: data.message || 'No retreats match the current map area. Try panning or zooming out.',
            });
            pushPlaces([]);
          }
        } else {
          const message = data.error || "Unable to load retreats at the moment.";
          console.error("Map search failed:", message);
          const recovered = await fallbackToAllProperties();
          if (!recovered) {
            setData({
              loading: false,
              results: [],
              error: message,
            });
          }
        }
      } catch (error) {
        const message =
          error.response?.data?.error ||
          error.message ||
          "Unexpected error loading retreats.";
        console.error("Map search failed:", message);
        const recovered = await fallbackToAllProperties();
        if (!recovered) {
          setData({
            loading: false,
            results: [],
            error: message,
          });
        }
      }
    }
  };

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        mapContainerClassName="map"
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ scrollwheel: true }}
        onIdle={onIdle}
      >
        {/* <Marker position={{ lat: 45.745, lng: 5.65 }} /> */}
      </GoogleMap>
    )
  );
}

export default React.memo(Map);
