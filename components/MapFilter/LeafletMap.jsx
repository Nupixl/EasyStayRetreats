import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import { v4 as uuidv4 } from "uuid";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import axios from "axios";
import { escapeHtml } from "../../utils/sanitize";
import { withBasePath } from "../../utils/basePath";
import { obfuscateMarkerPositions, spreadOverlappingMarkers } from "../../utils/spreadMarkers";

const PRIMARY_RADIUS = 0.01;
const CLUSTER_PADDING = 0.005;
const SINGLE_FALLBACK_RADIUS = 0.003;

const clampLatitude = (value) => Math.max(-90, Math.min(90, value));
const clampLongitude = (value) => Math.max(-180, Math.min(180, value));

const buildBoundsFromCoordinates = (coordinates = []) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return null;
  }

  let bestCluster = null;

  coordinates.forEach((origin) => {
    const members = coordinates.filter((candidate) => {
      return (
        Math.abs(candidate.lat - origin.lat) <= PRIMARY_RADIUS &&
        Math.abs(candidate.lng - origin.lng) <= PRIMARY_RADIUS
      );
    });

    if (!bestCluster || members.length > bestCluster.count) {
      bestCluster = {
        count: members.length,
        members,
        origin,
      };
    }
  });

  if (!bestCluster) {
    return null;
  }

  if (bestCluster.count > 1) {
    const clusterLatitudes = bestCluster.members.map(({ lat }) => lat);
    const clusterLongitudes = bestCluster.members.map(({ lng }) => lng);

    const minLat = Math.min(...clusterLatitudes) - CLUSTER_PADDING;
    const maxLat = Math.max(...clusterLatitudes) + CLUSTER_PADDING;
    const minLng = Math.min(...clusterLongitudes) - CLUSTER_PADDING;
    const maxLng = Math.max(...clusterLongitudes) + CLUSTER_PADDING;

    return [
      [clampLatitude(minLat), clampLongitude(minLng)],
      [clampLatitude(maxLat), clampLongitude(maxLng)],
    ];
  }

  const { origin } = bestCluster;

  return [
    [
      clampLatitude(origin.lat - SINGLE_FALLBACK_RADIUS),
      clampLongitude(origin.lng - SINGLE_FALLBACK_RADIUS),
    ],
    [
      clampLatitude(origin.lat + SINGLE_FALLBACK_RADIUS),
      clampLongitude(origin.lng + SINGLE_FALLBACK_RADIUS),
    ],
  ];
};

const getPropertyLink = (property = {}, fallbackId) => {
  if (property?.slug) {
    return `https://www.easystayretreats.homes/properties/${property.slug}`;
  }

  if (property?._id || fallbackId) {
    return `/listings/${property._id || fallbackId}`;
  }

  return "#";
};

const toTitleCase = (value = "") =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const normalizePropertyMeta = (property = {}) => {
  if (!property || typeof property !== "object") {
    return {
      availabilityStatus: "Available",
      availabilityNormalized: "available",
      isAvailable: true,
      personCapacity: null,
    };
  }

  const baseNormalized =
    typeof property.availabilityNormalized === "string"
      ? property.availabilityNormalized.trim().toLowerCase()
      : null;

  let normalized = baseNormalized;

  if (!normalized && typeof property.availabilityStatus === "string") {
    normalized = property.availabilityStatus.trim().toLowerCase();
  }

  if (!normalized) {
    if (property.isAvailable === true) normalized = "available";
    else if (property.isAvailable === false) normalized = "unavailable";
  }

  if (!normalized) {
    const fallback = property.availability ?? property.status;
    if (typeof fallback === "boolean") {
      normalized = fallback ? "available" : "unavailable";
    } else if (typeof fallback === "string") {
      normalized = fallback.trim().toLowerCase();
    }
  }

  if (!normalized) {
    normalized = "available";
  }

  const personCapacity = Number(
    property.personCapacity ??
      property.person_capacity ??
      property.guests ??
      property.max_guests ??
      property?.data?.personCapacity ??
      property?.data?.person_capacity
  );

  return {
    ...property,
    availabilityNormalized: normalized,
    availabilityStatus: property.availabilityStatus || toTitleCase(normalized),
    isAvailable:
      property.isAvailable !== undefined ? property.isAvailable : normalized === "available",
    personCapacity: Number.isFinite(personCapacity) ? personCapacity : null,
  };
};

