"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./NavBar.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-18":{"id":"e-18","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-11","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-469"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".location-card","originalId":"648b412e0dd8223596041152|32704d74-edc0-e726-207e-833cab51d0c4","appliesTo":"CLASS"},"targets":[{"selector":".location-card","originalId":"648b412e0dd8223596041152|32704d74-edc0-e726-207e-833cab51d0c4","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1617578047411},"e-19":{"id":"e-19","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-12","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-18"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".location-card","originalId":"648b412e0dd8223596041152|32704d74-edc0-e726-207e-833cab51d0c4","appliesTo":"CLASS"},"targets":[{"selector":".location-card","originalId":"648b412e0dd8223596041152|32704d74-edc0-e726-207e-833cab51d0c4","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1617578047412},"e-21":{"id":"e-21","name":"","animationType":"custom","eventTypeId":"PAGE_SCROLL","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-45","affectedElements":{},"duration":0}},"mediaQueries":["main"],"target":{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-45-p","smoothing":89,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1617722104293},"e-86":{"id":"e-86","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-42","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-87"}},"mediaQueries":["main"],"target":{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"},"targets":[{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618074188760},"e-87":{"id":"e-87","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-43","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-86"}},"mediaQueries":["main"],"target":{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"},"targets":[{"selector":".about-image-item","originalId":"648b412e0dd8223596041152|5bd0a237-652b-7efd-0a91-da4f5c72adb5","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618074188764},"e-134":{"id":"e-134","name":"","animationType":"custom","eventTypeId":"PAGE_SCROLL","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-18","affectedElements":{},"duration":0}},"mediaQueries":["main"],"target":{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"wf-page-id","appliesTo":"PAGE","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-18-p","smoothing":89,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1618340046334},"e-300":{"id":"e-300","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-82","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-301"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"7cee9067-9361-8978-101d-fda8afb9fa10","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"7cee9067-9361-8978-101d-fda8afb9fa10","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618763853399},"e-301":{"id":"e-301","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-83","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-300"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"7cee9067-9361-8978-101d-fda8afb9fa10","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"7cee9067-9361-8978-101d-fda8afb9fa10","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618763853408},"e-349":{"id":"e-349","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-42","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-350"}},"mediaQueries":["main"],"target":{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"},"targets":[{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618855282427},"e-350":{"id":"e-350","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-43","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-349"}},"mediaQueries":["main"],"target":{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"},"targets":[{"selector":".lightbox","originalId":"648b412e0dd8223596041163|b072fdbb-25d2-8513-951a-3b4416bb7bca","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618855282440},"e-377":{"id":"e-377","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-11","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-378"}},"mediaQueries":["main"],"target":{"selector":".quick-link-item","originalId":"648b412e0dd8223596041170|1b5ecb6d-916e-b78b-2356-5d611a68c6ae","appliesTo":"CLASS"},"targets":[{"selector":".quick-link-item","originalId":"648b412e0dd8223596041170|1b5ecb6d-916e-b78b-2356-5d611a68c6ae","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618860504323},"e-378":{"id":"e-378","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-12","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-377"}},"mediaQueries":["main"],"target":{"selector":".quick-link-item","originalId":"648b412e0dd8223596041170|1b5ecb6d-916e-b78b-2356-5d611a68c6ae","appliesTo":"CLASS"},"targets":[{"selector":".quick-link-item","originalId":"648b412e0dd8223596041170|1b5ecb6d-916e-b78b-2356-5d611a68c6ae","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618860504333},"e-386":{"id":"e-386","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-94","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-387"}},"mediaQueries":["main"],"target":{"selector":".flyout-menu.open","originalId":"69b0d3f6-d0cc-2db5-ee2d-841bd3468615","appliesTo":"CLASS"},"targets":[{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468615","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618869484492},"e-388":{"id":"e-388","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-95","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-389"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"6252b416-c3c5-73fa-7b6c-666bfb79e89e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"6252b416-c3c5-73fa-7b6c-666bfb79e89e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618869772871},"e-405":{"id":"e-405","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-95","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-406"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"88b0f067-982b-0642-fc5d-73df7d5b3c68","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"88b0f067-982b-0642-fc5d-73df7d5b3c68","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1618886559487},"e-481":{"id":"e-481","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-114","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-482"}},"mediaQueries":["main","medium","small","tiny"],"target":{"appliesTo":"ELEMENT","styleBlockIds":[],"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468615"},"targets":[],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1758822906846},"e-483":{"id":"e-483","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-115","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-484"}},"mediaQueries":["main"],"target":{"appliesTo":"ELEMENT","styleBlockIds":[],"id":"88b0f067-982b-0642-fc5d-73df7d5b3c68"},"targets":[],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1758825369711},"e-485":{"id":"e-485","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-115","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-486"}},"mediaQueries":["main","medium","small","tiny"],"target":{"appliesTo":"ELEMENT","styleBlockIds":[],"id":"6252b416-c3c5-73fa-7b6c-666bfb79e89e"},"targets":[],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1758825425900}},"actionLists":{"a-11":{"id":"a-11","title":"Client card on hover","actionItemGroups":[{"actionItems":[{"id":"a-11-n","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".location-card-background","selectorGuids":["ea98df69-26e1-ddeb-6004-952bf00c652d"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-11-n-14","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".card-arrow-icon","selectorGuids":["b1a7e49a-7cf9-6125-509f-438dcf028ed8"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-11-n-11","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".card-arrow-icon","selectorGuids":["b1a7e49a-7cf9-6125-509f-438dcf028ed8"]},"value":0,"unit":""}},{"id":"a-11-n-9","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".card-arrow-icon","selectorGuids":["b1a7e49a-7cf9-6125-509f-438dcf028ed8"]},"xValue":-12,"xUnit":"px","yUnit":"PX","zUnit":"PX"}},{"id":"a-11-n-4","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".location-card","selectorGuids":["045e0266-4c76-26e3-d96d-1a450732fd82"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-11-n-3","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".location-name","selectorGuids":["bddb573d-7d19-a359-b3e4-2cbfd480e3f2"]},"globalSwatchId":"654be6b4","rValue":8,"bValue":58,"gValue":28,"aValue":1}},{"id":"a-11-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".location-card-background","selectorGuids":["ea98df69-26e1-ddeb-6004-952bf00c652d"]},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-11-n-5","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":400,"target":{"useEventTarget":"CHILDREN","selector":".location-card-background","selectorGuids":["ea98df69-26e1-ddeb-6004-952bf00c652d"]},"xValue":1.2,"yValue":1.2,"locked":true}},{"id":"a-11-n-8","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":400,"target":{"useEventTarget":"CHILDREN","selector":".location-card-background","selectorGuids":["ea98df69-26e1-ddeb-6004-952bf00c652d"]},"value":1,"unit":""}},{"id":"a-11-n-7","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"outQuad","duration":400,"target":{"useEventTarget":"CHILDREN","selector":".location-name","selectorGuids":["bddb573d-7d19-a359-b3e4-2cbfd480e3f2"]},"globalSwatchId":"","rValue":255,"bValue":255,"gValue":255,"aValue":1}},{"id":"a-11-n-6","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":600,"target":{"useEventTarget":"CHILDREN","selector":".location-card","selectorGuids":["045e0266-4c76-26e3-d96d-1a450732fd82"]},"xValue":1.07,"yValue":1.07,"locked":true}},{"id":"a-11-n-13","actionTypeId":"TRANSFORM_SCALE","config":{"delay":300,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".card-arrow-icon","selectorGuids":["b1a7e49a-7cf9-6125-509f-438dcf028ed8"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-11-n-12","actionTypeId":"STYLE_OPACITY","config":{"delay":300,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".card-arrow-icon","selectorGuids":["b1a7e49a-7cf9-6125-509f-438dcf028ed8"]},"value":1,"unit":""}},{"id":"a-11-n-10","actionTypeId":"TRANSFORM_MOVE","config":{"delay":300,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".card-arrow-icon","selectorGuids":["b1a7e49a-7cf9-6125-509f-438dcf028ed8"]},"xValue":0,"xUnit":"px","yUnit":"PX","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1617578054558},"a-12":{"id":"a-12","title":"Client card hover out","actionItemGroups":[{"actionItems":[{"id":"a-12-n","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".location-card-background","selectorGuids":["ea98df69-26e1-ddeb-6004-952bf00c652d"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-12-n-2","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".card-arrow-icon","selectorGuids":["b1a7e49a-7cf9-6125-509f-438dcf028ed8"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-12-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".card-arrow-icon","selectorGuids":["b1a7e49a-7cf9-6125-509f-438dcf028ed8"]},"value":0,"unit":""}},{"id":"a-12-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".card-arrow-icon","selectorGuids":["b1a7e49a-7cf9-6125-509f-438dcf028ed8"]},"xValue":-12,"xUnit":"px","yUnit":"PX","zUnit":"PX"}},{"id":"a-12-n-5","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".location-card","selectorGuids":["045e0266-4c76-26e3-d96d-1a450732fd82"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-12-n-6","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".location-name","selectorGuids":["bddb573d-7d19-a359-b3e4-2cbfd480e3f2"]},"globalSwatchId":"654be6b4","rValue":8,"bValue":58,"gValue":28,"aValue":1}},{"id":"a-12-n-7","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".location-card-background","selectorGuids":["ea98df69-26e1-ddeb-6004-952bf00c652d"]},"value":0,"unit":""}}]}],"useFirstGroupAsInitialState":false,"createdOn":1617578054558},"a-45":{"id":"a-45","title":"Nav bar scrolling | Left Background image","continuousParameterGroups":[{"id":"a-45-p","type":"SCROLL_PROGRESS","parameterLabel":"Scroll","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-45-n-2","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".brand","selectorGuids":["3f1d8937-6f7a-f320-faa8-75a34d6c03fb"]},"globalSwatchId":"","rValue":255,"bValue":255,"gValue":255,"aValue":1}},{"id":"a-45-n-4","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".nav-menu","selectorGuids":["f50e9a03-4c88-bb85-969c-6d8f701710e9"]},"heightValue":0,"widthUnit":"PX","heightUnit":"%","locked":false}},{"id":"a-45-n-6","actionTypeId":"STYLE_BORDER","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".left-nav","selectorGuids":["c1eb89ae-eae8-5a67-ba30-1eccab34f54c"]},"globalSwatchId":"","rValue":239,"bValue":247,"gValue":239,"aValue":0}},{"id":"a-45-n-15","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".location-slider-top","selectorGuids":["79f5487c-05d5-2e43-3646-e4487e20c11d"]},"heightValue":0,"widthUnit":"PX","heightUnit":"px","locked":false}},{"id":"a-45-n-17","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".navigation-shade","selectorGuids":["7a5a42e2-ae08-a559-8dd5-91a8b619006b"]},"yValue":-100,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]},{"keyframe":3,"actionItems":[{"id":"a-45-n-7","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".nav-menu","selectorGuids":["f50e9a03-4c88-bb85-969c-6d8f701710e9"]},"heightValue":100,"widthUnit":"PX","heightUnit":"%","locked":false}},{"id":"a-45-n-8","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".nav-menu","selectorGuids":["f50e9a03-4c88-bb85-969c-6d8f701710e9"]},"value":0,"unit":""}},{"id":"a-45-n-3","actionTypeId":"STYLE_BORDER","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".navigation-shade","selectorGuids":["7a5a42e2-ae08-a559-8dd5-91a8b619006b"]},"globalSwatchId":"","rValue":239,"bValue":247,"gValue":239,"aValue":0}}]},{"keyframe":6,"actionItems":[{"id":"a-45-n-10","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".brand","selectorGuids":["3f1d8937-6f7a-f320-faa8-75a34d6c03fb"]},"globalSwatchId":"654be6b4","rValue":8,"bValue":58,"gValue":28,"aValue":1}},{"id":"a-45-n-12","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".nav-menu","selectorGuids":["f50e9a03-4c88-bb85-969c-6d8f701710e9"]},"value":1,"unit":""}},{"id":"a-45-n-14","actionTypeId":"STYLE_BORDER","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".left-nav","selectorGuids":["c1eb89ae-eae8-5a67-ba30-1eccab34f54c"]},"globalSwatchId":"59b47200","rValue":192,"bValue":211,"gValue":192,"aValue":0.2}},{"id":"a-45-n-16","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".location-slider-top","selectorGuids":["79f5487c-05d5-2e43-3646-e4487e20c11d"]},"heightValue":65,"widthUnit":"PX","heightUnit":"px","locked":false}},{"id":"a-45-n-18","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".navigation-shade","selectorGuids":["7a5a42e2-ae08-a559-8dd5-91a8b619006b"]},"yValue":0,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]},{"keyframe":7,"actionItems":[{"id":"a-45-n-11","actionTypeId":"STYLE_BORDER","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".navigation-shade","selectorGuids":["7a5a42e2-ae08-a559-8dd5-91a8b619006b"]},"globalSwatchId":"59b47200","rValue":192,"bValue":211,"gValue":192,"aValue":0.2}}]}]}],"createdOn":1617548101346},"a-3":{"id":"a-3","title":"Nav bar scrolling | Background image hero","continuousParameterGroups":[{"id":"a-3-p","type":"SCROLL_PROGRESS","parameterLabel":"Scroll","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-3-n-7","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468616"},"globalSwatchId":"","rValue":255,"bValue":255,"gValue":255,"aValue":1}},{"id":"a-3-n-13","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd346861d"},"heightValue":0,"widthUnit":"PX","heightUnit":"%","locked":false}},{"id":"a-3-n-15","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"id":"2a8aa310-babc-eed2-4d86-8309be309f42"},"globalSwatchId":"","rValue":255,"bValue":255,"gValue":255,"aValue":1}},{"id":"a-3-n-17","actionTypeId":"STYLE_BORDER","config":{"delay":0,"easing":"","duration":500,"target":{"id":"2a8aa310-babc-eed2-4d86-8309be309f42"},"globalSwatchId":"","rValue":239,"bValue":247,"gValue":239,"aValue":0}},{"id":"a-3-n-19","actionTypeId":"STYLE_FILTER","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468616"},"filters":[{"type":"invert","filterId":"2c06","value":100,"unit":"%"}]}},{"id":"a-3-n-21","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"c05fe523-5a2a-b171-9eca-362095d4bf72"},"yValue":-100,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]},{"keyframe":3,"actionItems":[{"id":"a-3-n-14","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd346861d"},"heightValue":100,"widthUnit":"PX","heightUnit":"%","locked":false}},{"id":"a-3-n-11","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd346861d"},"value":0,"unit":""}},{"id":"a-3-n-9","actionTypeId":"STYLE_BORDER","config":{"delay":0,"easing":"","duration":500,"target":{"id":"c05fe523-5a2a-b171-9eca-362095d4bf72"},"globalSwatchId":"","rValue":239,"bValue":247,"gValue":239,"aValue":0}}]},{"keyframe":6,"actionItems":[{"id":"a-3-n-8","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468616"},"globalSwatchId":"654be6b4","rValue":8,"bValue":58,"gValue":28,"aValue":1}},{"id":"a-3-n-12","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd346861d"},"value":1,"unit":""}},{"id":"a-3-n-16","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"id":"2a8aa310-babc-eed2-4d86-8309be309f42"},"globalSwatchId":"654be6b4","rValue":8,"bValue":58,"gValue":28,"aValue":1}},{"id":"a-3-n-18","actionTypeId":"STYLE_BORDER","config":{"delay":0,"easing":"","duration":500,"target":{"id":"2a8aa310-babc-eed2-4d86-8309be309f42"},"globalSwatchId":"59b47200","rValue":192,"bValue":211,"gValue":192,"aValue":0.2}},{"id":"a-3-n-20","actionTypeId":"STYLE_FILTER","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468616"},"filters":[{"type":"invert","filterId":"e650","value":0,"unit":"%"}]}},{"id":"a-3-n-22","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"c05fe523-5a2a-b171-9eca-362095d4bf72"},"yValue":0,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]},{"keyframe":7,"actionItems":[{"id":"a-3-n-10","actionTypeId":"STYLE_BORDER","config":{"delay":0,"easing":"","duration":500,"target":{"id":"c05fe523-5a2a-b171-9eca-362095d4bf72"},"globalSwatchId":"59b47200","rValue":192,"bValue":211,"gValue":192,"aValue":0.2}}]}]}],"createdOn":1617548101346},"a-18":{"id":"a-18","title":"Nav bar scrolling | Shrink Nav bar","continuousParameterGroups":[{"id":"a-18-p","type":"SCROLL_PROGRESS","parameterLabel":"Scroll","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-18-n","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"199fb1dc-b4ea-99c3-f373-804a90f62445"},"heightValue":80,"widthUnit":"PX","heightUnit":"px","locked":false}},{"id":"a-18-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468629"},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-18-n-21","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468614"},"heightValue":80,"widthUnit":"PX","heightUnit":"px","locked":false}}]},{"keyframe":3,"actionItems":[{"id":"a-18-n-10","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd346862a"},"value":0,"unit":""}},{"id":"a-18-n-11","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd346862a"},"xValue":0,"yValue":0,"locked":true}}]},{"keyframe":6,"actionItems":[{"id":"a-18-n-12","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"199fb1dc-b4ea-99c3-f373-804a90f62445"},"heightValue":65,"widthUnit":"PX","heightUnit":"px","locked":false}},{"id":"a-18-n-13","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468629"},"yValue":24,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-18-n-19","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd346862a"},"value":1,"unit":""}},{"id":"a-18-n-20","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd346862a"},"xValue":1,"yValue":1,"locked":true}},{"id":"a-18-n-22","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"69b0d3f6-d0cc-2db5-ee2d-841bd3468614"},"heightValue":65,"widthUnit":"PX","heightUnit":"px","locked":false}}]}]}],"createdOn":1617548101346},"a-42":{"id":"a-42","title":"Team image hover","actionItemGroups":[{"actionItems":[{"id":"a-42-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-15","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-background-image","selectorGuids":["89d61fed-031e-d4c2-d24e-bc7b0024ce1e"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-42-n-13","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".overlay","selectorGuids":["7258385c-17b5-eee3-727d-d512cda37146"]},"globalSwatchId":"","rValue":15,"bValue":38,"gValue":19,"aValue":0.05}},{"id":"a-42-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"value":0,"unit":""}},{"id":"a-42-n-2","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-42-n-10","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-12","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-42-n-11","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-42-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-16","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-background-image","selectorGuids":["89d61fed-031e-d4c2-d24e-bc7b0024ce1e"]},"xValue":1.03,"yValue":1.03,"locked":true}},{"id":"a-42-n-14","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".overlay","selectorGuids":["7258385c-17b5-eee3-727d-d512cda37146"]},"globalSwatchId":"","rValue":15,"bValue":38,"gValue":19,"aValue":0.55}},{"id":"a-42-n-9","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"value":1,"unit":""}},{"id":"a-42-n-8","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-42-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":200,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-42-n-6","actionTypeId":"TRANSFORM_SCALE","config":{"delay":200,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-42-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":200,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618074191793},"a-43":{"id":"a-43","title":"Team image hover out","actionItemGroups":[{"actionItems":[{"id":"a-43-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-43-n-8","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-background-image","selectorGuids":["89d61fed-031e-d4c2-d24e-bc7b0024ce1e"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-43-n-2","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".overlay","selectorGuids":["7258385c-17b5-eee3-727d-d512cda37146"]},"globalSwatchId":"","rValue":15,"bValue":38,"gValue":19,"aValue":0.05}},{"id":"a-43-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"value":0,"unit":""}},{"id":"a-43-n-4","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".subtitle","selectorGuids":["bf71d704-497e-3f7b-453d-d9f686852693"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-43-n-5","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"yValue":12,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-43-n-6","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"xValue":0.8,"yValue":0.8,"locked":true}},{"id":"a-43-n-7","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".team-location-icon","selectorGuids":["744bde08-0c34-cd4b-7a9b-1f0f26292bae"]},"value":0,"unit":""}}]}],"useFirstGroupAsInitialState":false,"createdOn":1618074191793},"a-82":{"id":"a-82","title":"Link on hover","actionItemGroups":[{"actionItems":[{"id":"a-82-n","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"xValue":0,"yValue":0,"locked":true}},{"id":"a-82-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-82-n-2","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"xValue":1,"yValue":1,"locked":true}},{"id":"a-82-n-4","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618763855803},"a-83":{"id":"a-83","title":"Link hover out","actionItemGroups":[{"actionItems":[{"id":"a-83-n-2","actionTypeId":"TRANSFORM_SCALE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"xValue":0,"yValue":0,"locked":true}},{"id":"a-83-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".link-cover","selectorGuids":["b764cf6e-af48-1cf5-094e-2f50e1a83216"]},"value":0,"unit":""}}]}],"useFirstGroupAsInitialState":false,"createdOn":1618763855803},"a-94":{"id":"a-94","title":"Open flyout menu","actionItemGroups":[{"actionItems":[{"id":"a-94-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".flyout-menu-content","selectorGuids":["d638a1b1-5c59-d0c7-4254-243a7a44cf6e"]},"xValue":-100,"xUnit":"%","yUnit":"PX","zUnit":"PX"}},{"id":"a-94-n-10","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".flyout-menu.close","selectorGuids":["6df67a42-f49e-85ce-8bc6-50e6eb34fb5a","a203e4e8-8e08-5197-a140-314d5d1dd98c"]},"value":"none"}},{"id":"a-94-n-9","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".flyout-menu.open","selectorGuids":["6df67a42-f49e-85ce-8bc6-50e6eb34fb5a","03226778-37ed-81e1-c292-cf903d47d9cd"]},"value":"flex"}},{"id":"a-94-n-4","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".flyout-menu-wrapper","selectorGuids":["f7c22316-4b05-c941-1b7a-66e5a9674e2d"]},"globalSwatchId":"","rValue":10,"bValue":51,"gValue":26,"aValue":0}},{"id":"a-94-n-5","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".flyout-menu-wrapper","selectorGuids":["f7c22316-4b05-c941-1b7a-66e5a9674e2d"]},"value":"none"}}]},{"actionItems":[{"id":"a-94-n-6","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".flyout-menu-wrapper","selectorGuids":["f7c22316-4b05-c941-1b7a-66e5a9674e2d"]},"value":"flex"}}]},{"actionItems":[{"id":"a-94-n-8","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutQuint","duration":1300,"target":{"selector":".flyout-menu-content","selectorGuids":["d638a1b1-5c59-d0c7-4254-243a7a44cf6e"]},"xValue":0,"xUnit":"%","yUnit":"PX","zUnit":"PX"}},{"id":"a-94-n-3","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".flyout-menu-wrapper","selectorGuids":["f7c22316-4b05-c941-1b7a-66e5a9674e2d"]},"globalSwatchId":"","rValue":10,"bValue":51,"gValue":26,"aValue":0.55}}]}],"useFirstGroupAsInitialState":true,"createdOn":1618869487508},"a-95":{"id":"a-95","title":"Close flyout menu","actionItemGroups":[{"actionItems":[{"id":"a-95-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"inOutQuint","duration":1300,"target":{"selector":".flyout-menu-content","selectorGuids":["d638a1b1-5c59-d0c7-4254-243a7a44cf6e"]},"xValue":-100,"xUnit":"%","yUnit":"PX","zUnit":"PX"}},{"id":"a-95-n-7","actionTypeId":"PLUGIN_LOTTIE","config":{"delay":0,"easing":"","duration":1300,"target":{"selector":".menu-lottie","selectorGuids":["9d9a6409-140b-62ea-e806-4f48bb7d5eb2"]},"value":0}},{"id":"a-95-n-3","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"inOutQuint","duration":1300,"target":{"selector":".flyout-menu-wrapper","selectorGuids":["f7c22316-4b05-c941-1b7a-66e5a9674e2d"]},"globalSwatchId":"","rValue":10,"bValue":51,"gValue":26,"aValue":0}}]},{"actionItems":[{"id":"a-95-n-2","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".flyout-menu-wrapper","selectorGuids":["f7c22316-4b05-c941-1b7a-66e5a9674e2d"]},"value":"none"}},{"id":"a-95-n-6","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".flyout-menu.close","selectorGuids":["6df67a42-f49e-85ce-8bc6-50e6eb34fb5a","a203e4e8-8e08-5197-a140-314d5d1dd98c"]},"value":"none"}},{"id":"a-95-n-5","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".flyout-menu.open","selectorGuids":["6df67a42-f49e-85ce-8bc6-50e6eb34fb5a","03226778-37ed-81e1-c292-cf903d47d9cd"]},"value":"flex"}}]}],"useFirstGroupAsInitialState":false,"createdOn":1618869487508},"a-114":{"id":"a-114","title":"Burger On","actionItemGroups":[{"actionItems":[{"id":"a-114-n","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"inCubic","duration":500,"target":{"selector":".burger-wrapper","selectorGuids":["654686fb-993f-cc7d-1375-344515572476"]},"xValue":180,"yValue":180,"zValue":90,"xUnit":"deg","yUnit":"deg","zUnit":"deg"}},{"id":"a-114-n-4","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":250,"easing":"inCubic","duration":200,"target":{"id":"81f53ef2-0379-3735-4847-3ac93a9d4aa4"},"xValue":null,"yValue":null,"zValue":90,"xUnit":"deg","yUnit":"deg","zUnit":"deg"}},{"id":"a-114-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":250,"easing":"inCubic","duration":100,"target":{"selector":".burger-line.top","selectorGuids":["e3787aa7-7417-2af8-6dcd-5f328b21091c","202f9bcb-b9d2-841d-6200-a9066c66380f"]},"xValue":null,"yValue":0.85,"xUnit":"px","yUnit":"rem","zUnit":"PX"}}]}],"createdOn":1758822911419,"useFirstGroupAsInitialState":false},"a-115":{"id":"a-115","title":"Burger Off","actionItemGroups":[{"actionItems":[{"id":"a-115-n","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"inCubic","duration":500,"target":{"selector":".burger-wrapper","selectorGuids":["654686fb-993f-cc7d-1375-344515572476"]},"xValue":0,"yValue":0,"zValue":0,"xUnit":"deg","yUnit":"deg","zUnit":"deg"}},{"id":"a-115-n-2","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":250,"easing":"inCubic","duration":200,"target":{"id":"81f53ef2-0379-3735-4847-3ac93a9d4aa4"},"xValue":null,"yValue":null,"zValue":0,"xUnit":"deg","yUnit":"deg","zUnit":"deg"}},{"id":"a-115-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":250,"easing":"inCubic","duration":100,"target":{"selector":".burger-line.top","selectorGuids":["e3787aa7-7417-2af8-6dcd-5f328b21091c","202f9bcb-b9d2-841d-6200-a9066c66380f"]},"xValue":null,"yValue":0,"xUnit":"px","yUnit":"rem","zUnit":"PX"}},{"id":"a-115-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":250,"easing":"inCubic","duration":100,"target":{"id":"81f53ef2-0379-3735-4847-3ac93a9d4aa4"},"yValue":0,"xUnit":"PX","yUnit":"rem","zUnit":"PX"}}]}],"createdOn":1758822911419,"useFirstGroupAsInitialState":false}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function NavBar({
  as: _Component = _Builtin.NavbarWrapper,
  navHamburgerMenu = true,
  mainNavMenu = true,
  searchNavWrapper = false,
  buttonBtnOnclick = {},
  buttonButtonText = "Log-in",
  buttonId,

  buttonButtonLink = {
    href: "/contact",
  },
}) {
  _interactions.useInteractions(_interactionsData, _styles);

  return (
    <_Component
      className={_utils.cx(_styles, "navbar")}
      tag="div"
      data-collapse="medium"
      data-animation="default"
      data-duration="600"
      data-doc-height="1"
      config={{
        animation: "default",
        easing: "ease",
        easing2: "ease",
        duration: 600,
        collapse: "medium",
        noScroll: false,
        docHeight: true,
      }}
    >
      <_Builtin.Block
        className={_utils.cx(_styles, "top-nav-wrapper")}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "flyout-menu-wrapper")}
          id={_utils.cx(
            _styles,
            "w-node-_2ff020b0-c55c-af86-3be0-da932b15be8e-d3468612"
          )}
          tag="div"
        >
          <_Builtin.Block
            className={_utils.cx(_styles, "flyout-menu-content")}
            tag="div"
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "flyout-heading")}
              tag="div"
            >
              <_Builtin.Heading tag="h2">{"Navigation"}</_Builtin.Heading>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "scroll-flyout-wrapper")}
              tag="div"
              id="scrollbar"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "vacation-continents")}
                tag="div"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "flyout-info-box")}
                  id={_utils.cx(
                    _styles,
                    "w-node-_92abb93c-eb64-1a87-ea32-98e9c6f1d677-d3468612"
                  )}
                  tag="div"
                >
                  <_Builtin.Block
                    className={_utils.cx(_styles, "subtitle-intro-wrapper")}
                    id={_utils.cx(
                      _styles,
                      "w-node-_92abb93c-eb64-1a87-ea32-98e9c6f1d678-d3468612"
                    )}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "subtitle")}
                      tag="div"
                    >
                      {"Travel"}
                    </_Builtin.Block>
                    <_Builtin.Block
                      className={_utils.cx(_styles, "horizontal-line")}
                      id={_utils.cx(
                        _styles,
                        "w-node-_92abb93c-eb64-1a87-ea32-98e9c6f1d67b-d3468612"
                      )}
                      tag="div"
                    />
                    <_Builtin.DropdownWrapper
                      className={_utils.cx(_styles, "nav-link-dropdown")}
                      id={_utils.cx(
                        _styles,
                        "w-node-dbf19352-223d-1d02-b17c-d44a0833ad20-d3468612"
                      )}
                      tag="div"
                      delay={0}
                      hover={false}
                    >
                      <_Builtin.DropdownToggle
                        className={_utils.cx(_styles, "nav-dropdown-toggle")}
                        tag="div"
                      >
                        <_Builtin.Block
                          id={_utils.cx(
                            _styles,
                            "w-node-ffcbbd46-2dcc-c9a3-247c-e8010583e24a-d3468612"
                          )}
                          tag="div"
                        >
                          {"Our Stays"}
                        </_Builtin.Block>
                        <_Builtin.Block
                          className={_utils.cx(
                            _styles,
                            "card-arrow-icon",
                            "dark"
                          )}
                          id={_utils.cx(
                            _styles,
                            "w-node-a30f774b-92c9-bdfd-5dfc-c47359e58ea1-d3468612"
                          )}
                          tag="div"
                        >
                          <_Builtin.Image
                            className={_utils.cx(
                              _styles,
                              "vacation-card-arrow"
                            )}
                            loading="lazy"
                            width="auto"
                            height="auto"
                            alt=""
                            src="https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/609dfa12a141ddc6d8976dc0_arrowhead-right-icon-dark001.svg"
                          />
                        </_Builtin.Block>
                      </_Builtin.DropdownToggle>
                      <_Builtin.DropdownList
                        className={_utils.cx(_styles, "nav-dropdown-list")}
                        tag="nav"
                      >
                        <_Builtin.Link
                          className={_utils.cx(_styles, "nav-dropdown-link")}
                          button={false}
                          block="inline"
                          options={{
                            href: "/guest/search-properties",
                          }}
                        >
                          <_Builtin.Heading tag="h4">
                            {"Search Stays"}
                          </_Builtin.Heading>
                        </_Builtin.Link>
                        <_Builtin.NotSupported _atom="DynamoWrapper" />
                      </_Builtin.DropdownList>
                    </_Builtin.DropdownWrapper>
                  </_Builtin.Block>
                  <_Builtin.Block
                    className={_utils.cx(_styles, "subtitle-intro-wrapper")}
                    id={_utils.cx(
                      _styles,
                      "w-node-_79f06489-7e06-7f99-e512-95fb9ce71914-d3468612"
                    )}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "subtitle")}
                      tag="div"
                    >
                      {"Accounts"}
                      <br />
                      {"‍"}
                    </_Builtin.Block>
                    <_Builtin.Block
                      className={_utils.cx(_styles, "horizontal-line")}
                      id={_utils.cx(
                        _styles,
                        "w-node-_79f06489-7e06-7f99-e512-95fb9ce71917-d3468612"
                      )}
                      tag="div"
                    />
                    <_Builtin.Link
                      className={_utils.cx(_styles, "quick-link-item")}
                      id={_utils.cx(
                        _styles,
                        "w-node-c337708e-f5e7-c679-a917-6cf5873a8815-d3468612"
                      )}
                      button={false}
                      block="inline"
                      options={{
                        href: "https://calendly.com/",
                        target: "_blank",
                      }}
                    >
                      <_Builtin.Block
                        id={_utils.cx(
                          _styles,
                          "w-node-c337708e-f5e7-c679-a917-6cf5873a8816-d3468612"
                        )}
                        tag="div"
                      >
                        {"Log-in/Sign-Up"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "card-arrow-icon",
                          "dark"
                        )}
                        id={_utils.cx(
                          _styles,
                          "w-node-c337708e-f5e7-c679-a917-6cf5873a8818-d3468612"
                        )}
                        tag="div"
                      >
                        <_Builtin.Image
                          className={_utils.cx(_styles, "vacation-card-arrow")}
                          loading="lazy"
                          width="auto"
                          height="auto"
                          alt=""
                          src="https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/609dfa12a141ddc6d8976dc0_arrowhead-right-icon-dark001.svg"
                        />
                      </_Builtin.Block>
                    </_Builtin.Link>
                  </_Builtin.Block>
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(_styles, "flyout-info-box")}
                  id={_utils.cx(
                    _styles,
                    "w-node-a4181ea1-b90f-dce7-1ff2-23e3139ba538-d3468612"
                  )}
                  tag="div"
                >
                  <_Builtin.Block
                    className={_utils.cx(_styles, "subtitle-intro-wrapper")}
                    id={_utils.cx(
                      _styles,
                      "w-node-a4181ea1-b90f-dce7-1ff2-23e3139ba539-d3468612"
                    )}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "subtitle")}
                      tag="div"
                    >
                      {"Contact us"}
                    </_Builtin.Block>
                    <_Builtin.Block
                      className={_utils.cx(_styles, "horizontal-line")}
                      id={_utils.cx(
                        _styles,
                        "w-node-a4181ea1-b90f-dce7-1ff2-23e3139ba53c-d3468612"
                      )}
                      tag="div"
                    />
                  </_Builtin.Block>
                  <_Builtin.Block
                    className={_utils.cx(_styles, "quick-link-list")}
                    tag="div"
                  >
                    <_Builtin.Link
                      className={_utils.cx(_styles, "quick-link-item")}
                      button={false}
                      block="inline"
                      options={{
                        href: "/contact",
                      }}
                    >
                      <_Builtin.Block
                        id={_utils.cx(
                          _styles,
                          "w-node-_121c17b8-01e3-a1aa-a4ea-5f82f370ad3f-d3468612"
                        )}
                        tag="div"
                      >
                        {"Host Your Property"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "card-arrow-icon",
                          "dark"
                        )}
                        id={_utils.cx(
                          _styles,
                          "w-node-_121c17b8-01e3-a1aa-a4ea-5f82f370ad41-d3468612"
                        )}
                        tag="div"
                      >
                        <_Builtin.Image
                          className={_utils.cx(_styles, "vacation-card-arrow")}
                          loading="lazy"
                          width="auto"
                          height="auto"
                          alt=""
                          src="https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/609dfa12a141ddc6d8976dc0_arrowhead-right-icon-dark001.svg"
                        />
                      </_Builtin.Block>
                    </_Builtin.Link>
                    <_Builtin.Link
                      className={_utils.cx(_styles, "quick-link-item")}
                      id={_utils.cx(
                        _styles,
                        "w-node-_05569669-371a-21c1-ebc5-5114ef88dc9d-d3468612"
                      )}
                      button={false}
                      block="inline"
                      options={{
                        href: "/contact",
                      }}
                    >
                      <_Builtin.Block
                        id={_utils.cx(
                          _styles,
                          "w-node-_05569669-371a-21c1-ebc5-5114ef88dc9e-d3468612"
                        )}
                        tag="div"
                      >
                        {"Become a Affiliate"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "card-arrow-icon",
                          "dark"
                        )}
                        id={_utils.cx(
                          _styles,
                          "w-node-_05569669-371a-21c1-ebc5-5114ef88dca0-d3468612"
                        )}
                        tag="div"
                      >
                        <_Builtin.Image
                          className={_utils.cx(_styles, "vacation-card-arrow")}
                          loading="lazy"
                          width="auto"
                          height="auto"
                          alt=""
                          src="https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/609dfa12a141ddc6d8976dc0_arrowhead-right-icon-dark001.svg"
                        />
                      </_Builtin.Block>
                    </_Builtin.Link>
                    <_Builtin.Link
                      className={_utils.cx(_styles, "quick-link-item")}
                      button={false}
                      block="inline"
                      options={{
                        href: "mailto:thomas@easystayretreats.com?subject=Property%20Inquiry",
                      }}
                    >
                      <_Builtin.Block
                        id={_utils.cx(
                          _styles,
                          "w-node-_121c17b8-01e3-a1aa-a4ea-5f82f370ad44-d3468612"
                        )}
                        tag="div"
                      >
                        {"Email Us"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "card-arrow-icon",
                          "dark"
                        )}
                        id={_utils.cx(
                          _styles,
                          "w-node-_121c17b8-01e3-a1aa-a4ea-5f82f370ad46-d3468612"
                        )}
                        tag="div"
                      >
                        <_Builtin.Image
                          className={_utils.cx(_styles, "vacation-card-arrow")}
                          loading="lazy"
                          width="auto"
                          height="auto"
                          alt=""
                          src="https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/609dfa12a141ddc6d8976dc0_arrowhead-right-icon-dark001.svg"
                        />
                      </_Builtin.Block>
                    </_Builtin.Link>
                    <_Builtin.Link
                      className={_utils.cx(_styles, "quick-link-item")}
                      button={false}
                      block="inline"
                      options={{
                        href: "tel:+1(240)869-6702",
                      }}
                    >
                      <_Builtin.Block
                        id={_utils.cx(
                          _styles,
                          "w-node-_121c17b8-01e3-a1aa-a4ea-5f82f370ad49-d3468612"
                        )}
                        tag="div"
                      >
                        {"Call Us"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "card-arrow-icon",
                          "dark"
                        )}
                        tag="div"
                      >
                        <_Builtin.Image
                          className={_utils.cx(_styles, "vacation-card-arrow")}
                          loading="lazy"
                          width="auto"
                          height="auto"
                          alt=""
                          src="https://cdn.prod.website-files.com/609dfa12a141dd6e70976d48/609dfa12a141ddc6d8976dc0_arrowhead-right-icon-dark001.svg"
                        />
                      </_Builtin.Block>
                    </_Builtin.Link>
                  </_Builtin.Block>
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
          </_Builtin.Block>
          <_Builtin.Block
            className={_utils.cx(_styles, "close-flyout")}
            data-w-id="6252b416-c3c5-73fa-7b6c-666bfb79e89e"
            tag="div"
          />
        </_Builtin.Block>
        {navHamburgerMenu ? (
          <_Builtin.Block
            className={_utils.cx(_styles, "left-nav")}
            id={_utils.cx(
              _styles,
              "w-node-_69b0d3f6-d0cc-2db5-ee2d-841bd3468614-d3468612"
            )}
            data-w-id="69b0d3f6-d0cc-2db5-ee2d-841bd3468614"
            tag="div"
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "flyout-menu", "open")}
              data-w-id="69b0d3f6-d0cc-2db5-ee2d-841bd3468615"
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "burger-wrapper")}
                tag="div"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "burger-line", "top")}
                  tag="div"
                />
                <_Builtin.Block
                  className={_utils.cx(_styles, "burger-line", "bottom")}
                  data-w-id="81f53ef2-0379-3735-4847-3ac93a9d4aa4"
                  tag="div"
                />
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "flyout-menu", "close")}
              data-w-id="88b0f067-982b-0642-fc5d-73df7d5b3c68"
              tag="div"
            />
          </_Builtin.Block>
        ) : null}
        <_Builtin.Block
          className={_utils.cx(_styles, "navigation-content")}
          id={_utils.cx(
            _styles,
            "w-node-_199fb1dc-b4ea-99c3-f373-804a90f62445-d3468612"
          )}
          data-w-id="199fb1dc-b4ea-99c3-f373-804a90f62445"
          tag="div"
        >
          <_Builtin.NavbarBrand
            className={_utils.cx(_styles, "brand")}
            data-w-id="69b0d3f6-d0cc-2db5-ee2d-841bd3468616"
            options={{
              href: "https://www.easystayretreats.homes/",
            }}
          />
          {mainNavMenu ? (
            <_Builtin.NavbarMenu
              className={_utils.cx(_styles, "nav-menu")}
              data-w-id="69b0d3f6-d0cc-2db5-ee2d-841bd346861d"
              tag="nav"
              role="navigation"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "nav-menu-links")}
                tag="div"
              >
                <_Builtin.DropdownWrapper
                  className={_utils.cx(_styles, "link-cover")}
                  id={_utils.cx(
                    _styles,
                    "w-node-_4f3de52d-435a-e06c-89eb-d73065ff7407-d3468612"
                  )}
                  tag="div"
                  delay={0}
                  hover={false}
                >
                  <_Builtin.DropdownToggle
                    className={_utils.cx(_styles, "dropdown-toggle")}
                    tag="div"
                  >
                    <_Builtin.Icon
                      className={_utils.cx(_styles, "icon")}
                      widget={{
                        type: "icon",
                        icon: "dropdown-toggle",
                      }}
                    />
                    <_Builtin.Block
                      className={_utils.cx(_styles, "dropdown-text")}
                      tag="div"
                    >
                      {"Guest"}
                    </_Builtin.Block>
                  </_Builtin.DropdownToggle>
                  <_Builtin.DropdownList
                    className={_utils.cx(_styles, "dropdown-list")}
                    tag="nav"
                  >
                    <_Builtin.Link
                      className={_utils.cx(_styles, "nav-link")}
                      id={_utils.cx(
                        _styles,
                        "w-node-_4f3de52d-435a-e06c-89eb-d73065ff7415-d3468612"
                      )}
                      button={false}
                      block="inline"
                      options={{
                        href: "/guest/search-properties",
                        preload: "none",
                      }}
                    >
                      <_Builtin.Block
                        className={_utils.cx(_styles, "link-text")}
                        tag="div"
                      >
                        {"Travel Now"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "link-cover",
                          "mobile-hide"
                        )}
                        tag="div"
                      />
                    </_Builtin.Link>
                    <_Builtin.Link
                      className={_utils.cx(_styles, "nav-link")}
                      button={false}
                      block="inline"
                      options={{
                        href: "/guest/travel-services",
                        preload: "none",
                      }}
                    >
                      <_Builtin.Block
                        className={_utils.cx(_styles, "link-text")}
                        tag="div"
                      >
                        {"Travel Services"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "link-cover",
                          "mobile-hide"
                        )}
                        tag="div"
                      />
                    </_Builtin.Link>
                    <_Builtin.Link
                      className={_utils.cx(_styles, "nav-link")}
                      button={false}
                      block="inline"
                      options={{
                        href: "/guest/about-us",
                        preload: "none",
                      }}
                    >
                      <_Builtin.Block
                        className={_utils.cx(_styles, "link-text")}
                        tag="div"
                      >
                        {"Learn More "}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "link-cover",
                          "mobile-hide"
                        )}
                        tag="div"
                      />
                    </_Builtin.Link>
                  </_Builtin.DropdownList>
                </_Builtin.DropdownWrapper>
                <_Builtin.DropdownWrapper
                  className={_utils.cx(_styles, "link-cover")}
                  id={_utils.cx(
                    _styles,
                    "w-node-b125d99d-9df6-b9e2-76fb-ce0982e13f22-d3468612"
                  )}
                  tag="div"
                  delay={0}
                  hover={true}
                >
                  <_Builtin.DropdownToggle
                    className={_utils.cx(_styles, "dropdown-toggle")}
                    tag="div"
                  >
                    <_Builtin.Icon
                      className={_utils.cx(_styles, "icon")}
                      widget={{
                        type: "icon",
                        icon: "dropdown-toggle",
                      }}
                    />
                    <_Builtin.Block
                      className={_utils.cx(_styles, "dropdown-text")}
                      tag="div"
                    >
                      {"Owners"}
                    </_Builtin.Block>
                  </_Builtin.DropdownToggle>
                  <_Builtin.DropdownList
                    className={_utils.cx(_styles, "dropdown-list")}
                    tag="nav"
                  >
                    <_Builtin.Link
                      className={_utils.cx(_styles, "nav-link")}
                      id={_utils.cx(
                        _styles,
                        "w-node-b125d99d-9df6-b9e2-76fb-ce0982e13f30-d3468612"
                      )}
                      button={false}
                      block="inline"
                      options={{
                        href: "/property-owners/rental-management",
                        preload: "none",
                      }}
                    >
                      <_Builtin.Block
                        className={_utils.cx(_styles, "link-text")}
                        tag="div"
                      >
                        {"management"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "link-cover",
                          "mobile-hide"
                        )}
                        tag="div"
                      />
                    </_Builtin.Link>
                    <_Builtin.Link
                      className={_utils.cx(_styles, "nav-link")}
                      button={false}
                      block="inline"
                      options={{
                        href: "/property-owners/management-services",
                        preload: "none",
                      }}
                    >
                      <_Builtin.Block
                        className={_utils.cx(_styles, "link-text")}
                        tag="div"
                      >
                        {"Services"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "link-cover",
                          "mobile-hide"
                        )}
                        tag="div"
                      />
                    </_Builtin.Link>
                    <_Builtin.Link
                      className={_utils.cx(_styles, "nav-link")}
                      button={false}
                      block="inline"
                      options={{
                        href: "/property-owners/about-property-management",
                        preload: "none",
                      }}
                    >
                      <_Builtin.Block
                        className={_utils.cx(_styles, "link-text")}
                        tag="div"
                      >
                        {"About"}
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "link-cover",
                          "mobile-hide"
                        )}
                        tag="div"
                      />
                    </_Builtin.Link>
                  </_Builtin.DropdownList>
                </_Builtin.DropdownWrapper>
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "mobile-destinations-wrapper")}
                tag="div"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "subtitle-intro-wrapper")}
                  tag="div"
                >
                  <_Builtin.Block
                    className={_utils.cx(_styles, "subtitle")}
                    tag="div"
                    dyn={{
                      bind: {},
                    }}
                  >
                    {"Destinations"}
                  </_Builtin.Block>
                  <_Builtin.Block
                    className={_utils.cx(_styles, "horizontal-line")}
                    id={_utils.cx(
                      _styles,
                      "w-node-_4a59f852-41bf-9100-21ba-09c186cccf0e-d3468612"
                    )}
                    tag="div"
                  />
                </_Builtin.Block>
                <_Builtin.NotSupported _atom="DynamoWrapper" />
              </_Builtin.Block>
            </_Builtin.NavbarMenu>
          ) : null}
          <_Builtin.Block
            className={_utils.cx(_styles, "right-nav", "mobile-hide")}
            tag="div"
          >
            <_Builtin.Link
              className={_utils.cx(_styles, "nav-button", "hide-mobile")}
              id={_utils.cx(
                _styles,
                "w-node-_2a8aa310-babc-eed2-4d86-8309be309f42-d3468612"
              )}
              data-w-id="2a8aa310-babc-eed2-4d86-8309be309f42"
              button={true}
              block=""
              options={buttonButtonLink}
              {...buttonBtnOnclick}
            >
              {buttonButtonText}
            </_Builtin.Link>
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block
          className={_utils.cx(_styles, "mobile-navigation-shade")}
          tag="div"
        />
        <_Builtin.Block
          className={_utils.cx(_styles, "navigation-shade")}
          id={_utils.cx(
            _styles,
            "w-node-c05fe523-5a2a-b171-9eca-362095d4bf72-d3468612"
          )}
          data-w-id="c05fe523-5a2a-b171-9eca-362095d4bf72"
          tag="div"
        />
      </_Builtin.Block>
    </_Component>
  );
}
