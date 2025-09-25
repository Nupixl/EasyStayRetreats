import * as React from "react";
import * as Types from "./types";

declare function ParallaxSection(props: {
  as?: React.ElementType;
  metaTag?: Types.Basic.HeadingTag;
  imageImage?: Types.Asset.Image;
  textTitle?: React.ReactNode;
  textBody?: React.ReactNode;
  visibilityBody?: Types.Visibility.VisibilityConditions;
  visibilityTitle?: Types.Visibility.VisibilityConditions;
  visibilitySubtitle?: Types.Visibility.VisibilityConditions;
  textSubtitle?: React.ReactNode;
  visibilityButton?: Types.Visibility.VisibilityConditions;
  buttonLink?: Types.Basic.Link;
  textButton?: React.ReactNode;
  metaImageId?: Types.Basic.IdTextInput;
  metaAltText?: Types.Basic.AltText;
}): React.JSX.Element;
