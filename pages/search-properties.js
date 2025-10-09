import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { EasyStayNav } from "../components";
import { Footer as WebflowFooter } from "../devlink/Footer";
import PlacesListMapSection from "../components/MapFilter/PlacesListMapSection";
import { getParams } from "../utils/handlers";
import Wishlist from "../components/Wishlist";
import LOADING from "../public/images/giphy.gif";
import { withBasePath } from "../utils/basePath";
import { Context } from "./_app";

const Map = dynamic(() => import("../components/MapFilter/LeafletMap"), {
  ssr: false,
});

const SearchMapPage = () => {
  const router = useRouter();
  const { wishlist, setWishlist } = useContext(Context);

  const destination = useMemo(() => {
    const { destination: dest, q } = router.query;
    if (typeof dest === "string" && dest.trim()) return dest;
    if (typeof q === "string" && q.trim()) return q;
    return "all";
  }, [router.query]);

  const [filters, setFilters] = useState(() => ({
    destination: "",
    checkin: null,
    checkout: null,
    numberOfAdults: 0,
    numberOfChildren: 0,
    numberOfInfants: 0,
    numberOfPets: 0,
  }));
  const [data, setData] = useState({
    loading: true,
    results: [],
    error: null,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [initialBounds, setInitialBounds] = useState(null);
  const [initialBoundsLoaded, setInitialBoundsLoaded] = useState(false);

  const createCityBounds = useCallback((coordinates) => {
    if (!Array.isArray(coordinates) || coordinates.length === 0) return null;

    const clampLatitude = (value) => Math.max(-90, Math.min(90, value));
    const clampLongitude = (value) => Math.max(-180, Math.min(180, value));

    const PRIMARY_RADIUS = 0.01; // ~1.1km window to stay within the same neighborhood
    const CLUSTER_PADDING = 0.005;
    const SINGLE_FALLBACK_RADIUS = 0.003; // ~300m fallback radius (≈3 city blocks)

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

    if (!bestCluster) return null;

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
  }, []);

  useEffect(() => {
    if (typeof data === "string") {
      setData(JSON.parse(data));
    }
  }, [data]);

  useEffect(() => {
    if (places.length > 0) {
      const newData = places.map((place) =>
        place._id === hoveredPlace
          ? { ...place, hovered: true }
          : { ...place, hovered: false }
      );
      setPlaces(newData);
    }
  }, [hoveredPlace]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = getParams();
    setFilters((prev) => ({
      ...prev,
      destination,
      checkin: params.checkin && params.checkin !== "null" ? params.checkin : null,
      checkout: params.checkout && params.checkout !== "null" ? params.checkout : null,
      numberOfAdults: Number(params.numberOfAdults) || 0,
      numberOfChildren: Number(params.numberOfChildren) || 0,
      numberOfInfants: Number(params.numberOfInfants) || 0,
      numberOfPets: Number(params.numberOfPets) || 0,
    }));
  }, [destination]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        setUserLocation(null);
      }
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (destination !== "all") {
      setInitialBounds(null);
      setInitialBoundsLoaded(false);
      return () => {
        cancelled = true;
      };
    }

    setInitialBoundsLoaded(false);

    const loadActivePropertyBounds = async () => {
      try {
        const { data: response } = await axios.get(withBasePath("/api/properties"));

        if (
          cancelled ||
          !response?.success ||
          !Array.isArray(response.data) ||
          response.data.length === 0
        ) {
          if (!cancelled) {
            setInitialBounds(null);
            setInitialBoundsLoaded(true);
          }
          return;
        }

        const getCoordinates = (property) => {
          const lat = Number(property?.geolocation?.lat);
          const lng = Number(property?.geolocation?.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          return { lat, lng };
        };

        const selectCityCoordinates = (properties = []) => {
          if (!Array.isArray(properties) || properties.length === 0) {
            return [];
          }

          const grouped = {};

          properties.forEach((property) => {
            const coords = getCoordinates(property);
            if (!coords) return;

            const cityKey =
              property?.lt ||
              [property?.city, property?.state].filter(Boolean).join(", ") ||
              "Unknown";

            if (!grouped[cityKey]) {
              grouped[cityKey] = [];
            }

            grouped[cityKey].push(coords);
          });

          const cityKeys = Object.keys(grouped);
          if (cityKeys.length === 0) {
            return [];
          }

          cityKeys.sort((a, b) => grouped[b].length - grouped[a].length);

          const firstMulti = cityKeys.find((key) => grouped[key].length > 1);
          if (firstMulti) {
            return grouped[firstMulti];
          }

          return grouped[cityKeys[0]] || [];
        };

        const availableCoordinates = selectCityCoordinates(
          response.data.filter((property) => property?.isAvailable !== false)
        );

        const fallbackCoordinates = availableCoordinates.length
          ? availableCoordinates
          : selectCityCoordinates(response.data);

        if (fallbackCoordinates.length === 0) {
          if (!cancelled) {
            setInitialBounds(null);
            setInitialBoundsLoaded(true);
          }
          return;
        }

        const bounds = createCityBounds(fallbackCoordinates);

        if (!cancelled) {
          setInitialBounds(bounds);
          setInitialBoundsLoaded(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.warn("Failed to load active property bounds", error);
          setInitialBounds(null);
          setInitialBoundsLoaded(true);
        }
      }
    };

    loadActivePropertyBounds();

    return () => {
      cancelled = true;
    };
  }, [createCityBounds, destination]);

  useEffect(() => {
    let cancelled = false;

    const determineLocation = async () => {
      let nextLocation = null;

      if (destination && destination !== "all") {
        try {
          const url = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${encodeURIComponent(
            destination.trim()
          )}&format=json&limit=1`;
          const { data: geocode } = await axios.get(url);

          if (Array.isArray(geocode) && geocode.length === 1) {
            const [match] = geocode;
            if (match?.lat && match?.lon) {
              nextLocation = [Number(match.lat), Number(match.lon)];
            }
          }
        } catch (error) {
          console.warn("Failed to geocode destination", error);
        }
      }

      if (!nextLocation && initialBounds) {
        const [[minLat, minLng], [maxLat, maxLng]] = initialBounds;
        nextLocation = [
          (minLat + maxLat) / 2,
          (minLng + maxLng) / 2,
        ];
      }

      if (!nextLocation && userLocation) {
        nextLocation = userLocation;
      }

      if (!nextLocation) {
        nextLocation = [37.4316, -78.6569];
      }

      if (!cancelled) {
        setLocation(nextLocation);
      }
    };

    // For "all" destination, wait a bit for initial bounds, but don't wait forever
    if (destination === "all" && !initialBoundsLoaded) {
      const timeout = setTimeout(() => {
        if (!cancelled) {
          console.log("Initial bounds loading timeout, proceeding with fallback location");
          determineLocation();
        }
      }, 3000);
      
      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    }

    determineLocation();

    return () => {
      cancelled = true;
    };
  }, [destination, initialBounds, initialBoundsLoaded, userLocation]);

  const searchDefaults = useMemo(
    () => ({
      ...filters,
      destination,
    }),
    [filters, destination]
  );

  const mapFilters = useMemo(() => {
    const totalGuests =
      Number(filters.numberOfAdults || 0) +
      Number(filters.numberOfChildren || 0) +
      Number(filters.numberOfInfants || 0);

    return {
      ...filters,
      destination,
      totalGuests,
    };
  }, [filters, destination]);

  const handleApplyFilters = useCallback(
    (payload) => {
      setData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));
      setFilters((prev) => ({
        ...prev,
        ...payload,
      }));
      return Promise.resolve();
    },
    []
  );

  return (
    <>
      <Head>
        <title>
          EasyStay Retreats | {destination ? `${destination} getaways` : "Curated stays"}
        </title>
      </Head>
      <EasyStayNav />
      <div className="flex flex-col-reverse xl:flex-row w-full h-[calc(100vh-65px)] lg:h-[calc(100vh-80px)] relative z-10 gap-6 overflow-hidden">
        <PlacesListMapSection
          data={data}
          hoveredPlace={hoveredPlace}
          setHoveredPlace={setHoveredPlace}
          searchDefaults={searchDefaults}
          onApplyFilters={handleApplyFilters}
        />
        <div className="flex-1 h-full min-h-[360px] w-full min-w-0">
          {location ? (
            <Map
              setData={setData}
              location={location}
              places={places}
              setPlaces={setPlaces}
              initialBounds={initialBounds}
              hoveredPlace={hoveredPlace}
              setHoveredPlace={setHoveredPlace}
              filters={mapFilters}
            />
          ) : (
            <div className="w-full h-full bg-[#e1e1e1] flex items-center justify-center rounded-xl">
              <img src={LOADING.src} className="w-24 h-24" alt="" />
            </div>
          )}
        </div>
      </div>
      <WebflowFooter />
      {wishlist && <Wishlist setWishlist={setWishlist} />}
    </>
  );
};

export default SearchMapPage;
