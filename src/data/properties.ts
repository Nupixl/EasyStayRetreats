export type PropertyHost = {
  name: string;
  avatar: string;
  isSuperhost: boolean;
};

export type Property = {
  id: string;
  title: string;
  location: string;
  type: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  availability: boolean;
  amenities: string[];
  guests: number;
  beds: number;
  baths: number;
  images: string[];
  host: PropertyHost;
  lat: number;
  lng: number;
};

export const properties: Property[] = [
  {
    id: "downtown-loft-city-views",
    title: "Downtown Loft with City Views",
    location: "Austin, TX",
    type: "Loft",
    pricePerNight: 120,
    rating: 4.8,
    reviewCount: 124,
    availability: true,
    amenities: ["WiFi", "Kitchen", "Rooftop"],
    guests: 2,
    beds: 1,
    baths: 1,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    ],
    host: { name: "Alex", avatar: "https://i.pravatar.cc/100?img=5", isSuperhost: true },
    lat: 30.274665,
    lng: -97.74035,
  },
  {
    id: "beachfront-condo-ocean-views",
    title: "Beachfront Condo with Ocean Views",
    location: "Miami Beach, FL",
    type: "Condo",
    pricePerNight: 250,
    rating: 4.9,
    reviewCount: 210,
    availability: true,
    amenities: ["Pool", "Spa", "Ocean View"],
    guests: 4,
    beds: 2,
    baths: 2,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
    ],
    host: { name: "Bea", avatar: "https://i.pravatar.cc/100?img=15", isSuperhost: true },
    lat: 25.819000,
    lng: -80.122000,
  },
  {
    id: "mountain-view-cabin-hot-tub",
    title: "Mountain View Cabin with Hot Tub",
    location: "Asheville, NC",
    type: "Cabin",
    pricePerNight: 150,
    rating: 4.7,
    reviewCount: 98,
    availability: true,
    amenities: ["Hot Tub", "Fireplace", "Mountain View"],
    guests: 6,
    beds: 3,
    baths: 2,
    images: [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1200&auto=format&fit=crop",
    ],
    host: { name: "Chris", avatar: "https://i.pravatar.cc/100?img=20", isSuperhost: false },
    lat: 35.595058,
    lng: -82.551487,
  },
  {
    id: "hot-tub-pool-table-ping-pong-poker-big-sky",
    title: "Big Sky • Hot Tub • Pool Table • Ping Pong",
    location: "McHenry, MD",
    type: "Lodge",
    pricePerNight: 420,
    rating: 4.85,
    reviewCount: 64,
    availability: true,
    amenities: ["Hot Tub", "Game Room", "Lake Access"],
    guests: 16,
    beds: 10,
    baths: 5,
    images: [
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=1200&auto=format&fit=crop",
    ],
    host: { name: "Dana", avatar: "https://i.pravatar.cc/100?img=32", isSuperhost: false },
    lat: 39.558000,
    lng: -79.350000,
  },
  {
    id: "sunset-home-hot-tub-3-king-beds",
    title: "Sunset Home • Hot Tub • 3 King Beds",
    location: "Albuquerque, NM",
    type: "Home",
    pricePerNight: 285,
    rating: 4.76,
    reviewCount: 88,
    availability: true,
    amenities: ["Hot Tub", "Garage", "Backyard"],
    guests: 10,
    beds: 3,
    baths: 2.5,
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop",
    ],
    host: { name: "Evan", avatar: "https://i.pravatar.cc/100?img=8", isSuperhost: true },
    lat: 35.084385,
    lng: -106.650421,
  },
];


