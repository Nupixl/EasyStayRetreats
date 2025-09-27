import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { v4 as uuidv4 } from "uuid";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import axios from "axios";
import { escapeHtml } from "../../utils/sanitize";
import { obfuscateMarkerPositions, spreadOverlappingMarkers } from "../../utils/spreadMarkers";
import { withBasePath } from "../../utils/basePath";

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const LeafletMap = ({ setData, location, places, setPlaces }) => {
  const DEFAULT_CENTER = location || [37.4316, -78.6569];
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.setView(location);
    }
  }, [location]);

  // Memoize the pushPlaces function to prevent unnecessary re-renders
  const pushPlaces = useCallback((results = []) => {
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

    // Only process if we have valid coordinates
    const validResults = formatted.filter(place => place.lat && place.lng);
    
    if (validResults.length === 0) {
      setPlaces([]);
      return;
    }

    // Simplified marker processing for better performance
    const obfuscated = obfuscateMarkerPositions(validResults, {
      maxOffsetKm: 2, // Reduced from 3
      minOffsetKm: 0.3, // Reduced from 0.5
      minSeparationKm: 0.5, // Reduced from 1
    });
    const spaced = spreadOverlappingMarkers(obfuscated, { radius: 0 });
    setPlaces(spaced);
  }, [setPlaces]);

  const fallbackToAllProperties = async () => {
    try {
      const { data } = await axios.get(withBasePath("/api/properties"));
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setData({ loading: false, results: data.data, error: null });
        pushPlaces(data.data);
        if (mapRef.current) {
          const [first] = data.data;
          if (first?.geolocation?.lat && first?.geolocation?.lng) {
            mapRef.current.setView(
              [first.geolocation.lat, first.geolocation.lng],
              6
            );
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
    setPlaces([]);
    return false;
  };

  const getData = useCallback(async (m) => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    
    setIsLoading(true);
    setData({ loading: true, results: [], error: null });
    
    try {
      const { data } = await axios.get(withBasePath("/api/properties/search"), {
        params: {
          data: m,
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
          setPlaces([]);
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
        setPlaces([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, pushPlaces, setData, setPlaces]);

  const getBounds = useCallback((map) => {
    const bounds = map?.getBounds();
    const northWest = bounds?.getNorthWest(),
      northEast = bounds?.getNorthEast(),
      southWest = bounds?.getSouthWest(),
      southEast = bounds?.getSouthEast();
    const markers = [
      {
        lat: northWest?.lat,
        lng: northWest?.lng,
      },
      {
        lat: northEast?.lat,
        lng: northEast?.lng,
      },
      {
        lat: southWest?.lat,
        lng: southWest?.lng,
      },
      {
        lat: southEast?.lat,
        lng: southEast?.lng,
      },
    ];
    getData(markers);
  }, [getData]);

  // Debounced version of GetLngAndLat to reduce API calls
  const debouncedGetLngAndLat = useMemo(
    () => debounce(() => {
      if (mapRef.current) {
        getBounds(mapRef.current);
      }
    }, 500), // 500ms debounce
    [getBounds]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.on("moveend", debouncedGetLngAndLat);
      return () => {
        map.off("moveend", debouncedGetLngAndLat);
      };
    }
  }, [debouncedGetLngAndLat]);

  // const [mk, setMk] = useState([]);

  // useEffect(() => {
  //   console.log(mapRef.current);
  //   if (mapRef.current) {
  //     mapRef.current.on("click", (e) => {
  //       console.log("object");
  //       setMk((prev) => [{ lat: e.latlng.lat, lng: e.latlng.lng }, ...prev]);
  //     });
  //   }
  // }, [mapRef.current?.getBounds]);
  // console.log(mk);

  // Memoize markers to prevent unnecessary re-renders
  const memoizedMarkers = useMemo(() => {
    return places.map((place) => {
      if (!place?.lat || !place?.lng) return null;
      
      return (
        <Marker
          key={place._id || uuidv4()}
          position={[place.lat, place.lng]}
          icon={L.divIcon({
            html: `<span class="easystay-price-marker ${
              place?.hovered ? "is-active" : ""
            }">${escapeHtml(place?.price)}</span>`,
            className: 'custom-marker',
            iconSize: [60, 30],
            iconAnchor: [30, 15]
          })}
        />
      );
    }).filter(Boolean);
  }, [places]);

  return (
    <MapContainer
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      center={DEFAULT_CENTER}
      zoom={8}
      simpleLayerControl={true}
      whenReady={(map) => {
        getBounds(map.target);
      }}
      // Performance optimizations
      preferCanvas={true}
      zoomControl={true}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      touchZoom={true}
      boxZoom={true}
      keyboard={true}
      dragging={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        noWrap={true}
        // Performance optimizations
        maxZoom={18}
        minZoom={1}
        tileSize={256}
        zoomOffset={0}
        updateWhenZooming={false}
        updateWhenIdle={true}
        keepBuffer={2}
        maxNativeZoom={18}
      />

      {memoizedMarkers}
    </MapContainer>
  );
};

export default LeafletMap;
