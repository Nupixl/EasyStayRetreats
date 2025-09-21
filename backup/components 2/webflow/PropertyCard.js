"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function PropertyCard({
  as: _Component = _Builtin.DOM,
  propertyTitle = "Title of Property ",
  firstLine = "First Line Details",
  secoundLine = "Second Line Tags",
  comparedPrice = "$99,000",
  price = "$99,000",
  duration = "Monthy.",
  propertyRating = "##.##",
  numberOfReviews = "(##,####)",
  propertyAccolade = true,
  propertyAccoladeType = "Super Host",
  accoladeImageDispaly = true,
  accoladeIcon = "",
  imageAccoladeAltText = "__wf_reserved_inherit",
  acolladeFavoriteTag = "div",
  imageSlot,
  runtimeProp = {},
  cardLink = "div",
}) {
  return (
    <_Component className="property-card" tag={cardLink}>
      <_Builtin.Block className="property-card-top-content" tag="div">
        <_Builtin.SliderWrapper
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
          <_Builtin.Block className="card-top-interactive-container" tag="div">
            {propertyAccolade ? (
              <_Builtin.DOM className="card-accolade" tag="div">
                {accoladeImageDispaly ? (
                  <_Builtin.Block className="icon-wrapper small" tag="div">
                    <_Builtin.Image
                      loading="lazy"
                      width="auto"
                      height="auto"
                      src={accoladeIcon}
                    />
                  </_Builtin.Block>
                ) : null}
                <_Builtin.Block tag="div">
                  {propertyAccoladeType}
                </_Builtin.Block>
              </_Builtin.DOM>
            ) : null}
            <_Builtin.DOM
              className="card-favorite-button"
              tag={acolladeFavoriteTag}
            />
          </_Builtin.Block>
          <_Builtin.SliderMask>
            <_Builtin.SliderSlide tag="div">{imageSlot}</_Builtin.SliderSlide>
            <_Builtin.SliderSlide tag="div" />
          </_Builtin.SliderMask>
          <_Builtin.SliderArrow className="hide" dir="left">
            <_Builtin.Icon
              widget={{
                type: "icon",
                icon: "slider-left",
              }}
            />
          </_Builtin.SliderArrow>
          <_Builtin.SliderArrow className="hide" dir="right">
            <_Builtin.Icon
              widget={{
                type: "icon",
                icon: "slider-right",
              }}
            />
          </_Builtin.SliderArrow>
          <_Builtin.SliderNav />
        </_Builtin.SliderWrapper>
      </_Builtin.Block>
      <_Builtin.Block className="propert-card-bottom-contnet" tag="div">
        <_Builtin.Block className="card-first-line" tag="div">
          <_Builtin.Block className="property-card-title" tag="div">
            <_Builtin.Block tag="div">{propertyTitle}</_Builtin.Block>
          </_Builtin.Block>
          <_Builtin.Block className="property-card-rating-wrapper" tag="div">
            <_Builtin.Block className="icon-wrapper small" tag="div">
              <_Builtin.Image
                loading="lazy"
                width="auto"
                height="auto"
                alt=""
                src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg"
              />
            </_Builtin.Block>
            <_Builtin.Block className="property-card-rating" tag="div">
              <_Builtin.Block tag="div">{propertyRating}</_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block className="proper-card-number-of-ratings" tag="div">
              <_Builtin.Block tag="div">{numberOfReviews}</_Builtin.Block>
            </_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block className="card-second-line" tag="div">
          <_Builtin.Block tag="div">{firstLine}</_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block className="card-third-line" tag="div">
          <_Builtin.Block tag="div">{secoundLine}</_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block
          className="card-fourth-line"
          id="w-node-d1a2d0ef-635b-7add-5fbb-67b5746c2472-746c2453"
          tag="div"
        >
          <_Builtin.Block className="card-price-wrapper" tag="div">
            <_Builtin.Block className="card-compare-price" tag="div">
              {comparedPrice}
            </_Builtin.Block>
            <_Builtin.Block className="card-price" tag="div">
              {price}
            </_Builtin.Block>
            <_Builtin.Block className="card-duration" tag="div">
              {duration}
            </_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
