"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./StatCard.module.css";

export function StatCard({
  as: _Component = _Builtin.Block,
  textTitle = "",
  textMainStat = "Main Stat:",
  textBooking = "Bookings:",
  textAvgPrice = "Avg Price:",
  textPillText = "Pill",
  statBookingsStat = "253",
  statAveragePrice = "$425",
  visibilitySecondLine = true,
  visibilityFirstLine = true,
  visibilityThirdLine = true,
}) {
  return (
    <_Component className={_utils.cx(_styles, "stat-card")} tag="div">
      <_Builtin.Heading tag="h4">{textTitle}</_Builtin.Heading>
      {visibilityFirstLine ? (
        <_Builtin.Block className={_utils.cx(_styles, "card-space")} tag="div">
          <_Builtin.Block tag="div">{textMainStat}</_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "pill")} tag="div">
            <_Builtin.Block tag="div">{textPillText}</_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
      ) : null}
      {visibilitySecondLine ? (
        <_Builtin.Block className={_utils.cx(_styles, "card-space")} tag="div">
          <_Builtin.Block tag="div">{textBooking}</_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "main-stat")} tag="div">
            <_Builtin.Block tag="div">{statBookingsStat}</_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
      ) : null}
      {visibilityThirdLine ? (
        <_Builtin.Block className={_utils.cx(_styles, "card-space")} tag="div">
          <_Builtin.Block tag="div">{textAvgPrice}</_Builtin.Block>
          <_Builtin.Block
            className={_utils.cx(_styles, "main-stat", "positive")}
            tag="div"
          >
            <_Builtin.Block tag="div">{statAveragePrice}</_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
      ) : null}
    </_Component>
  );
}
