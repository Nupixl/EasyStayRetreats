import { NextRequest, NextResponse } from "next/server";
import { parseISO, isValid } from "date-fns";
import { supabaseServerClient } from "@/lib/supabase";
import type { Property, PropertySearchResponse } from "@/lib/types";

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBounds(raw: string | null) {
  if (!raw) return undefined;
  const parts = raw.split(",").map((value) => Number(value.trim()));
  if (parts.length !== 4 || parts.some((value) => !Number.isFinite(value))) return undefined;

  const [north, south, east, west] = parts;
  return { north, south, east, west } as const;
}

function hasDateOverlap(
  requestedStart: Date,
  requestedEnd: Date,
  reservations: { start_date: string; end_date: string }[]
) {
  return reservations.some((reservation) => {
    const reservationStart = parseISO(reservation.start_date);
    const reservationEnd = parseISO(reservation.end_date);

    if (!isValid(reservationStart) || !isValid(reservationEnd)) return false;

    const overlaps = reservationStart < requestedEnd && reservationEnd > requestedStart;
    return overlaps;
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const guests = parseNumber(searchParams.get("guests"));
    const checkInValue = searchParams.get("checkIn") ?? undefined;
    const checkOutValue = searchParams.get("checkOut") ?? undefined;
    const bounds = parseBounds(searchParams.get("bounds"));

    const supabase = supabaseServerClient();

    let query = supabase
      .from("properties")
      .select(
        `id, slug, name, short_description, nightly_price, rating, review_count, guest_capacity, bedrooms, beds, bathrooms, is_super_host, hero_image_url, city, state, country, latitude, longitude, address_line1, address_line2, reservations(start_date,end_date)`,
        { count: "exact" }
      )
      .eq("is_published", true)
      .order("nightly_price", { ascending: true })
      .limit(200);

    if (guests) {
      query = query.gte("guest_capacity", guests);
    }

    if (bounds) {
      query = query
        .gte("latitude", bounds.south)
        .lte("latitude", bounds.north)
        .gte("longitude", bounds.west)
        .lte("longitude", bounds.east);
    }

    if (q) {
      const sanitized = q.replace(/[%_]/g, "").trim();
      if (sanitized.length > 0) {
        const ilikeValue = `%${sanitized}%`;
        query = query.or(
          `name.ilike.${ilikeValue},city.ilike.${ilikeValue},state.ilike.${ilikeValue},country.ilike.${ilikeValue}`
        );
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase search error", error);
      return NextResponse.json({ error: "Unable to load properties" }, { status: 500 });
    }

    const requestedStart = checkInValue ? parseISO(checkInValue) : undefined;
    const requestedEnd = checkOutValue ? parseISO(checkOutValue) : undefined;
    const shouldFilterByDates =
      requestedStart && requestedEnd && isValid(requestedStart) && isValid(requestedEnd) && requestedStart < requestedEnd;

    const items = (data ?? [])
      .map((property) => ({
        property,
        dto: {
          id: property.id,
          slug: property.slug,
          name: property.name,
          shortDescription: property.short_description,
          nightlyPrice: property.nightly_price,
          rating: property.rating,
          reviewCount: property.review_count,
          guestCapacity: property.guest_capacity,
          bedrooms: property.bedrooms,
          beds: property.beds,
          bathrooms: property.bathrooms,
          isSuperHost: property.is_super_host,
          heroImageUrl: property.hero_image_url,
          city: property.city,
          state: property.state,
          country: property.country,
          latitude: property.latitude,
          longitude: property.longitude,
          addressLine1: property.address_line1,
          addressLine2: property.address_line2
        } satisfies Property
      }))
      .filter(({ property }) => {
        if (!shouldFilterByDates) return true;
        const reservations = property.reservations ?? [];
        return !hasDateOverlap(requestedStart!, requestedEnd!, reservations);
      })
      .map(({ dto }) => dto);

    const response: PropertySearchResponse = {
      properties: items,
      total: items.length
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Search API unexpected error", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
