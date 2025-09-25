import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { EasyStayNav, SearchPanel } from "../components";
import Wishlist from "../components/Wishlist";
import FilterModal from "../components/MapFilter/Filters";
import Card from "../components/Posts/body/Card";
import ListingsLoading from "../components/Loading/ListingsLoading";
import { PropertyDirectory } from "../devlink/PropertyDirectory";
import { MapElement } from "../devlink/MapElement";
import { Context } from "./_app";
import { getParams } from "../utils/handlers";
import LOADING from "../public/images/giphy.gif";

const LeafletMap = dynamic(() => import("../components/MapFilter/LeafletMap"), {
  ssr: false,
});

const PropertyListPanel = ({
  data,
  hoveredPlace,
  setHoveredPlace,
  searchDefaults,
  onOpenFilters,
}) => {
  const [panelData, setPanelData] = useState(data);

  useEffect(() => {
    setPanelData(data);
  }, [data]);

  const results = panelData?.results ?? [];
  const loading = panelData?.loading;
  const error = panelData?.error;

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <SearchPanel
        initialValues={searchDefaults}
        variant="compact"
        className="shadow-sm"
        buttonLabel="Search"
      />
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-lightTextColor">
        <span>{`${results.length} retreats`}</span>
        <button
          type="button"
          onClick={onOpenFilters}
          className="btn-tertiary-normal !px-3 !py-1 text-[10px] tracking-[0.3em]"
        >
          Filters
        </button>
      </div>
      <div className="flex-1 overflow-auto pr-1">
        {error ? (
          <div className="rounded-xl border border-lightBorderColor bg-surfaceMuted/60 p-6 text-center text-sm text-lightTextColor">
            <p>{error}</p>
            <p className="mt-2">Adjust the map or verify connectivity, then try again.</p>
          </div>
        ) : loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <ListingsLoading key={index} divider={2} css="w-full h-max" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-lightBorderColor p-6 text-center text-sm text-lightTextColor">
            <h2 className="text-xl font-semibold text-blackColor mb-3">No retreats found</h2>
            <p>Adjust your filters or pan the map to explore more EasyStay experiences.</p>
          </div>
        ) : (
          <ul className="grid gap-4">
            {results.map((property) => (
              <li
                key={property._id}
                onMouseEnter={() => setHoveredPlace(property._id)}
                onMouseLeave={() => setHoveredPlace(null)}
                className={`rounded-2xl border border-transparent transition-colors duration-150 ${
                  hoveredPlace === property._id ? "border-primaryColor" : "border-transparent"
                }`}
              >
                <Card post={property} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const SearchPropertiesPage = () => {
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
        <PropertyDirectory
          numberOfProperties={propertyCount.toString()}
          propertyFilter={false}
          directoryFeature={false}
          directoryFeaturreIconVisbility={false}
          propertyCardSlot={
            <PropertyListPanel
              data={data}
              hoveredPlace={hoveredPlace}
              setHoveredPlace={setHoveredPlace}
              searchDefaults={infos}
              onOpenFilters={() => setFilterModal(true)}
            />
          }
        />
        <div className="flex-1 min-h-[400px]">
          {location ? (
            <MapElement
              mapSlot={
                <div className="w-full h-full">
                  <LeafletMap
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
    </>
  );
};

export default SearchPropertiesPage;
