import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import { v4 as uuidv4 } from "uuid";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import axios from "axios";
import { escapeHtml } from "../../utils/sanitize";
import { obfuscateMarkerPositions, spreadOverlappingMarkers } from "../../utils/spreadMarkers";
import { withBasePath } from "../../utils/basePath";

const getPropertyLink = (property = {}, fallbackId) => {
  if (property?.slug) {
    return `https://www.easystayretreats.homes/properties/${property.slug}`;
  }

  if (property?._id || fallbackId) {
    return `/listings/${property._id || fallbackId}`;
  }

  return "#";
};

const MarkerPreview = ({ place, onEnter, onLeave, onNavigate }) => {
  const property = place?.data || {};
  const images = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : [{ url: "/images/default_image.png" }];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [property?._id]);

  const showPrev = (event) => {
    event.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNext = (event) => {
    event.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleNavigate = (event) => {
    event.stopPropagation();
    onNavigate();
  };

  const activeImage = images[currentIndex];

  return (
    <div
      className="w-56 max-w-[220px] text-left"
      onMouseEnter={() => onEnter(place._id)}
      onMouseLeave={() => onLeave(place._id)}
    >
      <div className="relative w-full h-36 overflow-hidden rounded-2xl shadow-lg">
        <img
          src={activeImage?.url}
          alt={property?.title || "Retreat preview"}
          className="h-full w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-xs font-semibold text-white hover:bg-black/70"
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-xs font-semibold text-white hover:bg-black/70"
            >
              {">"}
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <div className="text-sm font-semibold text-blackColor overflow-hidden text-ellipsis">
          {property?.title || "Untitled Retreat"}
        </div>
        <div className="text-xs text-lightTextColor">
          {place?.price} {property?.priceLabel ? property.priceLabel : "per stay"}
        </div>
        <button
          type="button"
          onClick={handleNavigate}
          className="mt-2 inline-flex h-8 items-center justify-center rounded-full bg-primaryColor px-3 text-xs font-semibold text-white hover:bg-primaryColor/90"
        >
          View property
        </button>
      </div>
    </div>
  );
};

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

const LeafletMap = ({
  setData,
  location,
  places,
  setPlaces,
  initialBounds,
  hoveredPlace,
  setHoveredPlace,
}) => {
  const DEFAULT_CENTER = location || [37.4316, -78.6569];
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasAppliedInitialBounds = useRef(false);
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [lockedMarkerId, setLockedMarkerId] = useState(null);
  const lockedMarkerIdRef = useRef(null);
  const selectedMarkerIdRef = useRef(null);

  useEffect(() => {
    lockedMarkerIdRef.current = lockedMarkerId;
  }, [lockedMarkerId]);

  useEffect(() => {
    selectedMarkerIdRef.current = selectedMarkerId;
  }, [selectedMarkerId]);

  useEffect(() => {
    const availableIds = new Set((places || []).map((place) => place?._id));

    if (selectedMarkerIdRef.current && !availableIds.has(selectedMarkerIdRef.current)) {
      setSelectedMarkerId(null);
    }

    if (lockedMarkerIdRef.current && !availableIds.has(lockedMarkerIdRef.current)) {
      setLockedMarkerId(null);
    }

    if (activeMarkerId && !availableIds.has(activeMarkerId)) {
      setActiveMarkerId(null);
    }
  }, [places, activeMarkerId]);

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
        data: e,
      };
    });

    // Only process if we have valid coordinates
    const validResults = formatted.filter(
      (place) => Number.isFinite(place.lat) && Number.isFinite(place.lng)
    );
    
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
    () =>
      debounce(() => {
        if (mapRef.current) {
          getBounds(mapRef.current);
        }
      }, 500), // 500ms debounce
    [getBounds]
  );

  useEffect(() => {
    if (!initialBounds) {
      hasAppliedInitialBounds.current = false;
      return;
    }

    if (!mapRef.current || hasAppliedInitialBounds.current) return;

    try {
      const bounds = L.latLngBounds(initialBounds);
      mapRef.current.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 15,
      });
      hasAppliedInitialBounds.current = true;
      getBounds(mapRef.current);
    } catch (error) {
      console.warn("Failed to apply initial map bounds", error);
    }
  }, [initialBounds, getBounds]);

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

  const handlePreviewEnter = useCallback(
    (placeId) => {
      setLockedMarkerId(placeId);
      setActiveMarkerId(placeId);
      if (setHoveredPlace) {
        setHoveredPlace(placeId);
      }
    },
    [setHoveredPlace]
  );

  const handlePreviewLeave = useCallback(
    (placeId) => {
      setLockedMarkerId((current) => (current === placeId ? null : current));

      if (selectedMarkerIdRef.current === placeId) {
        setActiveMarkerId(placeId);
        return;
      }

      const fallbackId = selectedMarkerIdRef.current || null;
      setActiveMarkerId(fallbackId);

      if (!fallbackId && setHoveredPlace) {
        setHoveredPlace(null);
      }
    },
    [setHoveredPlace]
  );

  const openPropertyPage = useCallback((place) => {
    const url = getPropertyLink(place?.data, place?._id);
    if (!url || url === "#") return;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener");
    }
  }, []);

  // Memoize markers to prevent unnecessary re-renders
  const memoizedMarkers = useMemo(() => {
    return places
      .map((place) => {
        if (!Number.isFinite(place?.lat) || !Number.isFinite(place?.lng)) return null;

        const isMarkerActive =
          place?.hovered ||
          hoveredPlace === place._id ||
          activeMarkerId === place._id ||
          lockedMarkerId === place._id ||
          selectedMarkerId === place._id;

        return (
          <Marker
            key={place._id || uuidv4()}
            position={[place.lat, place.lng]}
            icon={L.divIcon({
              html: `<span class="easystay-price-marker ${
                isMarkerActive ? "is-active" : ""
              }">${escapeHtml(place?.price)}</span>`,
              className: "custom-marker",
              iconSize: [60, 30],
              iconAnchor: [30, 15],
            })}
            eventHandlers={{
              mouseover: () => {
                setActiveMarkerId(place._id);
                if (setHoveredPlace) {
                  setHoveredPlace(place._id);
                }
              },
              mouseout: () => {
                const lockId = lockedMarkerIdRef.current;
                const selectedId = selectedMarkerIdRef.current;

                if (!selectedId && (!lockId || lockId !== place._id) && setHoveredPlace) {
                  setHoveredPlace(null);
                }

                if (selectedId === place._id || lockId === place._id) {
                  setActiveMarkerId(place._id);
                  return;
                }

                if (selectedId) {
                  setActiveMarkerId(selectedId);
                } else if (lockId) {
                  setActiveMarkerId(lockId);
                } else {
                  setActiveMarkerId(null);
                }
              },
              click: () => {
                if (selectedMarkerIdRef.current === place._id) {
                  openPropertyPage(place);
                  return;
                }

                setSelectedMarkerId(place._id);
                setActiveMarkerId(place._id);
                setLockedMarkerId(place._id);
                if (setHoveredPlace) {
                  setHoveredPlace(place._id);
                }
              },
            }}
          >
            {(isMarkerActive || activeMarkerId === place._id) && (
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                permanent
                interactive
                className="!bg-transparent !border-none !shadow-none"
              >
                <div className="rounded-2xl bg-white p-3 shadow-xl">
                  <MarkerPreview
                    place={place}
                    onEnter={handlePreviewEnter}
                    onLeave={handlePreviewLeave}
                    onNavigate={() => openPropertyPage(place)}
                  />
                </div>
              </Tooltip>
            )}
          </Marker>
        );
      })
      .filter(Boolean);
  }, [
    places,
    activeMarkerId,
    lockedMarkerId,
    selectedMarkerId,
    handlePreviewEnter,
    handlePreviewLeave,
    openPropertyPage,
    setHoveredPlace,
    hoveredPlace,
  ]);

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
