import React, { useEffect, useState } from "react";
import Card from "../Posts/body/Card";
import { v4 as uuidv4 } from "uuid";
import ListingsLoading from "../Loading/ListingsLoading";

const PlacesListMapSection = ({
  data,
  setFilterModal,
  hoveredPlace,
  setHoveredPlace,
}) => {
  const [places, setPlaces] = useState({ loading: true, results: [] });

  useEffect(() => {
    setPlaces(data);
  }, [data]);

  return (
    <div className="max-w-full xl:max-w-[720px] w-full h-full py-6 px-4 overflow-hidden bg-white/90 backdrop-blur border-r border-lightBorderColor">
      <header className="flex items-center justify-between">
        <span className="font-semibold text-blackColor">
          {places?.results?.length} retreats
        </span>
        <button
          onClick={() => {
            setFilterModal(true);
          }}
          className="btn-tertiary-normal"
        >
          Filter
        </button>
      </header>

      <section className="py-4 h-full">
        {places.loading ? (
          <div className="flex flex-wrap gap-6 w-full">
            <ListingsLoading
              divider={2}
              css="w-full sm:w-[calc(100%/2-16px)] md:w-[calc(100%/3-16px)] xl:w-[calc(100%/2-1.2rem)] h-max"
            />
            <ListingsLoading
              divider={2}
              css="w-full sm:w-[calc(100%/2-16px)] md:w-[calc(100%/3-16px)] xl:w-[calc(100%/2-1.2rem)] h-max"
            />
            <ListingsLoading
              divider={2}
              css="w-full sm:w-[calc(100%/2-16px)] md:w-[calc(100%/3-16px)] xl:w-[calc(100%/2-1.2rem)] h-max"
            />
            <ListingsLoading
              divider={2}
              css="w-full sm:w-[calc(100%/2-16px)] md:w-[calc(100%/3-16px)] xl:w-[calc(100%/2-1.2rem)] h-max"
            />
            <ListingsLoading
              divider={2}
              css="w-full sm:w-[calc(100%/2-16px)] md:w-[calc(100%/3-16px)] xl:w-[calc(100%/2-1.2rem)] h-max"
            />
            <ListingsLoading
              divider={2}
              css="w-full sm:w-[calc(100%/2-16px)] md:w-[calc(100%/3-16px)] xl:w-[calc(100%/2-1.2rem)] h-max"
            />
          </div>
        ) : places?.results?.length === 0 ? (
          <div>
            <h1 className="text-2xl font-semibold text-blackColor mb-4">
              No retreats found
            </h1>
            <p className="text-md mb-4 text-lightTextColor">
              Adjust your filters to discover more EasyStay experiences.
            </p>
          </div>
        ) : (
          <div className="w-full h-full">
            <ul className="overflow-auto hidden-scroll-bar flex flex-wrap gap-6 h-fit max-h-full">
              {places?.results?.map((post) => (
                <li
                  className="w-full sm:w-[calc(100%/2-16px)] md:w-[calc(100%/3-16px)] xl:w-[calc(100%/2-1.2rem)] h-max"
                  key={uuidv4()}
                  onMouseEnter={() => setHoveredPlace(post._id)}
                  onMouseLeave={() => setHoveredPlace(null)}
                >
                  <Card post={post} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default PlacesListMapSection;
