"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./PropertyCard.module.css";

export function PropertyCard({
  as: _Component = _Builtin.Block,
  secoundLine = "Second Line Tags",
  accoladeImageDispaly = true,
  accoladeIcon = "",
  imageAccoladeAltText = "__wf_reserved_inherit",
  acolladeFavoriteTag = "div",
  imageSlot,
  runtimeProp = {},
  cardLink = "div",
  slug = "main-slug",
  locationCity,
  locationState,
  locationZip,
  locationDataAddress,
  locationDataLng = "data-lng",
  locationPropertyTitle = "Title of Property ",
  locationDataLat,
  locationStateSmall = "First Line Details",
  locationCitySmall = "First Line Details",
  propertyListingsNumberOfGuest = "2",
  propertyListingsNumberOfBedrooms = "2",
  propertyListingsNumberOfBathrooms = "2",
  propertyDurationDuration = "Monthy.",
  propertyPriceMonthlyPrice = "$99,000",
  propertyPriceMonthlyComparedPrice = "$99,000",
  propertyReviewNumberOfReviews = "(##,####)",
  propertyReviewPropertyRating = "##.##",
  hostAccoladesPlusHost = "Plus Host",
  hostAccoladesSuperHost = "Super Host",
  hostAccoladesVerifiedHost = "Premium Host",
  hostAccoladesSuperHostOn = true,
  hostAccoladesPropertyAccoladeVIsiblitOn = true,
  hostAccoladesPlusHostVIsibility = true,
  hostAccoladesVerifiedHostOn = true,
  hostAccoladesPremiumHostOn = true,
  propertyImageImage1 = "",
  propertyImageImage2 = "",
  propertyImageImage3 = "",
  propertyImageImage4 = "",
  propertyImageImage5 = "",
  variant = "Base",

  propertyLinkPropertyLink = {
    href: "#",
  },

  onClick = {},
  ratingVisibility = false,
  visibility2ndLine = false,
  visibility4thLine = false,
  visibility3rdLine = true,
  visibility1stLine = true,
}) {
  const _styleVariantMap = {
    Base: "",
    Popup: "w-variant-b81090d1-07fa-761b-3373-bb258fe54410",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <_Component
      className={_utils.cx(_styles, "property-card", _activeStyleVariant)}
      tag="div"
      data-property-id={slug}
      {...onClick}
    >
      <_Builtin.Block
        className={_utils.cx(
          _styles,
          "property-card-top-content",
          _activeStyleVariant
        )}
        tag="div"
      >
        <_Builtin.SliderWrapper
          className={_utils.cx(_styles, "slider", _activeStyleVariant)}
          navSpacing={3}
          autoplay={false}
          delay={4000}
          iconArrows={true}
          animation="slide"
          easing="ease"
          navNumbers={false}
          navShadow={false}
          navInvert={false}
          navRound={true}
          disableSwipe={false}
          duration={500}
          infinite={true}
          hideArrows={false}
          autoMax={0}
          {...runtimeProp}
        >
          <_Builtin.Block
            className={_utils.cx(
              _styles,
              "card-top-interactive-container",
              _activeStyleVariant
            )}
            tag="div"
          >
            {hostAccoladesPropertyAccoladeVIsiblitOn ? (
              <_Builtin.DOM
                className={_utils.cx(
                  _styles,
                  "card-accolade",
                  _activeStyleVariant
                )}
                tag="div"
                slot=""
              >
                {accoladeImageDispaly ? (
                  <_Builtin.Block
                    className={_utils.cx(
                      _styles,
                      "icon-wrapper",
                      "small",
                      _activeStyleVariant
                    )}
                    tag="div"
                  >
                    <_Builtin.Image
                      loading="lazy"
                      width="auto"
                      height="auto"
                      src={accoladeIcon}
                    />
                  </_Builtin.Block>
                ) : null}
                {hostAccoladesSuperHostOn ? (
                  <_Builtin.Block tag="div">
                    {hostAccoladesSuperHost}
                  </_Builtin.Block>
                ) : null}
              </_Builtin.DOM>
            ) : null}
            <_Builtin.DOM
              className={_utils.cx(
                _styles,
                "card-favorite-button",
                _activeStyleVariant
              )}
              slot=""
              tag={acolladeFavoriteTag}
            />
          </_Builtin.Block>
          <_Builtin.SliderMask
            className={_utils.cx(_styles, "mask", _activeStyleVariant)}
          >
            <_Builtin.SliderSlide
              className={_utils.cx(
                _styles,
                "expand-slide",
                _activeStyleVariant
              )}
              tag="div"
            >
              {imageSlot ?? (
                <_Builtin.Image
                  className={_utils.cx(
                    _styles,
                    "property-card-image",
                    _activeStyleVariant
                  )}
                  loading="lazy"
                  width="auto"
                  height="auto"
                  alt=""
                  src={propertyImageImage1}
                />
              )}
            </_Builtin.SliderSlide>
            <_Builtin.SliderSlide
              className={_utils.cx(
                _styles,
                "expand-slide",
                _activeStyleVariant
              )}
              tag="div"
            >
              <_Builtin.Image
                className={_utils.cx(
                  _styles,
                  "property-card-image",
                  _activeStyleVariant
                )}
                loading="lazy"
                width="auto"
                height="auto"
                alt=""
                src={propertyImageImage2}
              />
            </_Builtin.SliderSlide>
            <_Builtin.SliderSlide
              className={_utils.cx(
                _styles,
                "expand-slide",
                _activeStyleVariant
              )}
              tag="div"
            >
              <_Builtin.Image
                className={_utils.cx(
                  _styles,
                  "property-card-image",
                  _activeStyleVariant
                )}
                loading="lazy"
                width="auto"
                height="auto"
                alt=""
                src={propertyImageImage3}
              />
            </_Builtin.SliderSlide>
            <_Builtin.SliderSlide
              className={_utils.cx(
                _styles,
                "expand-slide",
                _activeStyleVariant
              )}
              tag="div"
            >
              <_Builtin.Image
                className={_utils.cx(
                  _styles,
                  "property-card-image",
                  _activeStyleVariant
                )}
                loading="lazy"
                width="auto"
                height="auto"
                alt=""
                src={propertyImageImage4}
              />
            </_Builtin.SliderSlide>
            <_Builtin.SliderSlide
              className={_utils.cx(
                _styles,
                "expand-slide",
                _activeStyleVariant
              )}
              tag="div"
            >
              <_Builtin.Image
                className={_utils.cx(
                  _styles,
                  "property-card-image",
                  _activeStyleVariant
                )}
                loading="lazy"
                width="auto"
                height="auto"
                alt=""
                src={propertyImageImage5}
              />
            </_Builtin.SliderSlide>
          </_Builtin.SliderMask>
          <_Builtin.SliderNav
            className={_utils.cx(
              _styles,
              "property-card-slide-nav",
              _activeStyleVariant
            )}
          />
        </_Builtin.SliderWrapper>
      </_Builtin.Block>
      <_Builtin.Link
        className={_utils.cx(
          _styles,
          "property-card-link",
          _activeStyleVariant
        )}
        button={false}
        block="inline"
        options={propertyLinkPropertyLink}
      >
        <_Builtin.Block
          className={_utils.cx(
            _styles,
            "propert-card-bottom-contnet",
            _activeStyleVariant
          )}
          tag="div"
        >
          {visibility1stLine ? (
            <_Builtin.Block
              className={_utils.cx(_styles, "card-space", _activeStyleVariant)}
              id={_utils.cx(
                _styles,
                "w-node-d1a2d0ef-635b-7add-5fbb-67b5746c245f-746c2453"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "property-card-title",
                  _activeStyleVariant
                )}
                tag="div"
                data-field="card-title"
              >
                <_Builtin.Block tag="div">
                  {locationPropertyTitle}
                </_Builtin.Block>
              </_Builtin.Block>
              {ratingVisibility ? (
                <_Builtin.Block
                  className={_utils.cx(
                    _styles,
                    "property-card-rating-wrapper",
                    _activeStyleVariant
                  )}
                  tag="div"
                >
                  <_Builtin.Block
                    className={_utils.cx(
                      _styles,
                      "icon-wrapper",
                      "small",
                      "right-margin",
                      _activeStyleVariant
                    )}
                    tag="div"
                  >
                    <_Builtin.Image
                      loading="lazy"
                      width="auto"
                      height="auto"
                      alt=""
                      src="https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/68c4557aaf8a8e4fa9168144_0f993e3910746ac8f0866441ed90893e_Star.avif"
                    />
                  </_Builtin.Block>
                  <_Builtin.Block
                    className={_utils.cx(
                      _styles,
                      "property-card-rating",
                      _activeStyleVariant
                    )}
                    tag="div"
                    data-field="card-rating"
                  >
                    <_Builtin.Block tag="div">
                      {propertyReviewPropertyRating}
                    </_Builtin.Block>
                  </_Builtin.Block>
                  <_Builtin.Block
                    className={_utils.cx(
                      _styles,
                      "proper-card-number-of-ratings",
                      _activeStyleVariant
                    )}
                    tag="div"
                    data-field="card-rating-count"
                  >
                    <_Builtin.Block tag="div">
                      {propertyReviewNumberOfReviews}
                    </_Builtin.Block>
                  </_Builtin.Block>
                </_Builtin.Block>
              ) : null}
            </_Builtin.Block>
          ) : null}
          {visibility2ndLine ? (
            <_Builtin.Block
              className={_utils.cx(
                _styles,
                "card-second-line",
                _activeStyleVariant
              )}
              tag="div"
            >
              <_Builtin.Block tag="div">{locationCitySmall}</_Builtin.Block>
              <_Builtin.Block tag="div">{","}</_Builtin.Block>
              <_Builtin.Block tag="div">{locationStateSmall}</_Builtin.Block>
            </_Builtin.Block>
          ) : null}
          {visibility3rdLine ? (
            <_Builtin.Block
              className={_utils.cx(
                _styles,
                "card-third-line",
                _activeStyleVariant
              )}
              id={_utils.cx(
                _styles,
                "w-node-d1a2d0ef-635b-7add-5fbb-67b5746c246f-746c2453"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "property-qualities",
                  _activeStyleVariant
                )}
                tag="div"
              >
                <_Builtin.Block tag="div">
                  {propertyListingsNumberOfGuest}
                </_Builtin.Block>
                <_Builtin.Block tag="div">{"guest"}</_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block tag="div">{"-"}</_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "property-qualities",
                  _activeStyleVariant
                )}
                tag="div"
              >
                <_Builtin.Block tag="div">
                  {propertyListingsNumberOfBedrooms}
                </_Builtin.Block>
                <_Builtin.Block tag="div">{"bedrooms"}</_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block tag="div">{"-"}</_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "property-qualities",
                  _activeStyleVariant
                )}
                tag="div"
              >
                <_Builtin.Block tag="div">
                  {propertyListingsNumberOfBathrooms}
                </_Builtin.Block>
                <_Builtin.Block tag="div">{"bathrooms"}</_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
          ) : null}
          {visibility4thLine ? (
            <_Builtin.Block
              className={_utils.cx(
                _styles,
                "card-fourth-line",
                _activeStyleVariant
              )}
              id={_utils.cx(
                _styles,
                "w-node-d1a2d0ef-635b-7add-5fbb-67b5746c2472-746c2453"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "card-price-wrapper",
                  _activeStyleVariant
                )}
                tag="div"
              >
                <_Builtin.Block
                  className={_utils.cx(
                    _styles,
                    "card-compare-price",
                    _activeStyleVariant
                  )}
                  tag="div"
                >
                  {propertyPriceMonthlyComparedPrice}
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(
                    _styles,
                    "card-price",
                    _activeStyleVariant
                  )}
                  tag="div"
                >
                  {propertyPriceMonthlyPrice}
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(
                    _styles,
                    "card-duration",
                    _activeStyleVariant
                  )}
                  tag="div"
                >
                  {propertyDurationDuration}
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
          ) : null}
        </_Builtin.Block>
      </_Builtin.Link>
    </_Component>
  );
}
