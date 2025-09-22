"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Property, PropertySearchParams, PropertySearchResponse } from "@/lib/types";
import { mockResponse } from "@/lib/mock-properties";

const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

async function fetchProperties(params: PropertySearchParams): Promise<PropertySearchResponse> {
  if (!supabaseConfigured) {
    return mockResponse;
  }

  const url = new URL("/api/properties", window.location.origin);

  if (params.q) url.searchParams.set("q", params.q);
  if (params.guests) url.searchParams.set("guests", String(params.guests));
  if (params.checkIn) url.searchParams.set("checkIn", params.checkIn);
  if (params.checkOut) url.searchParams.set("checkOut", params.checkOut);
  if (params.bounds) {
    const { north, south, east, west } = params.bounds;
    url.searchParams.set("bounds", `${north},${south},${east},${west}`);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store"
  });

  if (!response.ok) {
    console.error("Property search request failed", response.statusText);
    return mockResponse;
  }

  try {
    return await response.json();
  } catch (error) {
    console.error("Failed to parse property search response", error);
    return mockResponse;
  }
}

export function usePropertySearch(params: PropertySearchParams) {
  const queryKey = useMemo(() => ["property-search", params], [params]);

  return useQuery<{ properties: Property[]; total: number }, Error>({
    queryKey,
    queryFn: () => fetchProperties(params),
    staleTime: 30_000,
    keepPreviousData: true
  });
}
