"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./PropertyDirectory.module.css";

export function PropertyDirectory({
  as: _Component = _Builtin.Block,
  numberOfProperties = "###",
  propertyFilter = true,
  propertyCountLabel = "Properties",
  propertyFilterSlot,
  propertyCardSlot,
  _4thElementTag = "div",
  _4thElementValue,
  _4thElementKey,
  _4thElementText = "Search",
  _3rdElementTag = "div",
  _3rdElementText = "Who",
  _3rdElementKey,
  _2ndElementTag = "div",
  _2ndElementText = "When",
  _2ndElementKey,
  _2ndElementValue,
  _1stElementTag = "div",
  _1stElementText = "Where",
  _1stElementKey,
  _1stElementValue,
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "map-property-wrapper")}
      tag="div"
    >
      <_Builtin.Block
        className={_utils.cx(_styles, "map-property-contiainer")}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "search-nav-wrapper")}
          tag="div"
          id="SearchNavWrapper"
        >
          {(propertyFilterSlot || propertyFilter) && (
            <_Builtin.DOM
              className={_utils.cx(_styles, "property-filter")}
              tag="div"
              slot=""
            >
              {propertyFilterSlot ?? (
                <>
                  <_Builtin.DOM
                    className={_utils.cx(_styles, "search-menu-dropdown")}
                    slot=""
                    tag={_1stElementTag}
                  >
                    {_1stElementText}
                  </_Builtin.DOM>
                  <_Builtin.DOM
                    className={_utils.cx(_styles, "search-menu-dropdown")}
                    slot=""
                    tag={_2ndElementTag}
                  >
                    {_2ndElementText}
                  </_Builtin.DOM>
                  <_Builtin.DOM
                    className={_utils.cx(_styles, "search-menu-dropdown")}
                    slot=""
                    tag={_3rdElementTag}
                  >
                    {_3rdElementText}
                  </_Builtin.DOM>
                  <_Builtin.DOM
                    className={_utils.cx(_styles, "seach-menu-button")}
                    slot=""
                    tag={_4thElementTag}
                  >
                    {_4thElementText}
                  </_Builtin.DOM>
                </>
              )}
            </_Builtin.DOM>
          )}
        </_Builtin.Block>
        <_Builtin.Block
          className={_utils.cx(_styles, "map-property-bottom-contianer")}
          tag="div"
        >
          <_Builtin.Block
            className={_utils.cx(_styles, "property-notice")}
            tag="div"
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "subtitle")}
              tag="div"
            >
              {numberOfProperties}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "subtitle")}
              tag="div"
            >
              {propertyCountLabel}
            </_Builtin.Block>
          </_Builtin.Block>
          <_Builtin.Block
            className={_utils.cx(_styles, "property-listing-wrapper")}
            tag="div"
          >
            {propertyCardSlot || null}
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
