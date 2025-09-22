"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";
import type { Property, PropertySearchParams } from "@/lib/types";

const fallbackCenter = { lat: 25.7617, lng: -80.1918 }; // Miami baseline
const fallbackImage = "/images/property-fallback.jpg";

function MarkerWithLabel({
  property,
  isActive,
  onSelect,
  onHover
}: {
  property: Property;
  isActive: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const { marker } = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      ref={marker}
      position={{ lat: property.latitude, lng: property.longitude }}
      onClick={() => onSelect(property.id)}
      onMouseEnter={() => onHover(property.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Pin
        background={isActive ? "#0f172a" : "#ffffff"}
        borderColor="#0f172a"
        glyphColor={isActive ? "#ffffff" : "#0f172a"}
        glyph={`$${Math.round(property.nightlyPrice)}`}
        scale={isActive ? 1.2 : 1}
      />
    </AdvancedMarker>
  );
}

type PropertyMapProps = {
  properties: Property[];
  apiKey: string;
  onBoundsChange?: (bounds: PropertySearchParams["bounds"]) => void;
  selectedPropertyId: string | null;
  onSelectProperty: (id: string | null) => void;
};

export function PropertyMap({
  properties,
  apiKey,
  onBoundsChange,
  selectedPropertyId,
  onSelectProperty
}: PropertyMapProps) {
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  const initialCenter = useMemo(() => {
    if (properties.length === 0) return fallbackCenter;
    const first = properties[0];
    return { lat: first.latitude, lng: first.longitude };
  }, [properties]);

  const highlightPropertyId = hoveredPropertyId ?? selectedPropertyId;

  const activeProperty = useMemo(() => {
    if (!highlightPropertyId) return null;
    return properties.find((property) => property.id === highlightPropertyId) ?? null;
  }, [highlightPropertyId, properties]);

  useEffect(() => {
    if (!highlightPropertyId) return;
    const exists = properties.some((property) => property.id === highlightPropertyId);
    if (!exists) {
      setHoveredPropertyId(null);
    }
  }, [highlightPropertyId, properties]);

  if (!apiKey) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
        Add your Google Maps API key to <code>.env</code> to load the interactive map.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["marker"]}>
      <div className="relative h-full w-full">
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultZoom={properties.length ? 9 : 5}
          defaultCenter={initialCenter}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={() => {
            setHoveredPropertyId(null);
            onSelectProperty(null);
          }}
          onBoundsChanged={(event) => {
            if (!onBoundsChange) return;
            const mapBounds = event.detail.bounds;
            if (!mapBounds) return;

            const ne = mapBounds.getNorthEast();
            const sw = mapBounds.getSouthWest();
            if (!ne || !sw) return;

            onBoundsChange({
              north: ne.lat(),
              south: sw.lat(),
              east: ne.lng(),
              west: sw.lng()
            });
          }}
        >
          {properties.map((property) => (
            <MarkerWithLabel
              key={property.id}
              property={property}
              isActive={property.id === highlightPropertyId}
              onSelect={(id) => onSelectProperty(id)}
              onHover={(id) => setHoveredPropertyId(id)}
            />
          ))}
        </Map>

        {activeProperty ? (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex justify-center">
            <div className="pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="relative h-36 w-36 flex-none">
                <Image
                  src={activeProperty.heroImageUrl || fallbackImage}
                  alt={activeProperty.name}
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{activeProperty.name}</p>
                    <p className="text-xs text-slate-500">
                      {[activeProperty.city, activeProperty.state, activeProperty.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  {activeProperty.rating ? (
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                      <span aria-hidden>★</span>
                      <span>{activeProperty.rating.toFixed(1)}</span>
                      {activeProperty.reviewCount ? (
                        <span className="text-[10px] font-medium text-slate-400">({activeProperty.reviewCount})</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <p
                  className="text-xs text-slate-600"
                  style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                  {activeProperty.shortDescription}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    ${Math.round(activeProperty.nightlyPrice)}
                    <span className="ml-1 text-xs font-medium text-slate-500">/ night</span>
                  </span>
                  <Link
                    href={`https://easystayretreats.homes/properties/${activeProperty.slug}`}
                    className="text-xs font-semibold text-slate-900 underline-offset-4 transition hover:underline"
                  >
                    View stay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </APIProvider>
  );
}
