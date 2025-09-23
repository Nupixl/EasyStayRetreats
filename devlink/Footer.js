"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./Footer.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-66":{"id":"e-66","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-29","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-67"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"60737b4003881b718b7b5fa7|07f6674f-755a-15b4-fee1-fd2e155cc8b7","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"60737b4003881b718b7b5fa7|07f6674f-755a-15b4-fee1-fd2e155cc8b7","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":120,"scrollOffsetUnit":"PX","delay":null,"direction":null,"effectIn":null},"createdOn":1617998348867},"e-67":{"id":"e-67","name":"","animationType":"preset","eventTypeId":"SCROLL_OUT_OF_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-30","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-66"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"60737b4003881b718b7b5fa7|07f6674f-755a-15b4-fee1-fd2e155cc8b7","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"60737b4003881b718b7b5fa7|07f6674f-755a-15b4-fee1-fd2e155cc8b7","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":120,"scrollOffsetUnit":"PX","delay":null,"direction":null,"effectIn":null},"createdOn":1617998348867},"e-300":{"id":"e-300","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-82","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-301"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"7cee9067-9361-8978-101d-fda8afb9fa10","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"7cee9067-9361-8978-101d-fda8afb9fa10","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618763853399},"e-301":{"id":"e-301","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-83","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-300"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"7cee9067-9361-8978-101d-fda8afb9fa10","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"7cee9067-9361-8978-101d-fda8afb9fa10","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618763853408}},"actionLists":{"a-29":{"id":"a-29","title":"Grow filter bar","actionItemGroups":[{"actionItems":[{"id":"a-29-n","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{},"heightValue":140,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-29-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-29-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{},"value":0,"unit":""}},{"id":"a-29-n-5","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{},"heightValue":140,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-29-n-10","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]},{"actionItems":[{"id":"a-29-n-2","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"heightValue":140,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-29-n-8","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-29-n-4","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":600,"target":{},"value":0,"unit":""}},{"id":"a-29-n-6","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"heightValue":140,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-29-n-9","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1617989115641},"a-30":{"id":"a-30","title":"Shrink filter bar","actionItemGroups":[{"actionItems":[{"id":"a-30-n-2","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"heightValue":65,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-30-n-5","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"yValue":-65,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-30-n-4","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"heightValue":65,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-30-n-6","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"yValue":-65,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-30-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":300,"easing":"","duration":600,"target":{},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":false,"createdOn":1617989115641},"a-82":{"id":"a-82","title":"Link on hover","actionItemGroups":[{"actionItems":[{"id":"a-82-n","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"xValue":0,"yValue":0,"locked":true}},{"id":"a-82-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-82-n-2","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-82-n-4","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618763855803},"a-83":{"id":"a-83","title":"Link hover out","actionItemGroups":[{"actionItems":[{"id":"a-83-n-2","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"xValue":0,"yValue":0,"locked":true}},{"id":"a-83-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"value":0,"unit":""}}]}],"useFirstGroupAsInitialState":false,"createdOn":1618763855803}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function Footer({ as: _Component = _Builtin.Section }) {
  _interactions.useInteractions(_interactionsData, _styles);

  return (
    <_Component
      className={_utils.cx(_styles, "footer")}
      grid={{
        type: "section",
      }}
      tag="div"
    >
      <_Builtin.Block className={_utils.cx(_styles, "grid-wrapper")} tag="div">
        <_Builtin.Block
          className={_utils.cx(_styles, "horizontal-line", "left")}
          id={_utils.cx(
            _styles,
            "w-node-f6cb7662-2e8e-b732-31c0-1f9a59d49f93-59d49f91"
          )}
          tag="div"
        />
        <_Builtin.Block
          className={_utils.cx(_styles, "footer-wrapper")}
          id={_utils.cx(
            _styles,
            "w-node-_0313ac4f-0baf-452b-a290-5f7efbd43f5a-59d49f91"
          )}
          tag="div"
        >
          <_Builtin.Block
            className={_utils.cx(_styles, "footer-pages")}
            id={_utils.cx(
              _styles,
              "w-node-d8eb6401-e01b-7668-75ac-322d0c5697d4-59d49f91"
            )}
            tag="div"
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "footer-destination-text")}
              id={_utils.cx(
                _styles,
                "w-node-e5c888a2-eb10-2880-4e59-4accf7e9e8e4-59d49f91"
              )}
              tag="div"
            >
              <_Builtin.Block tag="div">{"Popular Spaces"}</_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.NotSupported _atom="DynamoWrapper" />
          </_Builtin.Block>
          <_Builtin.Block
            className={_utils.cx(_styles, "credit-text")}
            id={_utils.cx(
              _styles,
              "w-node-dfd23af6-828d-947c-849f-db9f9e2ea42e-59d49f91"
            )}
            tag="div"
          >
            {"© 2025 Easy Stay Retreats"}
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
