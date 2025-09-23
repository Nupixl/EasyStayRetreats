import React, { useContext, useEffect, useState } from "react";
import useWishlist from "../../../hooks/useWishlist";
import { Context } from "../../../pages/_app";
import Heart from "../../../public/_svgs/Heart";
import Star from "../../../public/_svgs/star";
import { textResizer } from "../../../utils/handlers";

const Card = ({ post }) => {
  const { wishlist } = useContext(Context);
  const [isSaved, changeWishlist] = useWishlist(post, wishlist);

  const propertyTitle = post.title || "Untitled Property";
  const priceLabel = post.priceLabel || "per stay";
  const images = Array.isArray(post.images) && post.images.length > 0 ? post.images : [{ url: "/images/default_image.png" }];
  const targetUrl = post.slug
    ? `https://www.easystayretreats.homes/properties/${post.slug}`
    : `/listings/${post._id}`;

  return (
    <div className="w-full cursor-pointer relative group" title={propertyTitle}>
      <div className="absolute top-6 right-6 z-10" onClick={changeWishlist}>
        <Heart
          css={`h-[23px] w-[23px] stroke-white stroke-[3] transition-colors ${
            isSaved
              ? "fill-[#1f7a8c]"
              : "fill-[rgba(16, 33, 45, 0.35)] group-hover:fill-[rgba(16,33,45,0.55)]"
          }`}
        />
      </div>
      <a
        className="block bg-white rounded-3xl border border-lightBorderColor/70 hover:border-primaryColor/50 shadow-sm hover:shadow-xl transition-all h-full"
        href={targetUrl}
        target="_blank"
        rel="noreferrer"
      >
        <div className="min-h-[250px] h-[calc(50vw/5+20px)] relative overflow-hidden rounded-3xl">
          <img
            src={images[0].url}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
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
          <span className="text-sm font-medium flex gap-1 items-center text-lightTextColor">
            <span className="text-lg text-primaryColor font-semibold">
              {post.price}
            </span>
            <span>{priceLabel}</span>
          </span>
        </div>
      </a>
    </div>
  );
};

export default Card;
