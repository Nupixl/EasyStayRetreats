import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { EasyStayNav, SearchPanel } from "../../components";
import Wishlist from "../../components/Wishlist";
import FilterModal from "../../components/MapFilter/Filters";
import ListingsLoading from "../../components/Loading/ListingsLoading";
import { PropertyDirectory } from "../../devlink/PropertyDirectory";
import { MapElement } from "../../devlink/MapElement";
import { PropertyCard } from "../../devlink/PropertyCard";
import { Context } from "../_app";
import { getParams } from "../../utils/handlers";
import LOADING from "../../public/images/giphy.gif";

const LeafletMap = dynamic(() => import("../../components/MapFilter/LeafletMap"), {
  ssr: false,
});

const getPrimaryImages = (images = []) =>
  (Array.isArray(images) ? images : [])
    .map((img) => (typeof img === "string" ? { url: img } : img))
    .filter((img) => img && typeof img.url === "string" && img.url.trim().length > 0)
    .slice(0, 5)
    .map((img) => img.url.trim());

const toPropertyCardProps = (property) => {
  const locationLabel = typeof property?.lt === "string" ? property.lt : "";
  const [cityPart = "", statePart = ""] = locationLabel
    .split(",")
    .map((part) => part.trim())
    .concat(["", ""]);

  const images = getPrimaryImages(property?.images);

  return {
    slug: property?._id ?? property?.slug ?? "property",
    locationPropertyTitle: property?.title || "EasyStay Retreat",
    locationCity: cityPart,
    locationState: statePart,
    locationCitySmall: cityPart,
    locationStateSmall: statePart,
    locationDataAddress: locationLabel,
    locationDataLat:
      property?.geolocation?.lat !== undefined ? Number(property.geolocation.lat) : undefined,
    locationDataLng:
      property?.geolocation?.lng !== undefined ? Number(property.geolocation.lng) : undefined,
    propertyPriceMonthlyPrice: property?.price || "$0",
    propertyDurationDuration: property?.priceLabel || "per stay",
    propertyReviewPropertyRating: property?.rating || "4.5",
    propertyReviewNumberOfReviews: property?.review || "",
    propertyListingsNumberOfGuest: property?.guests ? String(property.guests) : "2",
    propertyListingsNumberOfBedrooms: property?.bedrooms ? String(property.bedrooms) : "2",
    propertyListingsNumberOfBathrooms: property?.bathrooms ? String(property.bathrooms) : "2",
    propertyImageImage1: images[0] || "/images/default_image.png",
    propertyImageImage2: images[1] || "",
    propertyImageImage3: images[2] || "",
    propertyImageImage4: images[3] || "",
    propertyImageImage5: images[4] || "",
    hostAccoladesPropertyAccoladeVIsiblitOn: false,
    hostAccoladesSuperHostOn: false,
    hostAccoladesPlusHostVIsibility: false,
    hostAccoladesVerifiedHostOn: false,
    hostAccoladesPremiumHostOn: false,
    propertyLinkPropertyLink: {
      href: property?.slug ? `https://www.easystayretreats.homes/properties/${property.slug}` : "#",
    },
  };
};

