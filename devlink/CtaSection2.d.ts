import * as React from "react";
import * as Types from "./types";

declare function CtaSection2(props: {
  as?: React.ElementType;
  image?: Types.Asset.Image;
  metaTag?: Types.Basic.HeadingTag;
  textTitle?: React.ReactNode;
  textBocy?: React.ReactNode;
  textEyebrow?: React.ReactNode;
  buttonLink?: Types.Basic.Link;
  buttonOnClick?: Types.Devlink.RuntimeProps;
  buttonButtonText?: React.ReactNode;
}): React.JSX.Element;
