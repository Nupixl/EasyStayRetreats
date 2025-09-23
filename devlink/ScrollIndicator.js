"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./ScrollIndicator.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-6":{"id":"e-6","name":"","animationType":"custom","eventTypeId":"PAGE_SCROLL","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-4","affectedElements":{},"duration":0}},"mediaQueries":["main","medium"],"target":{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-4-p","smoothing":94,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1617549243538}},"actionLists":{"a-4":{"id":"a-4","title":"Scroll indicator","continuousParameterGroups":[{"id":"a-4-p","type":"SCROLL_PROGRESS","parameterLabel":"Scroll","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-4-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"9b3d0861-357f-c367-a479-19a8e9fb326f"},"yValue":0,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]},{"keyframe":100,"actionItems":[{"id":"a-4-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"9b3d0861-357f-c367-a479-19a8e9fb326f"},"yValue":80,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]}]}],"createdOn":1617549246224}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function ScrollIndicator({ as: _Component = _Builtin.Block }) {
  _interactions.useInteractions(_interactionsData, _styles);

  return (
    <_Component className={_utils.cx(_styles, "scroll-indicator")} tag="div">
      <_Builtin.Block
        className={_utils.cx(_styles, "indicator-wrapper")}
        id={_utils.cx(
          _styles,
          "w-node-_9b3d0861-357f-c367-a479-19a8e9fb326e-e9fb326d"
        )}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "indicator-fill")}
          data-w-id="9b3d0861-357f-c367-a479-19a8e9fb326f"
          tag="div"
        >
          <_Builtin.Block
            className={_utils.cx(_styles, "indicator")}
            tag="div"
          />
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