const SearchPropertiesByDestinationPage = () => {
  const router = useRouter();
  const { wishlist, setWishlist } = useContext(Context);

  const [infos, setInfos] = useState({});
  const [data, setData] = useState({ loading: true, results: [], error: null });
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [filterModal, setFilterModal] = useState(false);

  const destination = useMemo(() => {
    const { destination: dest, q } = router.query;
    if (typeof dest === "string" && dest.trim()) return dest;
    if (typeof q === "string" && q.trim()) return q;
    return "";
  }, [router.query]);

  useEffect(() => {
    setInfos({ ...getParams(), destination });
  }, [destination, router.asPath]);

  useEffect(() => {
    if (typeof data === "string") {
      try {
        setData(JSON.parse(data));
      } catch (error) {
        console.warn("Failed to parse property data", error);
      }
    }
  }, [data]);

  useEffect(() => {
    setPlaces((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) return prev;
      return prev.map((marker) =>
        marker?._id === hoveredPlace
          ? { ...marker, hovered: true }
          : marker?.hovered
          ? { ...marker, hovered: false }
          : marker
      );
    });
  }, [hoveredPlace]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setUserLocation(null);
        }
      );
    }
  }, []);

  useEffect(() => {
    const resolveLocation = async () => {
      if (destination?.trim()) {
        try {
          const url = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${encodeURIComponent(
            destination.trim()
          )}&format=json&limit=1`;
          const { data: geocode } = await axios.get(url);
          if (Array.isArray(geocode) && geocode.length === 1) {
            const [match] = geocode;
            if (match?.lat && match?.lon) {
              setLocation([Number(match.lat), Number(match.lon)]);
              return;
            }
          }
        } catch (error) {
          console.warn("Failed to geocode destination", error);
        }
      }

      if (userLocation) {
        setLocation(userLocation);
      } else {
        setLocation([37.4316, -78.6569]);
      }
    };

    resolveLocation();
  }, [destination, userLocation]);

  const propertyCount = data?.results?.length ?? 0;
  const propertyCountLabel = propertyCount === 1 ? "Property" : "Properties";
  const propertyCountDisplay = data?.loading ? "..." : String(propertyCount);

  const propertyFilterSlot = (
    <div className="flex w-full flex-col gap-3 px-4 pt-4 flex-1">
      <SearchPanel
        initialValues={infos}
        variant="compact"
        className="shadow-sm flex-1"
        buttonLabel="Search"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <div className="text-xs uppercase tracking-[0.35em] text-lightTextColor">
            {data?.loading
              ? "Loading retreats"
              : `${propertyCount} retreat${propertyCount === 1 ? "" : "s"}`}
          </div>
          <button
            type="button"
            onClick={() => setFilterModal(true)}
            className="btn-tertiary-normal !px-3 !py-1 text-[10px] uppercase tracking-[0.3em]"
          >
            Filters
          </button>
        </div>
      </div>
    </div>
  );

  const renderPropertyCards = () => {
    if (data?.error) {
      return (
        <div className="rounded-xl border border-lightBorderColor bg-surfaceMuted/60 p-6 text-center text-sm text-lightTextColor">
          <p>{data.error}</p>
          <p className="mt-2">Adjust the map or verify connectivity, then try again.</p>
        </div>
      );
    }

    if (data?.loading) {
      return (
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ListingsLoading key={index} divider={2} css="w-full h-max" />
          ))}
        </div>
      );
    }

    if (!Array.isArray(data?.results) || data.results.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-lightBorderColor p-6 text-center text-sm text-lightTextColor">
          <h2 className="text-xl font-semibold text-blackColor mb-3">No retreats found</h2>
          <p>Adjust your filters or pan the map to explore more EasyStay experiences.</p>
        </div>
      );
    }

    return (
      <div className="property-card-grid grid gap-4 px-4 pb-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.results.map((property) => {
          const cardProps = toPropertyCardProps(property);
          const isHovered = hoveredPlace === property._id;
          return (
            <div
              key={property._id}
              onMouseEnter={() => setHoveredPlace(property._id)}
              onMouseLeave={() => setHoveredPlace(null)}
              className={`w-full overflow-hidden rounded-2xl border transition-shadow duration-150 bg-white ${
                isHovered ? "border-primaryColor shadow-lg" : "border-transparent shadow-sm"
              }`}
            >
              <PropertyCard {...cardProps} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>
          {destination
            ? `EasyStay Retreats | ${destination} stays`
            : "EasyStay Retreats | Search properties"}
        </title>
        <meta
          name="description"
          content="Explore EasyStay retreats via interactive map. Pan, zoom, and filter to find your next stay."
        />
      </Head>
      <EasyStayNav />
      <div className="flex flex-col xl:flex-row gap-4 w-full h-[calc(100vh-65px)] lg:h-[calc(100vh-80px)] px-4 py-6 bg-surfaceMuted/50">
        <div className="search-properties-directory">
          <PropertyDirectory
            numberOfProperties={propertyCountDisplay}
            propertyCountLabel={propertyCountLabel}
            propertyFilter={false}
            directoryFeature={false}
            directoryFeaturreIconVisbility={false}
            propertyFilterSlot={propertyFilterSlot}
            propertyCardSlot={renderPropertyCards()}
          />
        </div>
        <div className="flex-1 min-h-[400px]">
          {location ? (
            <MapElement
              mapSlot={
                <div className="w-full h-full">
                  <LeafletMap
                    key={location ? location.join(",") : "initial"}
                    setData={setData}
                    location={location}
                    places={places}
                    setPlaces={setPlaces}
                  />
                </div>
              }
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#e1e1e1]">
              <img src={LOADING.src} alt="Loading map" className="w-20 h-20" />
            </div>
          )}
        </div>
      </div>
      {filterModal && <FilterModal setFilterModal={setFilterModal} />}
      {wishlist && <Wishlist setWishlist={setWishlist} />}
      <style jsx global>{`
        .search-properties-directory .map-property-contiainer {
          padding: 0 !important;
        }

        .search-properties-directory .property-notice {
          padding: 0 1rem 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .search-properties-directory .property-notice .subtitle:first-child {
          font-weight: 600;
        }

        .property-card-grid .property-card {
          width: 100% !important;
          max-width: none !important;
        }
      `}</style>
    </>
  );
};

export default SearchPropertiesByDestinationPage;
