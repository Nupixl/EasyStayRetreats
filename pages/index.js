import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { EasyStayNav, SearchPanel } from "../components";
import Wishlist from "../components/Wishlist";
import { Context } from "./_app";
import {
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/outline";

const buildImagesFromAppProperty = (property) => {
  const sources = [
    property.card_image,
    property.hero_slider_image_first,
    property.hero_slider_image_second,
    property.hero_slider_image_third,
    property.showcase_featured_image,
    property.showcase_images_4,
  ];

  const images = [];
  const seen = new Set();
  for (const url of sources) {
    if (!url || typeof url !== "string") continue;
    const trimmed = url.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    images.push({ url: trimmed });
  }

  if (images.length === 0) {
    images.push({ url: "/images/default_image.png" });
  }

  return images;
};

const buildPriceFromAppProperty = (property) => {
  const price =
    property.price_starts_at ??
    property.nightly_rate ??
    property.daily_rate ??
    property.price ??
    0;

  const numeric = Number(price);
  if (Number.isFinite(numeric) && numeric > 0) {
    return `$${numeric.toLocaleString()}`;
  }

  return "$0";
};

const travelerHighlights = [
  {
    title: "Curated stays in inspiring destinations",
    description:
      "Mountain cabins, coastal escapes, and urban lofts selected for style, comfort, and local charm.",
    Icon: SparklesIcon,
  },
  {
    title: "Human support, day or night",
    description:
      "Our guest care team is on call 24/7 to handle recommendations, issues, or last-minute itinerary changes.",
    Icon: PhoneIcon,
  },
  {
    title: "Hotel-level housekeeping",
    description:
      "Professionally laundered linens, stocked essentials, and verified cleanliness so you can simply arrive and unwind.",
    Icon: CheckCircleIcon,
  },
];

const ownerSteps = [
  {
    title: "Revenue forecast & compliance check",
    description:
      "We evaluate your property, analyze demand, and confirm local regulations so you understand your earning potential upfront.",
    Icon: SparklesIcon,
  },
  {
    title: "Launch in as little as two weeks",
    description:
      "Photography, listing optimization, smart-pricing, and distribution across booking platforms are handled for you.",
    Icon: ClockIcon,
  },
  {
    title: "Full-service guest management",
    description:
      "From secure payments and messaging to on-the-ground cleaning and maintenance, we operate every stay with care.",
    Icon: ShieldCheckIcon,
  },
];

const Home = ({ featuredListings = [] }) => {
  const { wishlist, setWishlist } = useContext(Context);

  return (
    <>
      <Head>
        <title>EasyStay Retreats | Stress-free stays & property management</title>
        <meta
          name="description"
          content="Discover curated EasyStay retreats or partner with us to manage your vacation rental. We handle guest care, cleaning, and revenue optimization so you can relax."
        />
      </Head>
      <EasyStayNav />
      <main className="bg-white text-blackColor">
        <section className="overflow-hidden bg-gradient-to-br from-white via-surfaceMuted to-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primaryColor">
                Welcome to EasyStay
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-blackColor sm:text-5xl">
                Find Your Easy Stay
              </h1>
              <p className="mt-6 text-lg text-lightTextColor">
                From listings and marketing to on-call guest support, hotel-grade cleaning, and transparent payouts—our team manages every detail so you can experience effortless travel and hosting.
              </p>
              <SearchPanel
                className="mt-10 max-w-xl"
                variant="hero"
                buttonLabel="Explore retreats"
              />
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-lightTextColor">
                24/7 Guest Support • Hotel-Grade Cleaning • Secure Payments
              </p>
            </div>
            <div className="relative h-[320px] overflow-hidden rounded-3xl shadow-xl sm:h-[420px]">
              <Image
                src="/images/apartment.jpg"
                alt="Relaxing EasyStay living room with natural light"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primaryColor">
                Your travel made easy
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Explore our most popular properties
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-base text-lightTextColor">
                Choose from curated homes, cabins, and villas that balance thoughtful design with outstanding service.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredListings.map((listing) => {
                const title = listing.title?.trim() || "Featured retreat";
                const location = listing.lt?.trim();
                const price = listing.price?.trim();
                const id = listing._id?.trim();

                return (
                  <article
                    key={id}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-lightBorderColor bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={listing.images?.[0]?.url}
                        alt={title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                      <div className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                        EasyStay
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="text-xl font-semibold text-blackColor">
                          {title}
                        </h3>
                        {location && (
                          <p className="mt-2 text-sm text-lightTextColor">{location}</p>
                        )}
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        {price && (
                          <p className="text-sm font-semibold text-primaryColor">
                            {price} <span className="text-lightTextColor font-normal">nightly</span>
                          </p>
                        )}
                        <Link
                          href={`/listings/${encodeURIComponent(id)}`}
                          className="text-sm font-semibold text-primaryColor transition hover:text-primaryColor/80"
                        >
                          View stay →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/s/_"
                className="inline-flex items-center rounded-full border border-primaryColor px-6 py-3 text-sm font-semibold text-primaryColor transition hover:bg-primaryColor hover:text-white"
              >
                Browse all retreats
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-surfaceMuted py-16 sm:py-20">
          <div className="mx-auto max-w-6xl grid gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primaryColor">
                For travelers
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Stay in spaces you cannot wait to share
              </h2>
              <p className="mt-4 text-base text-lightTextColor">
                Every EasyStay home is personally vetted for comfort, design, and proximity to neighborhood experiences. We coordinate welcome touches and insider recommendations so you feel at home from check-in to checkout.
              </p>
              <div className="mt-8 space-y-6">
                {travelerHighlights.map(({ title, description, Icon }) => (
                  <div key={title} className="flex gap-4">
                    <Icon className="h-10 w-10 flex-shrink-0 text-primaryColor" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg font-semibold text-blackColor">{title}</h3>
                      <p className="mt-1 text-sm text-lightTextColor">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/s/_"
                className="mt-10 inline-flex items-center rounded-full bg-primaryColor px-6 py-3 text-sm font-semibold text-white transition hover:bg-primaryColor/90"
              >
                Plan your next stay
              </Link>
            </div>
            <div className="relative h-[320px] overflow-hidden rounded-3xl shadow-xl sm:h-[420px]">
              <Image
                src="/images/hotel.jpg"
                alt="Couple enjoying an EasyStay retreat"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div className="relative order-2 h-[320px] overflow-hidden rounded-3xl shadow-xl sm:order-1 sm:h-[420px]">
              <Image
                src="/images/house.jpg"
                alt="Property owner partnering with EasyStay"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />
            </div>
            <div className="order-1 sm:order-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primaryColor">
                For owners
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                We run your rental like a boutique hotel
              </h2>
              <p className="mt-4 text-base text-lightTextColor">
                Skip the late-night messages, complicated pricing tools, and vendor scheduling. With EasyStay, you have a dedicated partner to grow revenue while safeguarding your home.
              </p>
              <div className="mt-8 space-y-6">
                {ownerSteps.map(({ title, description, Icon }) => (
                  <div key={title} className="flex gap-4">
                    <Icon className="h-10 w-10 flex-shrink-0 text-primaryColor" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg font-semibold text-blackColor">{title}</h3>
                      <p className="mt-1 text-sm text-lightTextColor">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/owners/contact"
                className="mt-10 inline-flex items-center rounded-full border border-primaryColor px-6 py-3 text-sm font-semibold text-primaryColor transition hover:bg-primaryColor hover:text-white"
              >
                Talk with our team
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-blackColor py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to unlock your property’s potential?
            </h2>
            <p className="mt-6 text-base text-white/80">
              Let’s personalize a management plan that maximizes revenue while delivering unforgettable guest experiences.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/owners/revenue"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blackColor transition hover:bg-surfaceMuted"
              >
                Get a revenue estimate
              </Link>
              <Link
                href="/s/_"
                className="inline-flex items-center rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse current retreats
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-lightBorderColor bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-lightTextColor sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EasyStay Retreats. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-primaryColor">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primaryColor">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-primaryColor">
              Contact
            </Link>
          </div>
        </div>
      </footer>

      {wishlist && <Wishlist setWishlist={setWishlist} />}
    </>
  );
};

export const getStaticProps = async () => {
  try {
    const { supabaseAdmin, supabase, isSupabaseConfigured } = await import('../lib/supabase')

    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const client = supabaseAdmin ?? supabase
    if (!client) {
      throw new Error('Supabase client unavailable')
    }

    const { data, error } = await client
      .from('App-Properties')
      .select('*')
      .eq('webflow_status', 'Active')
      .order('created', { ascending: false })
      .limit(3)

    if (error) {
      throw error
    }

    const featuredListings = (data || []).map((property) => ({
      _id: property.whalesync_postgres_id || property.id,
      title: property.name || 'Untitled Property',
      rating: property.property_rating ? property.property_rating.toString() : '',
      review: `${property.total_reviews || 0} review${property.total_reviews === 1 ? '' : 's'}`,
      lt: [property.city, property.state].filter(Boolean).join(', ') || property.street_address,
      images: buildImagesFromAppProperty(property),
      price: buildPriceFromAppProperty(property),
      about: property.body_description,
      user: null,
      reviews: [],
      geolocation: {
        lat: Number(property.latitude) || 0,
        lng: Number(property.longitude) || 0,
      },
      amenities: [],
    }))

    return {
      props: { featuredListings },
      revalidate: 60,
    }
  } catch (error) {
    console.error('Error loading featured listings:', error)
    return {
      props: { featuredListings: [] },
      revalidate: 60,
    }
  }
}

export default Home;
