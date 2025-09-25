"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./MobileNav.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-423":{"id":"e-423","name":"","animationType":"custom","eventTypeId":"PAGE_SCROLL","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-106","affectedElements":{},"duration":0}},"mediaQueries":["tiny"],"target":{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-106-p","smoothing":50,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1757274012603}},"actionLists":{"a-106":{"id":"a-106","title":"Mobile Nav","continuousParameterGroups":[{"id":"a-106-p","type":"SCROLL_PROGRESS","parameterLabel":"Scroll","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-106-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inCubic","duration":500,"target":{"selector":".mobile-nav","selectorGuids":["ed7d2622-2493-17c6-b838-6b0b88be5fcb"]},"yValue":5,"xUnit":"PX","yUnit":"rem","zUnit":"PX"}}]},{"keyframe":3,"actionItems":[{"id":"a-106-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inCubic","duration":500,"target":{"selector":".mobile-nav","selectorGuids":["ed7d2622-2493-17c6-b838-6b0b88be5fcb"]},"yValue":0,"xUnit":"PX","yUnit":"rem","zUnit":"PX"}}]}]}],"createdOn":1757273840827}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function MobileNav({
  as: _Component = _Builtin.Block,
  leftButtonLeftButtonText = "How It Works",
  leftButtonOnClick = {},
  leftButtonId,

  leftButtonLink = {
    href: "/property-owners/management-services",
  },

  rightButtonRightButtonText = "Get Started",

  rightButtonLink = {
    href: "/contact",
  },

  rightButtonOnClick = {},
  rightButtonId,
  leftButtonVisibility = true,
}) {
  _interactions.useInteractions(_interactionsData, _styles);

  return (
    <_Component className={_utils.cx(_styles, "mobile-nav")} tag="div">
      {leftButtonVisibility ? (
        <_Builtin.Link
          className={_utils.cx(_styles, "mobile-button", "secondary")}
          button={true}
          id={leftButtonId}
          block=""
          options={leftButtonLink}
          {...leftButtonOnClick}
        >
          {leftButtonLeftButtonText}
        </_Builtin.Link>
      ) : null}
      <_Builtin.Link
        className={_utils.cx(_styles, "mobile-button")}
        button={true}
        id={rightButtonId}
        block=""
        options={rightButtonLink}
        {...rightButtonOnClick}
      >
        {rightButtonRightButtonText}
      </_Builtin.Link>
    </_Component>
  );
}
