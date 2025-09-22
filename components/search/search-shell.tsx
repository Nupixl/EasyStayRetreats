"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format, addDays, parseISO } from "date-fns";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePropertySearch } from "@/lib/hooks/use-property-search";
import { useDebounce } from "@/lib/hooks/use-debounce";
import type { PropertySearchParams } from "@/lib/types";
import { PropertyCard } from "./property-card";
import { PropertyMap } from "./property-map";

const minCheckOutOffset = 2;

const baseDestinationSuggestions = [
  "Austin, TX",
  "Virginia Beach, VA",
  "Asheville, NC",
  "Boston, MA",
  "Miami, FL"
];

type SearchFormState = {
  where: string;
  guests: number;
  checkIn: Date | null;
  checkOut: Date | null;
};

function formatDateForInput(date: Date | null) {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

function getInitialCheckIn() {
  const today = new Date();
  return addDays(today, 7);
}

export function SearchShell() {
  const initialCheckIn = getInitialCheckIn();
  const initialState: SearchFormState = {
    where: "",
    guests: 2,
    checkIn: initialCheckIn,
    checkOut: addDays(initialCheckIn, minCheckOutOffset)
  };

  const [formState, setFormState] = useState<SearchFormState>(initialState);
  const [appliedFilters, setAppliedFilters] = useState<SearchFormState>(initialState);
  const [bounds, setBounds] = useState<PropertySearchParams["bounds"]>();
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showWhereSuggestions, setShowWhereSuggestions] = useState(false);

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

  const propertyRefs = useRef(new Map<string, HTMLElement | null>());
  const hideSuggestionsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const nextState: SearchFormState = { ...prev, checkIn: next };
      if (!prev.checkOut || next >= prev.checkOut) {
        nextState.checkOut = addDays(next, minCheckOutOffset);
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
    <section className="flex h-[calc(100vh-48px)] w-full flex-col gap-6">
      <form
        className="rounded-card border border-slate-200 bg-white p-4 shadow-sm"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="relative flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Where</span>
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
                className="h-12 rounded-full border border-slate-200 bg-slate-50 px-5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
              />
              {showWhereSuggestions && filteredDestinationSuggestions.length > 0 ? (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
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
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Check-in</span>
              <input
                type="date"
                value={formatDateForInput(formState.checkIn)}
                onChange={(event) => handleCheckInChange(event.target.value)}
                className="h-12 rounded-full border border-slate-200 bg-slate-50 px-5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Check-out</span>
              <input
                type="date"
                value={formatDateForInput(formState.checkOut)}
                min={formState.checkIn ? formatDateForInput(addDays(formState.checkIn, 1)) : undefined}
                onChange={(event) => handleCheckOutChange(event.target.value)}
                className="h-12 rounded-full border border-slate-200 bg-slate-50 px-5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Guests</span>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={16}
                  value={formState.guests}
                  readOnly
                  className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-14 text-center text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                />
                <div className="absolute inset-y-0 left-2 flex items-center">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="Decrease guests"
                    onClick={() => handleGuestStep(-1)}
                  >
                    −
                  </button>
                </div>
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="Increase guests"
                    onClick={() => handleGuestStep(1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </label>
          </div>
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700 lg:w-auto"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Search
          </button>
        </div>
      </form>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex h-full flex-col overflow-hidden rounded-card border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {isLoading ? "Loading" : `${data?.total ?? 0} properties`}
              </p>
              <p className="text-sm text-slate-500">Prices include all fees</p>
            </div>
            {isFetching && !isLoading ? (
              <span className="text-xs font-medium text-slate-400">Updating…</span>
            ) : null}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                We hit a snag loading properties. Try again in a moment.
              </div>
            ) : null}
            {!error && properties.length === 0 && !isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                No listings match your filters yet. Adjust your dates, location, or guest count to discover more stays.
              </div>
            ) : null}
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isActive={selectedProperty === property.id}
                onHover={() => setSelectedProperty(property.id)}
                onFocus={() => setSelectedProperty(property.id)}
                onSelect={() => setSelectedProperty(property.id)}
                ref={(node) => registerPropertyRef(property.id, node)}
              />
            ))}
          </div>
        </div>

        <div className="h-[480px] overflow-hidden rounded-card border border-slate-200 bg-white shadow-sm lg:h-full">
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
    </section>
  );
}
