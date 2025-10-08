import React, { useContext, useEffect, useState } from "react";
import useWishlist from "../../../hooks/useWishlist";
import { Context } from "../../../pages/_app";
import Heart from "../../../public/_svgs/Heart";
import Star from "../../../public/_svgs/star";
import { textResizer } from "../../../utils/handlers";

const WISHLIST_ENABLED = false;

const Card = ({ post }) => {
  const { wishlist } = useContext(Context);
  const [isSaved, changeWishlist] = useWishlist(post, wishlist);

  const propertyTitle = post.title || "Untitled Property";
  const images = Array.isArray(post.images) && post.images.length > 0 ? post.images : [{ url: "/images/default_image.png" }];
  const targetUrl = post.slug
    ? `https://www.easystayretreats.homes/properties/${post.slug}`
    : `/listings/${post._id}`;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [post?._id]);

  const showPrevImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNextImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const activeImage = images[currentIndex] || images[0];
  const normalizeAvailability = (value) => {
    if (typeof value === "string" && value.trim()) {
      return value.trim().toLowerCase();
    }
    if (typeof value === "boolean") {
      return value ? "available" : "unavailable";
    }
    return null;
  };

  const formatAvailabilityLabel = (value = "") =>
    value
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");

  const availabilityNormalized =
    normalizeAvailability(post.availabilityNormalized) ||
    normalizeAvailability(post.availabilityStatus) ||
    normalizeAvailability(post.availability_status) ||
    normalizeAvailability(post.availability?.status) ||
    "available";

  const availabilityStatus =
    typeof post.availabilityStatus === "string"
      ? formatAvailabilityLabel(post.availabilityStatus)
      : formatAvailabilityLabel(availabilityNormalized);

  const isUnavailable = availabilityNormalized !== "available";

  const availabilityTone = (() => {
    if (availabilityNormalized === "available") {
      return {
        badge: "bg-emerald-50",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      };
    }

    if (
      availabilityNormalized === "booked" ||
      availabilityNormalized === "unavailable" ||
      availabilityNormalized === "blocked"
    ) {
      return {
        badge: "bg-rose-50",
        text: "text-rose-600",
        dot: "bg-rose-500",
      };
    }

    return {
      badge: "bg-amber-50",
      text: "text-amber-600",
      dot: "bg-amber-500",
    };
  })();

  const wrapperClasses = `w-full relative transition-opacity duration-200 ${
    isUnavailable ? "opacity-60" : "group"
  } cursor-pointer`;

  const cardClasses = `block bg-white rounded-3xl border border-lightBorderColor/70 shadow-sm transition-all h-full ${
    isUnavailable ? "hover:border-lightBorderColor/70 hover:shadow-sm" : "hover:border-primaryColor/50 hover:shadow-xl"
  }`;

  const imageClasses = `w-full h-full object-cover transition-transform duration-500 ${
    isUnavailable ? "" : "group-hover:scale-105"
  }`;

  return (
    <div className={wrapperClasses} title={propertyTitle}>
      {WISHLIST_ENABLED && (
        <div className="absolute top-6 right-6 z-10" onClick={changeWishlist}>
          <Heart
            css={`h-[23px] w-[23px] stroke-white stroke-[3] transition-colors ${
              isSaved
                ? "fill-[#1f7a8c]"
                : "fill-[rgba(16, 33, 45, 0.35)] group-hover:fill-[rgba(16,33,45,0.55)]"
            }`}
          />
        </div>
      )}
      <a
        className={cardClasses}
        href={targetUrl}
        target="_blank"
        rel="noreferrer"
      >
        <div className="min-h-[250px] h-[calc(50vw/5+20px)] relative overflow-hidden rounded-3xl">
          <img
            src={activeImage?.url}
            className={imageClasses}
            alt={propertyTitle}
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-2 py-1 text-xs font-semibold text-white transition hover:bg-black/70"
                aria-label="Previous photo"
              >
                {"<"}
              </button>
              <button
                type="button"
                onClick={showNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-2 py-1 text-xs font-semibold text-white transition hover:bg-black/70"
                aria-label="Next photo"
              >
                {">"}
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_, index) => (
                  <span
                    key={`indicator-${index}`}
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="mt-4 px-6 pb-6">
          <h1 className="text-lg font-semibold mb-3 flex justify-between text-blackColor">
            <span className="pr-4">
              {textResizer(propertyTitle, 30)}
            </span>
            <span className="flex gap-2 items-center h-fit text-sm text-lightTextColor">
              <span className="inline-flex items-center gap-1 rounded-full bg-surfaceMuted px-3 py-1 text-primaryColor font-semibold">
                <Star />
              {post.rating}
            </span>
          </span>
        </h1>
          <div className="flex items-center justify-between text-sm font-medium text-lightTextColor">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${availabilityTone.badge} ${availabilityTone.text}`}
            >
              <span className={`h-2 w-2 rounded-full ${availabilityTone.dot}`} />
              {availabilityStatus}
            </span>
            <span className="text-primaryColor font-semibold underline decoration-2 decoration-primaryColor/40">
              View details
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-lightTextColor">
            {Number.isFinite(post?.bedrooms) && (
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-blackColor">{post.bedrooms}</span>
                rooms
              </span>
            )}
            {Number.isFinite(post?.beds) && (
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-blackColor">{post.beds}</span>
                beds
              </span>
            )}
            {Number.isFinite(post?.baths) && (
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-blackColor">{post.baths}</span>
                baths
              </span>
            )}
          </div>
        </div>
      </a>
    </div>
  );
};

export default Card;