const filterAndSortResults = (results = [], activeFilters = {}) => {
  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }

  const withIndex = results.map((property, index) => ({
    ...normalizePropertyMeta(property),
    __order: index,
  }));

  const totalGuests = Number(activeFilters.totalGuests || 0);

  const sorted = withIndex
    .map((property) => {
      const capacity = Number(property.personCapacity);
      const hasCapacity = Number.isFinite(capacity);
      const canAccommodate = totalGuests
        ? hasCapacity
          ? capacity >= totalGuests
          : true
        : true;
      const capacityDiff = totalGuests
        ? hasCapacity
          ? Math.max(0, capacity - totalGuests)
          : Number.MAX_SAFE_INTEGER
        : 0;
      const availabilityScore = property.availabilityNormalized === "available" ? 2 : 1;

      return {
        property,
        availabilityScore,
        accommodateScore: canAccommodate ? 1 : 0,
        capacityDiff,
        order: property.__order,
      };
    })
    .sort((a, b) => {
      if (b.availabilityScore !== a.availabilityScore) {
        return b.availabilityScore - a.availabilityScore;
      }

      if (b.accommodateScore !== a.accommodateScore) {
        return b.accommodateScore - a.accommodateScore;
      }

      if (a.capacityDiff !== b.capacityDiff) {
        return a.capacityDiff - b.capacityDiff;
      }

      return a.order - b.order;
    })
    .map(({ property }) => property);

  return sorted.map(({ __order, ...rest }) => rest);
};

