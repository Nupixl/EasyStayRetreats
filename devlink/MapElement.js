"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./MapElement.module.css";

export function MapElement({
  as: _Component = _Builtin.Block,
  metaAcolladeFavoriteTag = "div",
  metaRuntimeProp = {},
  metaSlug = "main-slug",
}) {
  return (
    <_Component className={_utils.cx(_styles, "map-element")} tag="div">
      <_Builtin.Block
        className={_utils.cx(_styles, "map-container-full")}
        tag="div"
        id="search-map"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "map-google")}
          tag="div"
          id="property-map"
        />
      </_Builtin.Block>
    </_Component>
  );
}
