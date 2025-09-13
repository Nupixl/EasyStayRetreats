"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function EnhancedSearchFilters({ as: _Component = _Builtin.Section }) {
  return (
    <_Component
      grid={{
        type: "section",
      }}
      tag="section"
    >
      <_Builtin.BlockContainer
        grid={{
          type: "container",
        }}
        tag="div"
      >
        <_Builtin.Heading tag="h2">{"Search Filters"}</_Builtin.Heading>
        <_Builtin.Block tag="div">
          <_Builtin.Heading tag="h4">{"Location"}</_Builtin.Heading>
          <_Builtin.Block tag="div">
            {"This is some text inside of a div block."}
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block tag="div">
          <_Builtin.Heading tag="h4">{"Check-in Date"}</_Builtin.Heading>
          <_Builtin.Block tag="div">
            {"This is some text inside of a div block."}
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block tag="div">
          <_Builtin.Heading tag="h4">{"Check-out Date"}</_Builtin.Heading>
          <_Builtin.Block tag="div">
            {"This is some text inside of a div block."}
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block tag="div">
          <_Builtin.Heading tag="h4">{"Guests"}</_Builtin.Heading>
          <_Builtin.Block tag="div">
            {"This is some text inside of a div block."}
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Link
          button={true}
          block=""
          options={{
            href: "#",
          }}
        >
          {"Search Properties"}
        </_Builtin.Link>
      </_Builtin.BlockContainer>
    </_Component>
  );
}