const MarkerPreview = ({ place, onEnter, onLeave, onNavigate }) => {
  const property = place?.data || {};
  const images = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : [{ url: "/images/default_image.png" }];
  const [currentIndex, setCurrentIndex] = useState(0);
  const availabilityRaw =
    property?.availabilityStatus ||
    property?.availability_status ||
    property?.availability?.status ||
    "available";
  const availabilityStatus =
    typeof availabilityRaw === "string"
      ? availabilityRaw
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "Available";
  const availabilityTone = (() => {
    const normalized =
      typeof availabilityRaw === "string" ? availabilityRaw.toLowerCase() : "available";
    if (normalized === "available") {
      return {
        badge: "bg-emerald-50",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      };
    }

    if (normalized === "booked" || normalized === "unavailable" || normalized === "blocked") {
      return {
        badge: "bg-rose-50",
        text: "text-rose-600",
        dot: "bg-rose-500",
      };
    }

    return {
      badge: "bg-amber-50",
      text: "text-amber-600",
      dot: "bg-amber-500",
    };
  })();

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
        <div className="mt-1 flex items-center justify-between text-xs font-semibold text-lightTextColor">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${availabilityTone.badge} ${availabilityTone.text}`}
          >
            <span className={`h-2 w-2 rounded-full ${availabilityTone.dot}`} />
            {availabilityStatus}
          </span>
          <button
            type="button"
            onClick={handleNavigate}
            className="inline-flex items-center justify-center rounded-full border border-primaryColor px-3 py-1 text-[11px] font-semibold text-primaryColor hover:bg-primaryColor hover:text-white"
          >
            View details
          </button>
        </div>
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
  filters = {},
}) => {
  const DEFAULT_CENTER = location || [37.4316, -78.6569];
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const handleMapRef = useCallback(
    (map) => {
      mapRef.current = map || null;
      setMapInstance(map || null);
    },
    [setMapInstance]
  );
  const [isLoading, setIsLoading] = useState(false);
  const hasAppliedInitialBounds = useRef(false);
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [lockedMarkerId, setLockedMarkerId] = useState(null);
  const lockedMarkerIdRef = useRef(null);
  const selectedMarkerIdRef = useRef(null);
  const filtersRef = useRef(filters);

  const focusMapOnAvailableProperties = useCallback(
    (properties = []) => {
      if (!mapRef.current || !Array.isArray(properties) || properties.length === 0) {
        return;
      }

      const grouped = {};

      properties.forEach((property) => {
        if (property?.isAvailable === false) return;

        const source = property?.geolocation || property?.data?.geolocation;
        const lat = Number(source?.lat);
        const lng = Number(source?.lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return;
        }

        const cityKey =
          property?.lt ||
          property?.data?.lt ||
          [property?.data?.city, property?.data?.state].filter(Boolean).join(", ") ||
          "Unknown";

        if (!grouped[cityKey]) {
          grouped[cityKey] = [];
        }

        grouped[cityKey].push({ lat, lng });
      });

      const cityKeys = Object.keys(grouped);
      if (cityKeys.length === 0) {
        return;
      }

      cityKeys.sort((a, b) => grouped[b].length - grouped[a].length);

      const firstMulti = cityKeys.find((key) => grouped[key].length > 1);
      const targetCoordinates = firstMulti ? grouped[firstMulti] : grouped[cityKeys[0]];
      const bounds = buildBoundsFromCoordinates(targetCoordinates);

      if (bounds) {
        mapRef.current.fitBounds(bounds, {
          padding: [40, 40],
          maxZoom: 14,
        });
      }
    },
    []
  );
  const abortControllerRef = useRef(null);
  const lastRequestTimeRef = useRef(0);

  useEffect(() => {
    lockedMarkerIdRef.current = lockedMarkerId;
  }, [lockedMarkerId]);

  useEffect(() => {
    selectedMarkerIdRef.current = selectedMarkerId;
  }, [selectedMarkerId]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

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
  }, [location, mapInstance]);

  // Memoize the pushPlaces function to prevent unnecessary re-renders
  const pushPlaces = useCallback((results = []) => {
    const formatted = results.map((property) => {
      const meta = normalizePropertyMeta(property);
      const lat = Number(meta?.geolocation?.lat);
      const lng = Number(meta?.geolocation?.lng);
      return {
        lat: Number.isFinite(lat) ? lat : null,
        lng: Number.isFinite(lng) ? lng : null,
        price: meta.price,
        _id: meta._id,
        hovered: false,
        data: meta,
        availabilityStatus: meta.availabilityStatus,
        availabilityNormalized: meta.availabilityNormalized,
        isAvailable: meta.isAvailable,
        personCapacity: meta.personCapacity,
        originalLat: Number.isFinite(lat) ? lat : null,
        originalLng: Number.isFinite(lng) ? lng : null,
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

    const obfuscated = obfuscateMarkerPositions(validResults, {
      maxOffsetKm: 0.3, // ~3 city blocks (~300m)
      minOffsetKm: 0.05,
      minSeparationKm: 0.12,
    });

    const spaced = spreadOverlappingMarkers(obfuscated, {
      radius: 0.0002,
      precision: 6,
    });

    setPlaces(spaced);
  }, [setPlaces]);

  const fallbackToAllProperties = useCallback(async (shouldRefocus = false) => {
    try {
      const { data } = await axios.get(withBasePath("/api/properties"));
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const activeFilters = filtersRef.current || {};
        const processed = filterAndSortResults(data.data, activeFilters);
        setData({ loading: false, results: processed, error: null });
        pushPlaces(processed);
        if (shouldRefocus) {
          focusMapOnAvailableProperties(processed);
        }
        return true;
      }
    } catch (fallbackError) {
      console.error("Fallback property load failed:", fallbackError.message);
    }

    setData({
      loading: false,
      results: [],
      error:
        "No retreats match the current filters or map area. Adjust your dates or guest count, or try panning/zooming out.",
    });
    setPlaces([]);
    return false;
  }, [focusMapOnAvailableProperties, pushPlaces, setData, setPlaces]);

  const getData = useCallback(
    async (m, options = { shouldRefocus: false, bypassThrottle: false }) => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTimeRef.current;
      const shouldBypassThrottle = Boolean(options?.bypassThrottle);

      if (!shouldBypassThrottle && timeSinceLastRequest < 300) {
        console.log("Request throttled, too soon since last request");
        return;
      }

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      lastRequestTimeRef.current = now;

      console.log("Making API request for bounds:", m);
      setIsLoading(true);
      setData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const activeFilters = filtersRef.current || {};

      try {
        const { data } = await axios.get(withBasePath("/api/properties/search"), {
          params: {
            data: m,
            checkin: activeFilters.checkin || undefined,
            checkout: activeFilters.checkout || undefined,
            numberOfAdults: activeFilters.numberOfAdults || undefined,
            numberOfChildren: activeFilters.numberOfChildren || undefined,
            numberOfInfants: activeFilters.numberOfInfants || undefined,
            numberOfPets: activeFilters.numberOfPets || undefined,
            totalGuests: activeFilters.totalGuests || undefined,
          },
          signal: controller.signal,
        });

        if (data.success) {
          if (Array.isArray(data.data) && data.data.length > 0) {
            const processed = filterAndSortResults(data.data, activeFilters);
            setData({ loading: false, results: processed, error: null });
            pushPlaces(processed);
            if (options.shouldRefocus) {
              focusMapOnAvailableProperties(processed);
            }
          } else {
            const recovered = await fallbackToAllProperties(options.shouldRefocus);
            if (!recovered) {
              setData({
                loading: false,
                results: [],
                error:
                  data.message ||
                  "No retreats match the current filters or map area. Adjust your dates or guest count, or try panning/zooming out.",
              });
              setPlaces([]);
            }
          }
        } else {
          const message = data.error || "Unable to load retreats at the moment.";
          console.error("Map search failed:", message);
          const recovered = await fallbackToAllProperties(options.shouldRefocus);
          if (!recovered) {
            setData({
              loading: false,
              results: [],
              error: message,
            });
          }
        }
      } catch (error) {
        // Ignore cancelled requests
        const errorCode = error?.code || error?.name;
        if (errorCode === 'ERR_CANCELED' || errorCode === 'CanceledError' || errorCode === 'AbortError') {
          console.log("Request was aborted");
          return;
        }

        const message =
          error.response?.data?.error ||
          error.message ||
          "Unexpected error loading retreats.";
        console.error("Map search failed:", message);
        const recovered = await fallbackToAllProperties(options.shouldRefocus);
        if (!recovered) {
          setData({
            loading: false,
            results: [],
            error: message,
          });
          setPlaces([]);
        }
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
        setIsLoading(false);
      }
    },
    [fallbackToAllProperties, focusMapOnAvailableProperties, pushPlaces, setData, setPlaces]
  );

  const getBounds = useCallback(
    (map, options = { shouldRefocus: false, bypassThrottle: false }) => {
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
    getData(markers, options);
  }, [getData]);

  // Debounced version of GetLngAndLat to reduce API calls
  const debouncedGetLngAndLat = useMemo(
    () =>
      debounce(() => {
        if (mapRef.current) {
          getBounds(mapRef.current, { shouldRefocus: false });
        }
      }, 400),
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
      getBounds(mapRef.current, { shouldRefocus: true, bypassThrottle: true });
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
  }, [debouncedGetLngAndLat, mapInstance]);

  useEffect(() => {
    if (mapRef.current) {
      getBounds(mapRef.current, { shouldRefocus: true, bypassThrottle: true });
    }
  }, [filters, getBounds, mapInstance]);

  useEffect(() => {
    if (!mapInstance) return;
    getBounds(mapInstance, { shouldRefocus: true, bypassThrottle: true });
  }, [mapInstance, getBounds]);

  // Cleanup effect to cancel any pending requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

        const availabilityNormalized =
          (place.availabilityNormalized ||
            place.data?.availabilityNormalized ||
            "available"
          ).toString().toLowerCase();
        const availabilityStatus =
          place.availabilityStatus ||
          place.data?.availabilityStatus ||
          toTitleCase(availabilityNormalized);
        const statusClass =
          availabilityNormalized === "available" ? "is-available" : "is-unavailable";

        return (
          <Marker
            key={place._id || uuidv4()}
            position={[place.lat, place.lng]}
            icon={L.divIcon({
              html: `<span class="easystay-price-marker ${statusClass} ${
                isMarkerActive ? "is-active" : ""
              }">${escapeHtml(availabilityStatus)}</span>`,
              className: "custom-marker",
              iconSize: [90, 32],
              iconAnchor: [45, 16],
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
      ref={handleMapRef}
      style={{ width: "100%", height: "100%" }}
      center={DEFAULT_CENTER}
      zoom={8}
      simpleLayerControl={true}
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
