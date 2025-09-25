"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./HeroSection.module.css";

export function HeroSection({
  as: _Component = _Builtin.Block,
  title = "Find Your Easy Stay",
  subtitle = "From listings to guest support, cleaning, and financials—everything handled. Experience hassle-free property management with our expert team.",
  searchPlaceholder = "Search location",
  features = "24/7 Guest Support • Hotel-Grade Cleaning • Secure Payments",
  backgroundImage = "/webflow-images/hero-background.jpg",
  metaId,
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "hero-section")}
      id={metaId}
      tag="section"
    >
      <div className={_utils.cx(_styles, "hero-content")}>
        <div className={_utils.cx(_styles, "hero-text")}>
          <h1 className={_utils.cx(_styles, "hero-title")}>{title}</h1>
          <p className={_utils.cx(_styles, "hero-subtitle")}>{subtitle}</p>
          <div className={_utils.cx(_styles, "hero-features")}>{features}</div>
        </div>
        <div className={_utils.cx(_styles, "hero-search")}>
          <form className={_utils.cx(_styles, "search-form")}>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className={_utils.cx(_styles, "search-input")}
            />
            <input
              type="date"
              className={_utils.cx(_styles, "search-input")}
            />
            <input
              type="date"
              className={_utils.cx(_styles, "search-input")}
            />
            <input
              type="number"
              placeholder="Guests"
              className={_utils.cx(_styles, "search-input")}
            />
            <button type="submit" className={_utils.cx(_styles, "search-button")}>
              Search
            </button>
          </form>
        </div>
      </div>
      <div 
        className={_utils.cx(_styles, "hero-background")}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
    </_Component>
  );
}
