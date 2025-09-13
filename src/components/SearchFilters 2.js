"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function SearchFilters({ as: _Component = _Builtin.Section }) {
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
        <_Builtin.Heading tag="h3">{"Location"}</_Builtin.Heading>
        <_Builtin.Block tag="div">
          {"This is some text inside of a div block."}
        </_Builtin.Block>
        <_Builtin.Heading tag="h3">{"Check-in Date"}</_Builtin.Heading>
        <_Builtin.Block tag="div">
          {"This is some text inside of a div block."}
        </_Builtin.Block>
        <_Builtin.Heading tag="h3">{"Check-out Date"}</_Builtin.Heading>
        <_Builtin.Block tag="div">
          {"This is some text inside of a div block."}
        </_Builtin.Block>
        <_Builtin.Heading tag="h3">{"Guests"}</_Builtin.Heading>
        <_Builtin.Block tag="div">
          {"This is some text inside of a div block."}
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
