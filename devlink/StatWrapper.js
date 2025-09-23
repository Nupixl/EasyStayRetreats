"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./StatWrapper.module.css";

export function StatWrapper({
  as: _Component = _Builtin.Block,
  slot,
  textTitle = "Stat Card Title",
  visibilityStatCardIconVisibility = true,
  imageStatCardImage = "",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Card: "w-variant-1cc07ec0-83eb-af2a-b096-213283aa030e",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <_Component
      className={_utils.cx(_styles, "stat-container", _activeStyleVariant)}
      tag="div"
    >
      <_Builtin.Block
        className={_utils.cx(
          _styles,
          "stat-container-header",
          _activeStyleVariant
        )}
        tag="div"
      >
        {visibilityStatCardIconVisibility ? (
          <_Builtin.Block
            className={_utils.cx(
              _styles,
              "stat-header-icon-wrapper",
              _activeStyleVariant
            )}
            tag="div"
          >
            <_Builtin.Image
              loading="lazy"
              width="auto"
              height="auto"
              alt=""
              src={imageStatCardImage}
            />
          </_Builtin.Block>
        ) : null}
        <_Builtin.Block
          className={_utils.cx(_styles, "stat-card-title", _activeStyleVariant)}
          tag="div"
        >
          <_Builtin.Heading tag="h2">{textTitle}</_Builtin.Heading>
        </_Builtin.Block>
      </_Builtin.Block>
      <_Builtin.Block
        className={_utils.cx(
          _styles,
          "stat-container-body",
          _activeStyleVariant
        )}
        tag="div"
      >
        <_Builtin.NotSupported _atom="Slot" />
        <_Builtin.NotSupported _atom="Slot" />
        <_Builtin.NotSupported _atom="Slot" />
        <_Builtin.NotSupported _atom="Slot" />
      </_Builtin.Block>
    </_Component>
  );
}
