# EasyStay Retreats Web App

Next.js implementation of the EasyStay Retreats "Search Properties" experience destined for Webflow Cloud hosting. The app mirrors the existing Webflow design while adding a dynamic property catalogue, interactive Google Map, and Supabase-powered filtering.

## Key features
- Responsive, Webflow-inspired layout with property cards and live pricing
- Location, date range, and guest filters tied to Supabase queries
- Google Maps visualization with clickable price pins and viewport-bound searches
- React Query data layer with mock data fallback for local design review
- TypeScript-first code structure with Tailwind utility styling

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the sample environment file and fill in credentials:
   ```bash
   cp .env.example .env
   ```
3. Populate `.env` with your Supabase and Google Maps keys.
4. Run locally:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000/search-properties` in the browser.

To mirror the Webflow Cloud build locally (Cloudflare worker bundle), run:
```bash
npm run webflow:build
```
This uses `next-on-pages` to emit the `.cloudflare` worker output consumed by `wrangler`.

If Supabase variables are missing, the UI still renders using mock listings so styling can be validated without backend access.

## Environment variables
| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (`https://xyzcompany.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client-side usage. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key used only by server-side API routes. Keep private. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JS API key with Maps JavaScript + Places enabled. |

## Recommended Supabase schema
```sql
-- Properties table
create table properties (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  short_description text,
  nightly_price numeric(10,2) not null,
  rating numeric(3,2),
  review_count integer,
  guest_capacity integer not null,
  bedrooms integer default 1,
  beds integer default 1,
  bathrooms numeric(3,1) default 1,
  is_super_host boolean default false,
  hero_image_url text,
  city text,
  state text,
  country text not null,
  latitude numeric not null,
  longitude numeric not null,
  address_line1 text,
  address_line2 text,
  is_published boolean default true,
  created_at timestamptz default now()
);

create index properties_location_idx on properties using gist (
  ll_to_earth(latitude, longitude)
);

create index properties_text_idx on properties using gin (
  to_tsvector('english', coalesce(name,'') || ' ' || coalesce(city,'') || ' ' || coalesce(state,'') || ' ' || coalesce(country,''))
);

-- Reservation windows used to block availability in filters
create table reservations (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties on delete cascade,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

create index reservations_property_date_idx on reservations (property_id, start_date, end_date);
```

> Tip: enable the `earthdistance` and `cube` extensions in Supabase to use `ll_to_earth` for quick bounding-box search. If you prefer to skip extensions, replace the `gist` index with separate indices on `latitude` and `longitude`.

## Data flow
1. Front-end filter state lives in `components/search/search-shell.tsx` and only triggers a new query when "Search" is clicked or the map viewport changes.
2. The React Query hook (`lib/hooks/use-property-search.ts`) hits `/api/properties` with normalized query params. Absent Supabase credentials it serves `lib/mock-properties.ts` for rapid UI review.
3. The API route (`app/api/properties/route.ts`) runs server-side Supabase queries, applies availability validation against the `reservations` table, and returns the trimmed property payload used everywhere in the UI.
4. Map interactions (`components/search/property-map.tsx`) send viewport bounds back into the filter loop so results stay in sync.

## Deploying to Webflow Cloud
- Push this repository to GitHub and connect the Webflow Cloud project to the repo.
- Configure production environment variables in Webflow Cloud (Supabase keys, Google Maps API key, optional log drains).
- Ensure the Google Maps referer restrictions include the Webflow Cloud domain.
- Publish: Webflow Cloud will run `npm install` and `npm run build` followed by `npm run start`.

## Next improvements
1. Wire Supabase Row Level Security policies for the `properties` and `reservations` tables.
2. Add analytics-friendly search logging via Supabase Edge Functions or PostHog.
3. Introduce additional filters (price range, amenities) and map clustering for dense markets.
4. Connect the "View details" button to the CMS/product detail page once live data is available.
