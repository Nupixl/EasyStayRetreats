"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./TallSectionWPhotos.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-66":{"id":"e-66","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-29","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-67"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"60737b4003881b718b7b5fa7|07f6674f-755a-15b4-fee1-fd2e155cc8b7","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"60737b4003881b718b7b5fa7|07f6674f-755a-15b4-fee1-fd2e155cc8b7","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":120,"scrollOffsetUnit":"PX","delay":null,"direction":null,"effectIn":null},"createdOn":1617998348867},"e-67":{"id":"e-67","name":"","animationType":"preset","eventTypeId":"SCROLL_OUT_OF_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-30","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-66"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"60737b4003881b718b7b5fa7|07f6674f-755a-15b4-fee1-fd2e155cc8b7","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"60737b4003881b718b7b5fa7|07f6674f-755a-15b4-fee1-fd2e155cc8b7","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":120,"scrollOffsetUnit":"PX","delay":null,"direction":null,"effectIn":null},"createdOn":1617998348867},"e-74":{"id":"e-74","name":"","animationType":"custom","eventTypeId":"SLIDER_ACTIVE","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-35","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-75"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".testimonial-slide","originalId":"648b412e0dd8223596041152|4fe04a5f-08cc-2850-4256-b5dadc246c19","appliesTo":"CLASS"},"targets":[{"selector":".testimonial-slide","originalId":"648b412e0dd8223596041152|4fe04a5f-08cc-2850-4256-b5dadc246c19","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618069940641},"e-75":{"id":"e-75","name":"","animationType":"custom","eventTypeId":"SLIDER_INACTIVE","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-36","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-74"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".testimonial-slide","originalId":"648b412e0dd8223596041152|4fe04a5f-08cc-2850-4256-b5dadc246c19","appliesTo":"CLASS"},"targets":[{"selector":".testimonial-slide","originalId":"648b412e0dd8223596041152|4fe04a5f-08cc-2850-4256-b5dadc246c19","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618069940643},"e-86":{"id":"e-86","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-42","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-87"}},"mediaQueries":["main"],"target":{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"},"targets":[{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618074188760},"e-87":{"id":"e-87","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-43","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-86"}},"mediaQueries":["main"],"target":{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"},"targets":[{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618074188764},"e-268":{"id":"e-268","name":"","animationType":"custom","eventTypeId":"SCROLLING_IN_VIEW","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-77","affectedElements":{},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"648b412e0dd822359604115f|b9b9bf85-d74c-68ee-d2a5-1fe594ca8920","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"648b412e0dd822359604115f|b9b9bf85-d74c-68ee-d2a5-1fe594ca8920","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-77-p","smoothing":94,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1618702414916},"e-273":{"id":"e-273","name":"","animationType":"preset","eventTypeId":"SCROLLING_IN_VIEW","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-77","affectedElements":{},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"0bc19820-1694-9fa1-cf24-6a353880bf4b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"0bc19820-1694-9fa1-cf24-6a353880bf4b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-77-p","smoothing":94,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1618703605494},"e-274":{"id":"e-274","name":"","animationType":"custom","eventTypeId":"SCROLLING_IN_VIEW","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-77","affectedElements":{},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"648b412e0dd822359604115c|a66dc8db-099b-560a-708f-0c74b946847f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"648b412e0dd822359604115c|a66dc8db-099b-560a-708f-0c74b946847f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-77-p","smoothing":94,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1618703909132},"e-345":{"id":"e-345","name":"","animationType":"custom","eventTypeId":"SCROLLING_IN_VIEW","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-77","affectedElements":{},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"648b412e0dd8223596041157|9d1c4b15-d541-b452-d535-fdcf19169a3b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"648b412e0dd8223596041157|9d1c4b15-d541-b452-d535-fdcf19169a3b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-77-p","smoothing":96,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1618802192195},"e-349":{"id":"e-349","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-42","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-350"}},"mediaQueries":["main"],"target":{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"},"targets":[{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618855282427},"e-350":{"id":"e-350","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-43","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-349"}},"mediaQueries":["main"],"target":{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"},"targets":[{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618855282440},"e-447":{"id":"e-447","name":"","animationType":"preset","eventTypeId":"SCROLLING_IN_VIEW","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-77","affectedElements":{},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"6d99f2ed-c7ff-eb5b-a737-4026769ec3be","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"6d99f2ed-c7ff-eb5b-a737-4026769ec3be","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-77-p","smoothing":94,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1757359068422},"e-472":{"id":"e-472","name":"","animationType":"preset","eventTypeId":"MOUSE_MOVE","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-13","affectedElements":{},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"04880b5b-06d4-9547-6292-64eadbc07aab","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"04880b5b-06d4-9547-6292-64eadbc07aab","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-13-p","selectedAxis":"X_AXIS","basedOn":"ELEMENT","reverse":false,"smoothing":98,"restingState":50},{"continuousParameterGroupId":"a-13-p-2","selectedAxis":"Y_AXIS","basedOn":"ELEMENT","reverse":false,"smoothing":98,"restingState":50}],"createdOn":1757446092019},"e-473":{"id":"e-473","name":"","animationType":"preset","eventTypeId":"SCROLLING_IN_VIEW","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-77","affectedElements":{},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"04880b5b-06d4-9547-6292-64eadbc07ab7","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"04880b5b-06d4-9547-6292-64eadbc07ab7","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-77-p","smoothing":96,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1757446092019}},"actionLists":{"a-29":{"id":"a-29","title":"Grow filter bar","actionItemGroups":[{"actionItems":[{"id":"a-29-n","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{},"heightValue":140,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-29-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-29-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{},"value":0,"unit":""}},{"id":"a-29-n-5","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{},"heightValue":140,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-29-n-10","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]},{"actionItems":[{"id":"a-29-n-2","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"heightValue":140,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-29-n-8","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-29-n-4","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":600,"target":{},"value":0,"unit":""}},{"id":"a-29-n-6","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"heightValue":140,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-29-n-9","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1617989115641},"a-30":{"id":"a-30","title":"Shrink filter bar","actionItemGroups":[{"actionItems":[{"id":"a-30-n-2","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"heightValue":65,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-30-n-5","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"yValue":-65,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-30-n-4","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"heightValue":65,"widthUnit":"AUTO","heightUnit":"px","locked":false}},{"id":"a-30-n-6","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutExpo","duration":1600,"target":{},"yValue":-65,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-30-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":300,"easing":"","duration":600,"target":{},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":false,"createdOn":1617989115641},"a-35":{"id":"a-35","title":"Testimonial slider in view","actionItemGroups":[{"actionItems":[{"id":"a-35-n","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".tracker-item.in-slider","selectorGuids":["726ab28e-d960-0a48-8562-e0dc86f713a6","d9194172-24fa-d3b2-c50e-374d41b650e5"]},"value":0,"unit":""}},{"id":"a-35-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"value":0,"unit":""}},{"id":"a-35-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-35-n-3","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-35-n-9","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"value":0,"unit":""}},{"id":"a-35-n-11","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-35-n-10","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]},{"actionItems":[{"id":"a-35-n-6","actionTypeId":"STYLE_OPACITY","config":{"delay":700,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"value":1,"unit":""}},{"id":"a-35-n-8","actionTypeId":"TRANSFORM_SCALE","config":{"delay":700,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-35-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":700,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-35-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":700,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".tracker-item.in-slider","selectorGuids":["726ab28e-d960-0a48-8562-e0dc86f713a6","d9194172-24fa-d3b2-c50e-374d41b650e5"]},"value":1,"unit":""}},{"id":"a-35-n-14","actionTypeId":"TRANSFORM_MOVE","config":{"delay":900,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-35-n-12","actionTypeId":"STYLE_OPACITY","config":{"delay":900,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"value":1,"unit":""}},{"id":"a-35-n-13","actionTypeId":"TRANSFORM_SCALE","config":{"delay":900,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"xValue":1,"yValue":1,"locked":true}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618069943188},"a-36":{"id":"a-36","title":"Testimonial slider out view","actionItemGroups":[{"actionItems":[{"id":"a-36-n","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".tracker-item.in-slider","selectorGuids":["726ab28e-d960-0a48-8562-e0dc86f713a6","d9194172-24fa-d3b2-c50e-374d41b650e5"]},"value":0,"unit":""}},{"id":"a-36-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"value":0,"unit":""}},{"id":"a-36-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-36-n-4","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".body-display.large.white","selectorGuids":["5f89b001-4b9a-fd43-0d9d-7a33933d0ef2","2aab1673-518a-4ec5-d8bc-2f10469c2033","794daf6c-8b1e-121e-23e5-03f937d4f6c7"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-36-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":200,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"value":0,"unit":""}},{"id":"a-36-n-6","actionTypeId":"TRANSFORM_SCALE","config":{"delay":200,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-36-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":200,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".testimonial-client","selectorGuids":["cc8241df-bf91-608c-3956-0ca2d1f02fe7"]},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":false,"createdOn":1618069943188},"a-42":{"id":"a-42","title":"Team image hover","actionItemGroups":[{"actionItems":[{"id":"a-42-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-15","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-background-image","selectorGuids":["89d61fed-031e-d4c2-d24e-bc7b0024ce1e"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-42-n-13","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".overlay","selectorGuids":["7258385c-17b5-eee3-727d-d512cda37146"]},"globalSwatchId":"","rValue":15,"bValue":38,"gValue":19,"aValue":0.05}},{"id":"a-42-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"value":0,"unit":""}},{"id":"a-42-n-2","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-42-n-10","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-12","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-42-n-11","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-42-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-16","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-background-image","selectorGuids":["89d61fed-031e-d4c2-d24e-bc7b0024ce1e"]},"xValue":1.03,"yValue":1.03,"locked":true}},{"id":"a-42-n-14","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".overlay","selectorGuids":["7258385c-17b5-eee3-727d-d512cda37146"]},"globalSwatchId":"","rValue":15,"bValue":38,"gValue":19,"aValue":0.55}},{"id":"a-42-n-9","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"value":1,"unit":""}},{"id":"a-42-n-8","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-42-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":200,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-6","actionTypeId":"TRANSFORM_SCALE","config":{"delay":200,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-42-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":200,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618074191793},"a-43":{"id":"a-43","title":"Team image hover out","actionItemGroups":[{"actionItems":[{"id":"a-43-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-43-n-8","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-background-image","selectorGuids":["89d61fed-031e-d4c2-d24e-bc7b0024ce1e"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-43-n-2","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".overlay","selectorGuids":["7258385c-17b5-eee3-727d-d512cda37146"]},"globalSwatchId":"","rValue":15,"bValue":38,"gValue":19,"aValue":0.05}},{"id":"a-43-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"value":0,"unit":""}},{"id":"a-43-n-4","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-43-n-5","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-43-n-6","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-43-n-7","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"value":0,"unit":""}}]}],"useFirstGroupAsInitialState":false,"createdOn":1618074191793},"a-77":{"id":"a-77","title":"Paralax background","continuousParameterGroups":[{"id":"a-77-p","type":"SCROLL_PROGRESS","parameterLabel":"Scroll","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-77-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".paralax-background","selectorGuids":["4449853b-3fc3-4ff1-4b0f-91f43d28c38a"]},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-77-n-3","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".paralax-background","selectorGuids":["4449853b-3fc3-4ff1-4b0f-91f43d28c38a"]},"xValue":1.05,"yValue":1.05,"locked":true}}]},{"keyframe":100,"actionItems":[{"id":"a-77-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".paralax-background","selectorGuids":["4449853b-3fc3-4ff1-4b0f-91f43d28c38a"]},"yValue":-24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-77-n-4","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".paralax-background","selectorGuids":["4449853b-3fc3-4ff1-4b0f-91f43d28c38a"]},"xValue":1,"yValue":1,"locked":true}}]}]}],"createdOn":1618700239291},"a-13":{"id":"a-13","title":"Mouse over about images","continuousParameterGroups":[{"id":"a-13-p","type":"MOUSE_X","parameterLabel":"Mouse X","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-13-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".about-image-item","selectorGuids":["46f6ebd2-32bf-75f1-f397-018ae89e3e73"]},"xValue":0,"xUnit":"vw","yUnit":"PX","zUnit":"PX"}}]},{"keyframe":100,"actionItems":[{"id":"a-13-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".about-image-item","selectorGuids":["46f6ebd2-32bf-75f1-f397-018ae89e3e73"]},"xValue":-55,"xUnit":"vw","yUnit":"PX","zUnit":"PX"}}]}]},{"id":"a-13-p-2","type":"MOUSE_Y","parameterLabel":"Mouse Y","continuousActionGroups":[]}],"createdOn":1617660716166}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function TallSectionWPhotos({
  as: _Component = _Builtin.Section,
  textSubtitle = "Simple, easy & Clean",
  metaTag = "h1",
  textTitle = "Our Mission",
  textBodyText = "We’re here to raise the standard for vacation rentals. Through transparent service, reliable operations, and human-first support, Easy Stay ensures every trip and every property is cared for from start to finish.",
  visiblityBody = true,
  visiblityTitleVisibility = true,
  visiblitySubtitleVisibility = true,
  visiblityTextGroupVisibility = true,
  topLeftImageImage = "https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/609dfa12a141dd0d20976dc8_Family005.avif",
  topLeftImageAltText = "__wf_reserved_inherit",
  topCenterImageImage = "https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/68bb35df9564ce70feddb5ab_pccGXVm8XVM.avif",
  topCenterImageAltText = "__wf_reserved_inherit",
  topRightImageImage = "https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/68c0852ffee09aea73afe1c6_christie-kim-n0e793u6pUk-unsplash.avif",
  topRightImageAltText = "__wf_reserved_inherit",
  bottomLeftImageImage = "https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/68c0852f948d70949bf113c7_jurien-huggins-C5CLjjwREjo-unsplash.avif",
  bottomLeftImageAltText = "__wf_reserved_inherit",
  bottomCenterLeftImageImage = "https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/68c0852e72b62cf8e485c7de_lala-azizli-zLpUTZHN0ow-unsplash.avif",
  bottomCenterLeftImageAltText = "__wf_reserved_inherit",
  bottomCenterRightImageImage = "https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/68c0852fb1bbd90470da69de_austin-distel-QXfKHLvMDfA-unsplash.avif",
  bottomCenterRightImageAltText = "__wf_reserved_inherit",
  bottomRightImageImage = "https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/68bf635c3cbd34a328da0912_zls4-lAtyUE.avif",
  bottomRightImageAltText = "__wf_reserved_inherit",
}) {
  _interactions.useInteractions(_interactionsData, _styles);

  return (
    <_Component
      className={_utils.cx(_styles, "about-us-section")}
      grid={{
        type: "section",
      }}
      tag="div"
    >
      <_Builtin.Block
        className={_utils.cx(_styles, "grid-wrapper")}
        data-w-id="04880b5b-06d4-9547-6292-64eadbc07aab"
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "grey-cover")}
          id={_utils.cx(
            _styles,
            "w-node-_04880b5b-06d4-9547-6292-64eadbc07aac-dbc07aaa"
          )}
          tag="div"
        />
        <_Builtin.Block
          className={_utils.cx(_styles, "mission-wrapper")}
          id={_utils.cx(
            _styles,
            "w-node-_04880b5b-06d4-9547-6292-64eadbc07aad-dbc07aaa"
          )}
          tag="div"
        >
          {visiblityTextGroupVisibility ? (
            <_Builtin.Block
              className={_utils.cx(_styles, "centered-intro")}
              id={_utils.cx(
                _styles,
                "w-node-_04880b5b-06d4-9547-6292-64eadbc07aae-dbc07aaa"
              )}
              tag="div"
            >
              <_Builtin.Block tag="div">
                <_Builtin.Block
                  className={_utils.cx(_styles, "subtitle-wrapper")}
                  tag="div"
                >
                  {visiblitySubtitleVisibility ? (
                    <_Builtin.Block
                      className={_utils.cx(_styles, "subtitle")}
                      tag="div"
                    >
                      {textSubtitle}
                    </_Builtin.Block>
                  ) : null}
                </_Builtin.Block>
                {visiblityTitleVisibility ? (
                  <_Builtin.Heading tag={metaTag}>{textTitle}</_Builtin.Heading>
                ) : null}
              </_Builtin.Block>
              {visiblityBody ? (
                <_Builtin.Block
                  className={_utils.cx(_styles, "body-display", "large")}
                  tag="div"
                >
                  {textBodyText}
                </_Builtin.Block>
              ) : null}
            </_Builtin.Block>
          ) : null}
          <_Builtin.Block
            className={_utils.cx(_styles, "team-images")}
            data-w-id="04880b5b-06d4-9547-6292-64eadbc07ab7"
            tag="div"
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "small-image")}
              id={_utils.cx(
                _styles,
                "w-node-_04880b5b-06d4-9547-6292-64eadbc07ab8-dbc07aaa"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "paralax-background")}
                tag="div"
              >
                <_Builtin.Image
                  className={_utils.cx(_styles, "background-image")}
                  loading="lazy"
                  width="auto"
                  height="auto"
                  src={topLeftImageImage}
                />
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "large-image")}
              id={_utils.cx(
                _styles,
                "w-node-_04880b5b-06d4-9547-6292-64eadbc07aba-dbc07aaa"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "paralax-background",
                  "about-easy-1"
                )}
                tag="div"
              >
                <_Builtin.Image
                  className={_utils.cx(_styles, "background-image")}
                  loading="lazy"
                  width="auto"
                  height="auto"
                  src={topCenterImageImage}
                />
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "small-image")}
              id={_utils.cx(
                _styles,
                "w-node-_04880b5b-06d4-9547-6292-64eadbc07abc-dbc07aaa"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "paralax-background",
                  "about-easy-7"
                )}
                tag="div"
              >
                <_Builtin.Image
                  className={_utils.cx(_styles, "background-image")}
                  loading="lazy"
                  width="auto"
                  height="auto"
                  src={topRightImageImage}
                />
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "medium-image")}
              id={_utils.cx(
                _styles,
                "w-node-_04880b5b-06d4-9547-6292-64eadbc07abe-dbc07aaa"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "paralax-background",
                  "about-easy-3"
                )}
                tag="div"
              >
                <_Builtin.Image
                  className={_utils.cx(_styles, "background-image")}
                  loading="lazy"
                  width="auto"
                  height="auto"
                  src={bottomLeftImageImage}
                />
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "large-image")}
              id={_utils.cx(
                _styles,
                "w-node-_04880b5b-06d4-9547-6292-64eadbc07ac0-dbc07aaa"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "paralax-background",
                  "about-easy-5"
                )}
                tag="div"
              >
                <_Builtin.Image
                  className={_utils.cx(_styles, "background-image")}
                  loading="lazy"
                  width="auto"
                  height="auto"
                  src={bottomCenterLeftImageImage}
                />
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "large-image")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "paralax-background")}
                tag="div"
              >
                <_Builtin.Image
                  className={_utils.cx(_styles, "background-image")}
                  loading="lazy"
                  width="auto"
                  height="auto"
                  src={bottomCenterRightImageImage}
                />
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "medium-image")}
              id={_utils.cx(
                _styles,
                "w-node-_04880b5b-06d4-9547-6292-64eadbc07ac4-dbc07aaa"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "paralax-background",
                  "about-easy-4"
                )}
                tag="div"
              >
                <_Builtin.Image
                  className={_utils.cx(_styles, "background-image")}
                  loading="lazy"
                  width="auto"
                  height="auto"
                  src={bottomRightImageImage}
                />
              </_Builtin.Block>
            </_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
