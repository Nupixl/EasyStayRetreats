import * as React from "react";
import * as Types from "./types";

declare function CtaSection(props: {
  as?: React.ElementType;
  metaTag?: Types.Basic.HeadingTag;
  textSubtitle?: React.ReactNode;
  textTitle?: React.ReactNode;
  buttonLink?: Types.Basic.Link;
  buttonId?: Types.Basic.IdTextInput;
  buttonVisibility?: Types.Visibility.VisibilityConditions;
  buttonOnClick?: Types.Devlink.RuntimeProps;
  buttonButtonText?: React.ReactNode;
  image?: Types.Asset.Image;
  altText?: Types.Basic.AltText;
  id?: Types.Basic.IdTextInput;
  textBodyText?: React.ReactNode;
  textBodyVisibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
