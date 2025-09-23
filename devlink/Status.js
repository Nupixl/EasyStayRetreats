"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./Status.module.css";

export function Status({
  as: _Component = _Builtin.Block,
  variant = "Base",
  textTitle = "Status Phase",
  textPropertyQuanttity = "7",
  textPorpertyValue = "properties",
  textStatValue = "$320K",
  visiblityStatValueVisibility = true,
  visiblityStatValue = true,
  visiblityStatTitle = true,
}) {
  const _styleVariantMap = {
    Base: "",
    Pending: "w-variant-0693249f-9166-9afd-56f2-828b270747dc",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <_Component
      className={_utils.cx(_styles, "status", _activeStyleVariant)}
      tag="div"
    >
      <_Builtin.Block
        className={_utils.cx(_styles, "status-header", _activeStyleVariant)}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "status-alert", _activeStyleVariant)}
          tag="div"
        />
        <_Builtin.Block tag="div">
          {visiblityStatTitle ? (
            <_Builtin.Heading tag="h3">{textTitle}</_Builtin.Heading>
          ) : null}
          {visiblityStatValue ? (
            <_Builtin.Block
              className={_utils.cx(
                _styles,
                "lower-stat-bar",
                _activeStyleVariant
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "properties",
                  _activeStyleVariant
                )}
                tag="div"
              >
                <_Builtin.Block
                  className={_utils.cx(
                    _styles,
                    "property-quantity",
                    _activeStyleVariant
                  )}
                  tag="div"
                >
                  <_Builtin.Block tag="div">
                    {textPropertyQuanttity}
                  </_Builtin.Block>
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(
                    _styles,
                    "property-value",
                    _activeStyleVariant
                  )}
                  tag="div"
                >
                  <_Builtin.Block tag="div">{textPorpertyValue}</_Builtin.Block>
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
          ) : null}
        </_Builtin.Block>
      </_Builtin.Block>
      <_Builtin.Block
        className={_utils.cx(
          _styles,
          "stat-bar-right-side",
          _activeStyleVariant
        )}
        tag="div"
      >
        {visiblityStatValueVisibility ? (
          <_Builtin.Heading tag="h3">{textStatValue}</_Builtin.Heading>
        ) : null}
      </_Builtin.Block>
    </_Component>
  );
}
