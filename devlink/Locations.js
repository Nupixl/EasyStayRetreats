"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./Locations.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-86":{"id":"e-86","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-42","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-87"}},"mediaQueries":["main"],"target":{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"},"targets":[{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618074188760},"e-87":{"id":"e-87","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-43","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-86"}},"mediaQueries":["main"],"target":{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"},"targets":[{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618074188764},"e-349":{"id":"e-349","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-42","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-350"}},"mediaQueries":["main"],"target":{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"},"targets":[{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618855282427},"e-350":{"id":"e-350","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-43","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-349"}},"mediaQueries":["main"],"target":{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"},"targets":[{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618855282440}},"actionLists":{"a-42":{"id":"a-42","title":"Team image hover","actionItemGroups":[{"actionItems":[{"id":"a-42-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-15","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-background-image","selectorGuids":["89d61fed-031e-d4c2-d24e-bc7b0024ce1e"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-42-n-13","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".overlay","selectorGuids":["7258385c-17b5-eee3-727d-d512cda37146"]},"globalSwatchId":"","rValue":15,"bValue":38,"gValue":19,"aValue":0.05}},{"id":"a-42-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"value":0,"unit":""}},{"id":"a-42-n-2","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-42-n-10","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-12","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-42-n-11","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-42-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-16","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-background-image","selectorGuids":["89d61fed-031e-d4c2-d24e-bc7b0024ce1e"]},"xValue":1.03,"yValue":1.03,"locked":true}},{"id":"a-42-n-14","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".overlay","selectorGuids":["7258385c-17b5-eee3-727d-d512cda37146"]},"globalSwatchId":"","rValue":15,"bValue":38,"gValue":19,"aValue":0.55}},{"id":"a-42-n-9","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"value":1,"unit":""}},{"id":"a-42-n-8","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-42-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":200,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-6","actionTypeId":"TRANSFORM_SCALE","config":{"delay":200,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-42-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":200,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618074191793},"a-43":{"id":"a-43","title":"Team image hover out","actionItemGroups":[{"actionItems":[{"id":"a-43-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-43-n-8","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-background-image","selectorGuids":["89d61fed-031e-d4c2-d24e-bc7b0024ce1e"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-43-n-2","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".overlay","selectorGuids":["7258385c-17b5-eee3-727d-d512cda37146"]},"globalSwatchId":"","rValue":15,"bValue":38,"gValue":19,"aValue":0.05}},{"id":"a-43-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"value":0,"unit":""}},{"id":"a-43-n-4","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-43-n-5","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-43-n-6","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-43-n-7","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"value":0,"unit":""}}]}],"useFirstGroupAsInitialState":false,"createdOn":1618074191793}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function Locations({
  as: _Component = _Builtin.Link,
  textLocation = "Albuquerque, NM",
  propProperty1 = true,
  propProperty2 = true,
  statTotal = "$487K",
  statStatChange = "+18%",
  visibilityStatsVisibility = true,
}) {
  _interactions.useInteractions(_interactionsData, _styles);

  return (
    <_Component
      className={_utils.cx(_styles, "stat-bar")}
      button={false}
      block="inline"
      options={{
        href: "#",
      }}
    >
      <_Builtin.Block
        className={_utils.cx(_styles, "stat-bar-left-side")}
        tag="div"
      >
        <_Builtin.Heading tag="h3">{textLocation}</_Builtin.Heading>
        <_Builtin.Block
          className={_utils.cx(_styles, "lower-stat-bar")}
          tag="div"
        >
          {propProperty1 ? (
            <_Builtin.Block
              className={_utils.cx(_styles, "properties")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "property-quantity")}
                tag="div"
              >
                <_Builtin.Block tag="div">{"7"}</_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "property-value")}
                tag="div"
              >
                <_Builtin.Block tag="div">{"properties"}</_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
          ) : null}
          {propProperty2 ? (
            <_Builtin.Block
              className={_utils.cx(_styles, "properties")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "property-quantity")}
                tag="div"
              >
                <_Builtin.Block tag="div">{"342"}</_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "property-value")}
                tag="div"
              >
                <_Builtin.Block tag="div">{"Bookings"}</_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
          ) : null}
        </_Builtin.Block>
      </_Builtin.Block>
      {visibilityStatsVisibility ? (
        <_Builtin.Block
          className={_utils.cx(_styles, "stat-bar-right-side")}
          tag="div"
        >
          <_Builtin.Heading tag="h3">{statTotal}</_Builtin.Heading>
          <_Builtin.Block
            className={_utils.cx(_styles, "subtitle", "small")}
            tag="div"
          >
            {statStatChange}
          </_Builtin.Block>
        </_Builtin.Block>
      ) : null}
    </_Component>
  );
}
