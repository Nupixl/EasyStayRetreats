"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addDays, format, isValid, parseISO } from "date-fns";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PropertyMap } from "@/components/search/property-map";
import { PropertyCard } from "@/components/search/property-card";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { usePropertySearch } from "@/lib/hooks/use-property-search";
import type { Property, PropertySearchParams } from "@/lib/types";

import "@/styles/webflow-search.css";

const baseDestinationSuggestions = [
  "Austin, TX",
  "Virginia Beach, VA",
  "Asheville, NC",
  "Boston, MA",
  "Miami, FL"
];

const minCheckOutOffset = 2;

type SearchFormState = {
  where: string;
  guests: number;
  checkIn: Date | null;
  checkOut: Date | null;
};

type PropertyDirectoryProps = {
  initialFilters?: {
    where?: string;
    guests?: number;
    checkIn?: string | Date | null;
    checkOut?: string | Date | null;
  };
  initialProperties?: Property[];
};

function normalizeDate(input?: string | Date | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) {
    return isValid(input) ? input : null;
  }
  const parsed = parseISO(input);
  return isValid(parsed) ? parsed : null;
}

function formatDateForInput(date: Date | null) {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

function computeInitialState(initialFilters?: PropertyDirectoryProps["initialFilters"]): SearchFormState {
  const today = new Date();
  const defaultCheckIn = addDays(today, 7);

  const initialCheckIn = normalizeDate(initialFilters?.checkIn) ?? defaultCheckIn;
  const initialCheckOutCandidate = normalizeDate(initialFilters?.checkOut);
  const initialCheckOut =
    initialCheckOutCandidate && initialCheckOutCandidate > initialCheckIn
      ? initialCheckOutCandidate
      : addDays(initialCheckIn, minCheckOutOffset);

  return {
    where: initialFilters?.where?.trim() ?? "",
    guests: initialFilters?.guests && initialFilters.guests > 0 ? initialFilters.guests : 2,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut
  };
}

export function PropertyDirectory({ initialFilters }: PropertyDirectoryProps) {
  const [formState, setFormState] = useState<SearchFormState>(() => computeInitialState(initialFilters));
  const [appliedFilters, setAppliedFilters] = useState<SearchFormState>(() => computeInitialState(initialFilters));
  const [bounds, setBounds] = useState<PropertySearchParams["bounds"]>();
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showWhereSuggestions, setShowWhereSuggestions] = useState(false);

  const propertyRefs = useRef(new Map<string, HTMLElement | null>());
  const hideSuggestionsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedBounds = useDebounce(bounds, 400);

  const searchParams = useMemo<PropertySearchParams>(() => {
    return {
      q: appliedFilters.where.trim().length ? appliedFilters.where.trim() : undefined,
      guests: appliedFilters.guests,
      checkIn: appliedFilters.checkIn ? format(appliedFilters.checkIn, "yyyy-MM-dd") : undefined,
      checkOut: appliedFilters.checkOut ? format(appliedFilters.checkOut, "yyyy-MM-dd") : undefined,
      bounds: debouncedBounds ?? undefined
    };
  }, [appliedFilters, debouncedBounds]);

  const { data, isFetching, isLoading, error } = usePropertySearch(searchParams);
  const properties = useMemo(() => data?.properties ?? [], [data?.properties]);

  const destinationSuggestions = useMemo(() => {
    const suggestions = new Map<string, string>();

    properties.forEach((property) => {
      const parts = [property.city, property.state, property.country].filter(Boolean);
      if (parts.length === 0) return;
      const label = parts.join(", ");
      const key = label.toLowerCase();
      if (!suggestions.has(key)) {
        suggestions.set(key, label);
      }
    });

    baseDestinationSuggestions.forEach((label) => {
      const normalized = label.trim();
      if (!normalized) return;
      const key = normalized.toLowerCase();
      if (!suggestions.has(key)) {
        suggestions.set(key, normalized);
      }
    });

    return Array.from(suggestions.values()).slice(0, 8);
  }, [properties]);

  const filteredDestinationSuggestions = useMemo(() => {
    const query = formState.where.trim().toLowerCase();
    if (!query) return destinationSuggestions;
    return destinationSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(query));
  }, [destinationSuggestions, formState.where]);

  const closeSuggestions = useCallback(() => {
    if (hideSuggestionsTimeout.current) {
      clearTimeout(hideSuggestionsTimeout.current);
      hideSuggestionsTimeout.current = null;
    }
    setShowWhereSuggestions(false);
  }, []);

  const registerPropertyRef = useCallback((propertyId: string, node: HTMLElement | null) => {
    if (node) {
      propertyRefs.current.set(propertyId, node);
    } else {
      propertyRefs.current.delete(propertyId);
    }
  }, []);

  useEffect(() => {
    return () => {
      closeSuggestions();
    };
  }, [closeSuggestions]);

  useEffect(() => {
    if (!selectedProperty) return;
    const exists = properties.some((property) => property.id === selectedProperty);
    if (!exists) {
      setSelectedProperty(null);
    }
  }, [properties, selectedProperty]);

  useEffect(() => {
    if (!selectedProperty) return;
    const node = propertyRefs.current.get(selectedProperty);
    if (!node) return;
    node.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [properties, selectedProperty]);

  const handleCheckInChange = (value: string) => {
    if (!value) {
      setFormState((prev) => ({ ...prev, checkIn: null }));
      return;
    }

    const next = parseISO(value);
    setFormState((prev) => {
      const nextState: SearchFormState = { ...prev, checkIn: isValid(next) ? next : prev.checkIn };
      if (!prev.checkOut || (isValid(next) && next >= prev.checkOut)) {
        nextState.checkOut = addDays(isValid(next) ? next : prev.checkIn ?? new Date(), minCheckOutOffset);
      }
      return nextState;
    });
  };

  const handleCheckOutChange = (value: string) => {
    if (!value) {
      setFormState((prev) => ({ ...prev, checkOut: null }));
      return;
    }

    const next = parseISO(value);
    setFormState((prev) => {
      if (!isValid(next)) return prev;
      const nextState: SearchFormState = { ...prev, checkOut: next };
      if (prev.checkIn && next <= prev.checkIn) {
        nextState.checkIn = addDays(next, -minCheckOutOffset);
      }
      return nextState;
    });
  };

  const handleGuestStep = (delta: number) => {
    setFormState((prev) => {
      const nextValue = Math.max(1, Math.min(16, prev.guests + delta));
      return { ...prev, guests: nextValue };
    });
  };

  const handleSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      closeSuggestions();
      setAppliedFilters({ ...formState });
    },
    [closeSuggestions, formState]
  );

  const handleSuggestionSelect = (value: string) => {
    setFormState((prev) => ({ ...prev, where: value }));
    closeSuggestions();
  };

  const handleMapSelection = (id: string | null) => {
    setSelectedProperty(id);
  };

  return (
    <div className="page-wrapper flex">
      <section className="section_search_map flex w-full justify-center px-4 pb-6 pt-4 sm:px-6 lg:px-10">
        <div className="map-canvas grid w-full max-w-[var(--layout-max-width)] grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="map-property-wrapper flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-card">
            <div className="map-property-contiainer space-y-4 border-b border-slate-100 px-4 pb-4 pt-6 sm:px-6">
              <form className="property-filter relative flex flex-col gap-4 lg:flex-row" onSubmit={(event) => handleSubmit(event)}>
                <div className="search-menu-dropdown flex flex-1 flex-col gap-2 rounded-3xl border border-transparent bg-slate-50 px-4 py-3 transition focus-within:border-slate-300 focus-within:bg-white">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Where</label>
                  <div className="relative">
                    <input
                      value={formState.where}
                      onChange={(event) => setFormState((prev) => ({ ...prev, where: event.target.value }))}
                      onFocus={() => {
                        if (hideSuggestionsTimeout.current) {
                          clearTimeout(hideSuggestionsTimeout.current);
                          hideSuggestionsTimeout.current = null;
                        }
                        setShowWhereSuggestions(true);
                      }}
                      onBlur={() => {
                        hideSuggestionsTimeout.current = setTimeout(() => {
                          closeSuggestions();
                        }, 120);
                      }}
                      placeholder="Anywhere"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-transparent px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
                    />
                    {showWhereSuggestions && filteredDestinationSuggestions.length > 0 ? (
                      <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Suggested destinations
                        </p>
                        <ul className="max-h-60 space-y-1 overflow-auto">
                          {filteredDestinationSuggestions.map((suggestion) => (
                            <li key={suggestion}>
                              <button
                                type="button"
                                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleSuggestionSelect(suggestion)}
                              >
                                <span>{suggestion}</span>
                                <span className="text-xs text-slate-400">Tap to fill</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="search-menu-dropdown flex flex-1 flex-col gap-2 rounded-3xl border border-transparent bg-slate-50 px-4 py-3 transition focus-within:border-slate-300 focus-within:bg-white">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">When</label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Check-in</span>
                      <input
                        type="date"
                        value={formatDateForInput(formState.checkIn)}
                        onChange={(event) => handleCheckInChange(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Check-out</span>
                      <input
                        type="date"
                        value={formatDateForInput(formState.checkOut)}
                        min={formState.checkIn ? formatDateForInput(addDays(formState.checkIn, 1)) : undefined}
                        onChange={(event) => handleCheckOutChange(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="search-menu-dropdown flex flex-1 flex-col gap-2 rounded-3xl border border-transparent bg-slate-50 px-4 py-3 transition focus-within:border-slate-300 focus-within:bg-white">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Who</label>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                      aria-label="Decrease guests"
                      onClick={() => handleGuestStep(-1)}
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-slate-900">{formState.guests} guests</span>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                      aria-label="Increase guests"
                      onClick={() => handleGuestStep(1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="seach-menu-button flex items-center justify-center">
                  <button
                    type="submit"
                    className="inline-flex h-12 min-w-[160px] items-center justify-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    Search
                  </button>
                </div>
              </form>

              <div className="map-property-top-container flex items-center justify-between rounded-3xl bg-slate-50 px-5 py-3">
                <div className="property-notice flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="text-lg font-semibold text-slate-900">
                    {isLoading ? "Loading" : `${data?.total ?? properties.length} properties`}
                  </span>
                  <span className="hidden text-xs text-slate-400 sm:inline">Prices include all fees</span>
                </div>
                {isFetching && !isLoading ? (
                  <span className="text-xs font-medium text-slate-400">Updating…</span>
                ) : null}
              </div>
            </div>

            <div className="map-property-bottom-contianer flex-1 overflow-hidden">
              <div className="property-listing-wrapper flex h-full flex-col overflow-y-auto px-4 pb-6 pt-4 sm:px-6">
                {error ? (
                  <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                    We hit a snag loading properties. Try again in a moment.
                  </div>
                ) : null}
                {!error && properties.length === 0 && !isLoading ? (
                  <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                    No listings match your filters yet. Adjust your dates, location, or guest count to discover more stays.
                  </div>
                ) : null}

                <div className="flex flex-col gap-6">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isActive={selectedProperty === property.id}
                      onHover={() => {
                        setSelectedProperty(property.id);
                      }}
                      onFocus={() => setSelectedProperty(property.id)}
                      onSelect={() => setSelectedProperty(property.id)}
                      ref={(node) => registerPropertyRef(property.id, node)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="map-element overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-card">
            <div className="map-container-full h-full">
              <PropertyMap
                properties={properties}
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}
                onBoundsChange={(nextBounds) => {
                  if (!nextBounds) return;
                  setBounds((prev) => {
                    if (
                      prev &&
                      Math.abs(prev.north - nextBounds.north) < 0.0001 &&
                      Math.abs(prev.south - nextBounds.south) < 0.0001 &&
                      Math.abs(prev.east - nextBounds.east) < 0.0001 &&
                      Math.abs(prev.west - nextBounds.west) < 0.0001
                    ) {
                      return prev;
                    }
                    return nextBounds;
                  });
                }}
                selectedPropertyId={selectedProperty}
                onSelectProperty={handleMapSelection}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PropertyDirectory;
