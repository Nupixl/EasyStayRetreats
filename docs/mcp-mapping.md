# MCP Mapping

## `/api/referral` (POST)

- **Purpose:** Receives property owner referrals from affiliate landing pages and persists them to Supabase with the new split-name schema + lead metadata.
- **Auth flow:** Uses `createServerClient` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` plus the incoming Next.js cookies (`cookieStore`) so requests can run server-side and respect the visitor/session context.
- **Sample request body:**
  ```json
  {
    "linkId": "abc-123",
    "firstName": "Jordan",
    "lastName": "Parks",
    "email": "jordan@example.com",
    "phone": "555-1234",
    "role": "property-owner",
    "propertiesCount": 4,
    "listingLinks": "https://airbnb.com/listing/abc\nhttps://vrbo.com/listing/xyz"
  }
  ```
- **Sample successful response:**
  ```json
  {
    "success": true,
    "referralId": "ref-789"
  }
  ```
- **Supabase schema mapping:**
  - `referrals.first_name` ← `firstName`
  - `referrals.last_name` ← `lastName`
  - `referrals.owner_email` ← `email`
  - `referrals.phone` ← `phone`
  - `referrals.role` ← `role`
  - `referrals.properties_count` ← `propertiesCount`
  - `referrals.listing_links` ← `listingLinks`
  - `referrals.affiliate_link_id` ← `linkId`

- **Failure handling:** Any Supabase insert error returns a 500 + error message. The page displays the `message` text from the JSON response so the user can retry.

## `/api/landing-pages` (POST)

- **Purpose:** Saves the affiliate’s landing page layout (order + section data) and optionally publishes the layout so `/refer/[slug]` renders the latest CRO-ready stack.
- **Auth flow:** Server route uses `createServerClient` with the public Supabase creds and the current Next.js request cookies to enforce the RLS policy that only the owning affiliate can update their layout.
- **Sample request body:**
  ```json
  {
    "linkId": "link-123",
    "publish": true,
    "sections": [
      {
        "id": "hero-1",
        "type": "hero",
        "data": {
          "headline": "Scale with confidence",
          "subheadline": "Modern ops and guest care ready for tomorrow.",
          "ctaText": "Preview the plan",
          "ctaLink": "#",
          "backgroundImage": "https://images.unsplash.com/..."
        }
      },
      {
        "id": "form-1",
        "type": "form",
        "data": {
          "headline": "Share your property details",
          "subheadline": "Our team responds in 24 hours."
        }
      }
    ]
  }
  ```
- **Sample successful response:**
  ```json
  {
    "success": true
  }
  ```
- **Supabase schema mapping:**
  - `landing_pages.affiliate_link_id` ← `linkId`
  - `landing_pages.sections` ← `sections` (JSONB)
  - `landing_pages.is_published` ← `publish`

- **Failure handling:** Route returns 404 when the link is missing or 500 when Supabase rejects the upsert; the builder UI surfaces the error and keeps the canvas state intact.

## `/api/affiliate-links/[linkId]/builder` (GET)

- **Purpose:** Serves the Draft/Published landing layout + link metadata that the affiliate builder needs (hero text, CTA labels, form data) before any edits are made.
- **Auth flow:** Uses the same Supabase server client + cookies helpers to enforce that only the owning affiliate can fetch their builder state.
- **Sample response:**
  ```json
  {
    "link": {
      "id": "link-123",
      "name": "Winter Launch",
      "slug": "winter-launch"
    },
    "landingPage": {
      "sections": [
        { "type": "hero", "data": { "headline": "Scale with confidence" } },
        { "type": "form", "data": { "headline": "Tell us about your portfolio" } }
      ],
      "is_published": true
    }
  }
  ```
- **Failure handling:** Returns `401` when no session/cookie is present, `403` when the link belongs to another affiliate, and `404` when the link is missing.

