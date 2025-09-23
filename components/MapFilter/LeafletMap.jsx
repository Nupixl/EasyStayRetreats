import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { v4 as uuidv4 } from "uuid";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import axios from "axios";
import { escapeHtml } from "../../utils/sanitize";

const LeafletMap = ({ setData, location, places, setPlaces }) => {
  const DEFAULT_CENTER = location || [37.4316, -78.6569];
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.setView(location);
    }
  }, [location]);

  const getData = async (m) => {
    setData({ loading: true, results: [], error: null });
    try {
      const { data } = await axios.get("/api/properties/search", {
        params: {
          data: m,
        },
      });

      if (data.success) {
        setData({ loading: false, results: data.data, error: null });
        setPlaces(
          data.data.map((e) => ({
            ...e.geolocation,
            price: e.price,
            _id: e._id,
            hovered: false,
          }))
        );
      } else {
        const message = data.error || "Unable to load retreats at the moment.";
        console.error("Map search failed:", message);
        setData({
          loading: false,
          results: [],
          error: message,
        });
        setPlaces([]);
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Unexpected error loading retreats.";
      console.error("Map search failed:", message);
      setData({
        loading: false,
        results: [],
        error: message,
      });
      setPlaces([]);
    }
  };

  const getBounds = (map) => {
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
  };

  const GetLngAndLat = () => {
    if (mapRef.current) {
      getBounds(mapRef.current);
    }
  };

  useEffect(() => {
    mapRef.current?.on("moveend", () => GetLngAndLat());
  }, [mapRef.current]);

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
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        noWrap={true}
      />

      {/* {mk.map((place) => (
        <Marker
          key={uuidv4()}
          position={[place?.lat, place?.lng]}
          draggable={false}
          animate={true}
          // icon={L.divIcon({
          //   html: `<span class="bg-white px-4 py-2 rounded-full text-md font-bold shadow">${place?.price}</span>`,
          // })}
        />
      ))} */}
      {places.map((place) => {
        return (
          <Marker
            key={uuidv4()}
            position={[place?.lat, place?.lng]}
            icon={L.divIcon({
              html: `<span class="easystay-price-marker ${
                place?.hovered ? "is-active" : ""
              }">${escapeHtml(place?.price)}</span>`,
            })}
          />
        );
      })}
    </MapContainer>
  );
};

export default LeafletMap;
