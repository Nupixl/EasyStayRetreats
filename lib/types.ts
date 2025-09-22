export type Property = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  nightlyPrice: number;
  rating: number | null;
  reviewCount: number | null;
  guestCapacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  isSuperHost: boolean;
  heroImageUrl: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
  addressLine1: string | null;
  addressLine2: string | null;
};

export type ReservationWindow = {
  property_id: string;
  start_date: string;
  end_date: string;
};

export type PropertySearchParams = {
  q?: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null;
};

export type PropertySearchResponse = {
  properties: Property[];
  total: number;
};
