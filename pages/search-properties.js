import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { EasyStayNav } from "../components";
import PlacesListMapSection from "../components/MapFilter/PlacesListMapSection";
import { getParams } from "../utils/handlers";
import FilterModal from "../components/MapFilter/Filters";
import Wishlist from "../components/Wishlist";
import LOADING from "../public/images/giphy.gif";
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

  const [infos, setInfos] = useState({});
  const [data, setData] = useState({
    loading: true,
    results: [],
    error: null,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [filterModal, setFilterModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [places, setPlaces] = useState([]);

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
    setInfos({ ...getParams(), destination });

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

    (async () => {
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
    })();
  }, [destination]);

  return (
    <>
      <Head>
        <title>
          EasyStay Retreats | {destination ? `${destination} getaways` : "Curated stays"}
        </title>
      </Head>
      <EasyStayNav />
      <div className="flex flex-col-reverse xl:flex-row w-full h-[calc(100vh-65px)] lg:h-[calc(100vh-80px)] relative z-10">
        <PlacesListMapSection
          data={data}
          setFilterModal={setFilterModal}
          hoveredPlace={hoveredPlace}
          setHoveredPlace={setHoveredPlace}
          searchDefaults={infos}
        />
        {location ? (
          <Map
            setData={setData}
            location={location}
            places={places}
            setPlaces={setPlaces}
          />
        ) : (
          <div className="w-full h-full bg-[#e1e1e1] flex items-center justify-center">
            <img src={LOADING.src} className="w-24 h-24" alt="" />
          </div>
        )}
      </div>
      {filterModal && <FilterModal setFilterModal={setFilterModal} />}
      {wishlist && <Wishlist setWishlist={setWishlist} />}
    </>
  );
};

export default SearchMapPage;
