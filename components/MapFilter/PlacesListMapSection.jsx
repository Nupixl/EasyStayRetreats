import React, { useEffect, useState } from "react";
import Card from "../Posts/body/Card";
import ListingsLoading from "../Loading/ListingsLoading";
import { SearchPanel } from "../";

const PlacesListMapSection = ({
  data,
  hoveredPlace,
  setHoveredPlace,
  searchDefaults,
  onApplyFilters,
}) => {
  const [places, setPlaces] = useState({ loading: true, results: [], error: null });

  useEffect(() => {
    setPlaces(data);
  }, [data]);

  const results = Array.isArray(places?.results) ? places.results : [];
  const hasResults = results.length > 0;
  const showSkeleton = places.loading && !hasResults;
  const availableResults = results.filter((property) => property?.isAvailable !== false);
  const unavailableResults = results.filter((property) => property?.isAvailable === false);

  return (
    <div className="max-w-full xl:max-w-[720px] w-full py-6 px-4 bg-white/95 backdrop-blur border-r border-lightBorderColor flex flex-col xl:h-full xl:min-h-0">
      <SearchPanel
        initialValues={searchDefaults}
        variant="compact"
        className="mb-6"
        buttonLabel="Apply filters"
        onSearch={onApplyFilters}
        fields={["checkin", "checkout", "guests"]}
      />

      <header className="mb-4 flex items-center justify-between">
        <span className="font-semibold text-blackColor">
          {places?.results?.length} retreats
        </span>
        <span className="text-sm text-lightTextColor">
          Property pins are approximate for guest safety
        </span>
      </header>

      <section className="py-4 xl:flex-1 xl:min-h-0">
        {places.error ? (
          <div className="rounded-3xl border border-lightBorderColor bg-surfaceMuted/60 p-6 text-center text-sm text-lightTextColor">
            <p>{places.error}</p>
            <p className="mt-2">
              Adjust the map or verify Supabase connectivity, then try again.
            </p>
          </div>
        ) : showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <ListingsLoading divider={2} css="w-full h-max" />
            <ListingsLoading divider={2} css="w-full h-max" />
            <ListingsLoading divider={2} css="w-full h-max" />
            <ListingsLoading divider={2} css="w-full h-max" />
            <ListingsLoading divider={2} css="w-full h-max" />
            <ListingsLoading divider={2} css="w-full h-max" />
          </div>
        ) : !hasResults ? (
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
            <ul className="overflow-auto hidden-scroll-bar grid grid-cols-1 sm:grid-cols-2 gap-6 items-start content-start max-h-full pb-28 pr-1 xl:h-full xl:min-h-0">
              {availableResults.length > 0 && (
                <li className="col-span-full" key="available-heading">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Available retreats ({availableResults.length})
                  </h3>
                </li>
              )}
              {availableResults.map((post, index) => {
                const propertyKey =
                  post?._id ||
                  post?.id ||
                  post?.slug ||
                  post?.whalesync_postgres_id ||
                  `property-${index}`;
                const propertyId =
                  post?._id ||
                  post?.id ||
                  post?.slug ||
                  post?.whalesync_postgres_id ||
                  `property-${index}`;

                return (
                  <li
                    className="w-full h-max"
                    key={propertyKey}
                    onMouseEnter={() => setHoveredPlace(propertyId)}
                    onMouseLeave={() => setHoveredPlace(null)}
                  >
                    <Card post={post} />
                  </li>
                );
              })}

              {unavailableResults.length > 0 && (
                <li className="col-span-full mt-4" key="unavailable-heading">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
                    Currently unavailable (still viewable) ({unavailableResults.length})
                  </h3>
                </li>
              )}
              {unavailableResults.map((post, index) => {
                const propertyKey =
                  post?._id ||
                  post?.id ||
                  post?.slug ||
                  post?.whalesync_postgres_id ||
                  `property-${index}`;
                const propertyId =
                  post?._id ||
                  post?.id ||
                  post?.slug ||
                  post?.whalesync_postgres_id ||
                  `property-${index}`;

                return (
                  <li
                    className="w-full h-max"
                    key={propertyKey}
                    onMouseEnter={() => setHoveredPlace(propertyId)}
                    onMouseLeave={() => setHoveredPlace(null)}
                  >
                    <Card post={post} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default PlacesListMapSection;
