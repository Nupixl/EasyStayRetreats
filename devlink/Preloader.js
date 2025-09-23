"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./Preloader.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-234":{"id":"e-234","name":"","animationType":"custom","eventTypeId":"PAGE_START","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-71","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-235"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618611678613},"e-235":{"id":"e-235","name":"","animationType":"custom","eventTypeId":"PAGE_FINISH","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-72","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-234"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618611678622}},"actionLists":{"a-71":{"id":"a-71","title":"Page starts loading","actionItemGroups":[{"actionItems":[{"id":"a-71-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".preloader","selectorGuids":["491f62cf-9c47-607b-cf4a-11656f552393"]},"value":"flex"}},{"id":"a-71-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".preloader-indicator","selectorGuids":["b9877557-9e4b-f0c9-91ea-82ea58cbfe11"]},"value":1,"unit":""}},{"id":"a-71-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".preloader-bottom","selectorGuids":["686a51c7-42bb-b095-4723-af313271bf80"]},"yValue":0,"xUnit":"PX","yUnit":"%","zUnit":"PX"}},{"id":"a-71-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".preloader-top","selectorGuids":["3df020c6-cf82-70d9-d2d4-58965c551f05"]},"yValue":0,"xUnit":"PX","yUnit":"%","zUnit":"PX"}},{"id":"a-71-n-2","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".prloader-fill","selectorGuids":["5e2354e8-242c-7cba-1a9b-989f48be2563"]},"widthValue":0,"widthUnit":"%","heightUnit":"PX","locked":false}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618611685944},"a-72":{"id":"a-72","title":"Page finished loading","actionItemGroups":[{"actionItems":[{"id":"a-72-n","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"outQuad","duration":600,"target":{"selector":".prloader-fill","selectorGuids":["5e2354e8-242c-7cba-1a9b-989f48be2563"]},"widthValue":100,"widthUnit":"%","heightUnit":"PX","locked":false}},{"id":"a-72-n-6","actionTypeId":"STYLE_OPACITY","config":{"delay":500,"easing":"","duration":200,"target":{"selector":".preloader-indicator","selectorGuids":["b9877557-9e4b-f0c9-91ea-82ea58cbfe11"]},"value":0,"unit":""}},{"id":"a-72-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":600,"easing":"inOutExpo","duration":1300,"target":{"selector":".preloader-top","selectorGuids":["3df020c6-cf82-70d9-d2d4-58965c551f05"]},"yValue":-100,"xUnit":"PX","yUnit":"%","zUnit":"PX"}},{"id":"a-72-n-5","actionTypeId":"TRANSFORM_MOVE","config":{"delay":600,"easing":"inOutExpo","duration":1600,"target":{"selector":".preloader-bottom","selectorGuids":["686a51c7-42bb-b095-4723-af313271bf80"]},"yValue":100,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]},{"actionItems":[{"id":"a-72-n-3","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".preloader","selectorGuids":["491f62cf-9c47-607b-cf4a-11656f552393"]},"value":"none"}}]}],"useFirstGroupAsInitialState":false,"createdOn":1618611725927}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function Preloader({ as: _Component = _Builtin.Block }) {
  _interactions.useInteractions(_interactionsData, _styles);
  return (
    <_Component className={_utils.cx(_styles, "preloader")} tag="div">
      <_Builtin.Block
        className={_utils.cx(_styles, "preloader-indicator")}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "prloader-fill")}
          tag="div"
        />
      </_Builtin.Block>
      <_Builtin.Block
        className={_utils.cx(_styles, "preloader-top")}
        tag="div"
      />
      <_Builtin.Block
        className={_utils.cx(_styles, "preloader-bottom")}
        tag="div"
      />
    </_Component>
  );
}
