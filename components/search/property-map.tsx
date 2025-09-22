"use client";

import { useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";
import type { Property, PropertySearchParams } from "@/lib/types";

const fallbackCenter = { lat: 25.7617, lng: -80.1918 }; // Miami baseline

function MarkerWithLabel({
  property,
  isActive,
  onSelect
}: {
  property: Property;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  const { marker } = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      ref={marker}
      position={{ lat: property.latitude, lng: property.longitude }}
      onClick={() => onSelect(property.id)}
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
  const initialCenter = useMemo(() => {
    if (properties.length === 0) return fallbackCenter;
    const first = properties[0];
    return { lat: first.latitude, lng: first.longitude };
  }, [properties]);

  if (!apiKey) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
        Add your Google Maps API key to <code>.env</code> to load the interactive map.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["marker"]}>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultZoom={properties.length ? 9 : 5}
        defaultCenter={initialCenter}
        gestureHandling="greedy"
        disableDefaultUI={false}
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
            isActive={property.id === selectedPropertyId}
            onSelect={(id) => onSelectProperty(id)}
          />
        ))}
      </Map>
    </APIProvider>
  );
}
