"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { Property } from "@/lib/types";

const fallbackImage = "/images/property-fallback.jpg";

type PropertyCardProps = {
  property: Property;
  isActive?: boolean;
  onHover?: () => void;
  onFocus?: () => void;
};

export function PropertyCard({ property, isActive, onHover, onFocus }: PropertyCardProps) {
  const {
    slug,
    heroImageUrl,
    name,
    city,
    state,
    country,
    bedrooms,
    beds,
    bathrooms,
    guestCapacity,
    nightlyPrice,
    rating,
    reviewCount,
    isSuperHost,
    shortDescription
  } = property;

  return (
    <article
      className={clsx(
        "rounded-card border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2",
        isActive ? "ring-2 ring-slate-900 ring-offset-2" : ""
      )}
      onMouseEnter={onHover}
      onFocus={onFocus}
    >
      <div className="relative h-56 w-full overflow-hidden rounded-t-card">
        <Image
          src={heroImageUrl || fallbackImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {isSuperHost ? (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
            Super Host
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
            <p className="text-sm text-slate-500">
              {[city, state, country].filter(Boolean).join(", ") || "Address withheld"}
            </p>
          </div>
          {rating ? (
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
              <span aria-hidden>★</span>
              <span>{rating.toFixed(1)}</span>
              {reviewCount ? <span className="text-xs text-slate-400">({reviewCount})</span> : null}
            </div>
          ) : null}
        </div>
        <p
          className="text-sm text-slate-600"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {shortDescription}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <span>{guestCapacity} guests</span>
          <span aria-hidden>•</span>
          <span>{bedrooms} beds</span>
          <span aria-hidden>•</span>
          <span>{bathrooms} baths</span>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div className="text-lg font-semibold text-slate-900">
            ${nightlyPrice}
            <span className="ml-1 text-xs font-medium text-slate-500">/ night</span>
          </div>
          <Link
            href={`https://easystayretreats.homes/properties/${slug}`}
            className="text-sm font-semibold text-slate-900 underline-offset-4 transition hover:underline"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
