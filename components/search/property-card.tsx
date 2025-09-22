"use client";

import { forwardRef } from "react";
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
  onSelect?: () => void;
};

export const PropertyCard = forwardRef<HTMLElement, PropertyCardProps>(function PropertyCard(
  { property, isActive, onHover, onFocus, onSelect },
  ref
) {
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

  const handleSelect = () => {
    onSelect?.();
  };

  return (
    <article
      ref={ref}
      role="button"
      className={clsx(
        "property-card cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2",
        isActive && "is-active"
      )}
      onMouseEnter={onHover}
      onFocus={onFocus}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      }}
      tabIndex={0}
      aria-pressed={Boolean(isActive)}
    >
      <div className="property-card-top-content">
        <Image
          src={heroImageUrl || fallbackImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="property-card-image"
        />
        {isSuperHost ? (
          <div className="card-top-interactive-container">
            <div className="card-accolade">
              <span>Super Host</span>
            </div>
            <div className="card-favorite-button" aria-hidden />
          </div>
        ) : null}
      </div>
      <div className="propert-card-bottom-contnet">
        <div className="card-space">
          <div className="property-card-title">{name}</div>
          {rating ? (
            <div className="property-card-rating-wrapper">
              <span aria-hidden>★</span>
              <span>{rating.toFixed(1)}</span>
              {reviewCount ? <span className="text-xs font-medium text-slate-400">({reviewCount})</span> : null}
            </div>
          ) : null}
        </div>
        <div className="card-second-line text-sm text-slate-500">
          {[city, state, country].filter(Boolean).join(", ") || "Address withheld"}
        </div>
        <p
          className="text-sm text-slate-600"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {shortDescription}
        </p>
        <div className="card-third-line text-xs font-medium text-slate-500">
          <span>{guestCapacity} guests</span>
          <span aria-hidden>•</span>
          <span>{bedrooms} beds</span>
          <span aria-hidden>•</span>
          <span>{bathrooms} baths</span>
        </div>
        <div className="card-price-wrapper items-center justify-between">
          <div>
            <span className="card-price">${nightlyPrice}</span>
            <span className="card-duration">/ night</span>
          </div>
          <Link
            href={`https://easystayretreats.homes/properties/${slug}`}
            className="text-sm font-semibold text-slate-900 underline-offset-4 transition hover:underline"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            View stay
          </Link>
        </div>
      </div>
    </article>
  );
});
