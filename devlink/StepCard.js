"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./StepCard.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-74":{"id":"e-74","name":"","animationType":"custom","eventTypeId":"SLIDER_ACTIVE","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-35","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-75"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".testimonial-slide","originalId":"648b412e0dd8223596041152|4fe04a5f-08cc-2850-4256-b5dadc246c19","appliesTo":"CLASS"},"targets":[{"selector":".testimonial-slide","originalId":"648b412e0dd8223596041152|4fe04a5f-08cc-2850-4256-b5dadc246c19","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618069940641},"e-75":{"id":"e-75","name":"","animationType":"custom","eventTypeId":"SLIDER_INACTIVE","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-36","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-74"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".testimonial-slide","originalId":"648b412e0dd8223596041152|4fe04a5f-08cc-2850-4256-b5dadc246c19","appliesTo":"CLASS"},"targets":[{"selector":".testimonial-slide","originalId":"648b412e0dd8223596041152|4fe04a5f-08cc-2850-4256-b5dadc246c19","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618069940643},"e-120":{"id":"e-120","name":"","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-58","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-121"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".steps-card","originalId":"d46c5676-0d62-5e2e-a140-d1833fa239fd","appliesTo":"CLASS"},"targets":[{"selector":".steps-card","originalId":"d46c5676-0d62-5e2e-a140-d1833fa239fd","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":20,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1618265538154}},"actionLists":{"a-35":{"id":"a-35","title":"Testimonial slider in view","actionItemGroups":[{"actionItems":[{"id":"a-35-n","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".tracker-item.in-slider","selectorGuids":["726ab28e-d960-0a48-8562-e0dc86f713a6","d9194172-24fa-d3b2-c50e-374d41b650e5"]},"value":0,"unit":""}},{"id":"a-35-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"value":0,"unit":""}},{"id":"a-35-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-35-n-3","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-35-n-9","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"value":0,"unit":""}},{"id":"a-35-n-11","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-35-n-10","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]},{"actionItems":[{"id":"a-35-n-6","actionTypeId":"STYLE_OPACITY","config":{"delay":700,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"value":1,"unit":""}},{"id":"a-35-n-8","actionTypeId":"TRANSFORM_SCALE","config":{"delay":700,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-35-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":700,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-35-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":700,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".tracker-item.in-slider","selectorGuids":["726ab28e-d960-0a48-8562-e0dc86f713a6","d9194172-24fa-d3b2-c50e-374d41b650e5"]},"value":1,"unit":""}},{"id":"a-35-n-14","actionTypeId":"TRANSFORM_MOVE","config":{"delay":900,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-35-n-12","actionTypeId":"STYLE_OPACITY","config":{"delay":900,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"value":1,"unit":""}},{"id":"a-35-n-13","actionTypeId":"TRANSFORM_SCALE","config":{"delay":900,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"xValue":1,"yValue":1,"locked":true}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618069943188},"a-36":{"id":"a-36","title":"Testimonial slider out view","actionItemGroups":[{"actionItems":[{"id":"a-36-n","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".tracker-item.in-slider","selectorGuids":["726ab28e-d960-0a48-8562-e0dc86f713a6","d9194172-24fa-d3b2-c50e-374d41b650e5"]},"value":0,"unit":""}},{"id":"a-36-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"value":0,"unit":""}},{"id":"a-36-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-36-n-4","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-36-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":200,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"value":0,"unit":""}},{"id":"a-36-n-6","actionTypeId":"TRANSFORM_SCALE","config":{"delay":200,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-36-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":200,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":false,"createdOn":1618069943188},"a-58":{"id":"a-58","title":"How to card into view","actionItemGroups":[{"actionItems":[{"id":"a-58-n","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".steps-circle-outline","selectorGuids":["fc329966-4643-7f59-e89f-6535e1b641cf"]},"xValue":0,"yValue":0,"locked":true}},{"id":"a-58-n-7","actionTypeId":"TRANSFORM_SKEW","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".steps-card","selectorGuids":["59763060-4dd0-244a-64f1-1272caa31a88"]},"yValue":5,"xUnit":"DEG","yUnit":"deg","zUnit":"DEG"}},{"id":"a-58-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".steps-card","selectorGuids":["59763060-4dd0-244a-64f1-1272caa31a88"]},"value":0,"unit":""}},{"id":"a-58-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".steps-card","selectorGuids":["59763060-4dd0-244a-64f1-1272caa31a88"]},"yValue":40,"xUnit":"px","yUnit":"%","zUnit":"PX"}}]},{"actionItems":[{"id":"a-58-n-2","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{"useEventTarget":"CHILDREN","selector":".steps-circle-outline","selectorGuids":["fc329966-4643-7f59-e89f-6535e1b641cf"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-58-n-6","actionTypeId":"STYLE_OPACITY","config":{"delay":200,"easing":"outQuad","duration":900,"target":{"useEventTarget":"CHILDREN","selector":".steps-card","selectorGuids":["59763060-4dd0-244a-64f1-1272caa31a88"]},"value":1,"unit":""}},{"id":"a-58-n-8","actionTypeId":"TRANSFORM_SKEW","config":{"delay":200,"easing":"outQuad","duration":900,"target":{"useEventTarget":"CHILDREN","selector":".steps-card","selectorGuids":["59763060-4dd0-244a-64f1-1272caa31a88"]},"yValue":0,"xUnit":"DEG","yUnit":"deg","zUnit":"DEG"}},{"id":"a-58-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":200,"easing":"outQuad","duration":900,"target":{"useEventTarget":"CHILDREN","selector":".steps-card","selectorGuids":["59763060-4dd0-244a-64f1-1272caa31a88"]},"yValue":0,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618264224960}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function StepCard({
  as: _Component = _Builtin.Block,
  stepNumber = "1",
  stepDescription = "We evaluate your property’s potential with a personalized consultation, revenue forecast, and compliance check tailored to your market.",
  title = "Step 1: Free Assessment",
  titleTag = "h3",
  variant = "Base",
  visibilityIcon = true,
  iconImage = "https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/609dfa12a141ddc6fb976daa_Guideyes.svg",
}) {
  _interactions.useInteractions(_interactionsData, _styles);

  const _styleVariantMap = {
    Base: "",
    Icon: "w-variant-5b6f227c-eea1-2567-c302-03186e5adcaf",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <_Component
      className={_utils.cx(_styles, "steps-card", _activeStyleVariant)}
      tag="div"
    >
      <_Builtin.Block
        className={_utils.cx(
          _styles,
          "steps-circle",
          "component",
          _activeStyleVariant
        )}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "steps-dot", _activeStyleVariant)}
          tag="div"
        />
        <_Builtin.Block
          className={_utils.cx(_styles, "card-arrow", _activeStyleVariant)}
          tag="div"
        />
        <_Builtin.Block
          className={_utils.cx(
            _styles,
            "steps-circle-outline",
            _activeStyleVariant
          )}
          tag="div"
        />
      </_Builtin.Block>
      <_Builtin.Block
        className={_utils.cx(_styles, "steps-content", _activeStyleVariant)}
        id={_utils.cx(
          _styles,
          "w-node-d46c5676-0d62-5e2e-a140-d1833fa23a02-3fa239fd"
        )}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "steps-icon", _activeStyleVariant)}
          id={_utils.cx(
            _styles,
            "w-node-d46c5676-0d62-5e2e-a140-d1833fa23a03-3fa239fd"
          )}
          tag="div"
        >
          <_Builtin.Block
            className={_utils.cx(_styles, "text-block", _activeStyleVariant)}
            tag="div"
          >
            {stepNumber}
          </_Builtin.Block>
          {visibilityIcon ? (
            <_Builtin.Block
              className={_utils.cx(
                _styles,
                "benefit-icon",
                "component",
                _activeStyleVariant
              )}
              id={_utils.cx(
                _styles,
                "w-node-_598a30e7-24a0-e77f-96da-e9b28c44d513-3fa239fd"
              )}
              tag="div"
            >
              <_Builtin.Image
                loading="lazy"
                width="auto"
                height="auto"
                alt=""
                src={iconImage}
              />
            </_Builtin.Block>
          ) : null}
        </_Builtin.Block>
        <_Builtin.Block
          className={_utils.cx(
            _styles,
            "steps-description",
            _activeStyleVariant
          )}
          id={_utils.cx(
            _styles,
            "w-node-d46c5676-0d62-5e2e-a140-d1833fa23a06-3fa239fd"
          )}
          tag="div"
        >
          <_Builtin.Heading tag="h3">{title}</_Builtin.Heading>
          <_Builtin.Block
            className={_utils.cx(_styles, "body-display", _activeStyleVariant)}
            tag="div"
          >
            {stepDescription}
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
