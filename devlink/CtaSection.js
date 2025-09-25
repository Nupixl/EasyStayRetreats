"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./CtaSection.module.css";

export function CtaSection({
  as: _Component = _Builtin.Block,
  title = "Ready to Start Your Easy Stay Journey?",
  subtitle = "Join thousands of property owners who trust Easy Stay for their rental management needs.",
  buttonText = "Get Started Today",
  buttonLink = "/contact",
  backgroundImage = "/webflow-images/cta-background.jpg",
  metaId,
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "cta-section")}
      id={metaId}
      tag="section"
    >
      <div 
        className={_utils.cx(_styles, "cta-background")}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className={_utils.cx(_styles, "cta-content")}>
        <h2 className={_utils.cx(_styles, "cta-title")}>{title}</h2>
        <p className={_utils.cx(_styles, "cta-subtitle")}>{subtitle}</p>
        <a href={buttonLink} className={_utils.cx(_styles, "cta-button")}>
          {buttonText}
        </a>
      </div>
    </_Component>
  );
}
