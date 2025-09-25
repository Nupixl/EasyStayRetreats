import * as React from "react";
import * as Types from "./types";

declare function HeroSection(props: {
  as?: React.ElementType;
  metaTag?: Types.Basic.HeadingTag;
  textTitle?: React.ReactNode;
  textSubtitleText?: React.ReactNode;
  textBody?: React.ReactNode;
  body?: Types.Visibility.VisibilityConditions;
  title?: Types.Visibility.VisibilityConditions;
  subtitle?: Types.Visibility.VisibilityConditions;
  backgroundImage?: Types.Asset.Image;
  imageAltText?: Types.Basic.AltText;
}): React.JSX.Element;
