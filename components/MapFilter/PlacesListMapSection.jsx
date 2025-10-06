import React, { useEffect, useState } from "react";
import Card from "../Posts/body/Card";
import { v4 as uuidv4 } from "uuid";
import ListingsLoading from "../Loading/ListingsLoading";
import { SearchPanel } from "../";

const PlacesListMapSection = ({ data, hoveredPlace, setHoveredPlace, searchDefaults }) => {
  const [places, setPlaces] = useState({ loading: true, results: [], error: null });

  useEffect(() => {
    setPlaces(data);
  }, [data]);

  return (
    <div className="max-w-full xl:max-w-[720px] w-full py-6 px-4 bg-white/95 backdrop-blur border-r border-lightBorderColor flex flex-col xl:h-full xl:min-h-0">
      <SearchPanel
        initialValues={searchDefaults}
        variant="compact"
        className="mb-6"
        buttonLabel="Search"
      />

      <header className="mb-4 flex items-center justify-between">
        <span className="font-semibold text-blackColor">
          {places?.results?.length} retreats
        </span>
        <span className="text-sm text-lightTextColor">Explore handpicked stays</span>
      </header>

      <section className="py-4 xl:flex-1 xl:min-h-0">
        {places.error ? (
          <div className="rounded-3xl border border-lightBorderColor bg-surfaceMuted/60 p-6 text-center text-sm text-lightTextColor">
            <p>{places.error}</p>
            <p className="mt-2">
              Adjust the map or verify Supabase connectivity, then try again.
            </p>
          </div>
        ) : places.loading ? (
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
              Adjust the map or refine your search to discover more EasyStay experiences.
            </p>
          </div>
        ) : (
          <div className="w-full xl:h-full xl:min-h-0">
            <ul className="overflow-auto hidden-scroll-bar flex flex-wrap gap-6 max-h-full pb-28 pr-1 xl:h-full xl:min-h-0">
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
