import * as React from "react";
import * as Types from "./types";

declare function StickHeaderCard(props: {
  as?: React.ElementType;
  textEyebrow?: React.ReactNode;
  textHeader?: React.ReactNode;
  textBodyText?: React.ReactNode;
  textCtaText?: React.ReactNode;
  ctaLink?: Types.Basic.Link;
  textEyebrowVisibility?: Types.Visibility.VisibilityConditions;
  textHeaderVisibility?: Types.Visibility.VisibilityConditions;
  textTextBodyVisibility?: Types.Visibility.VisibilityConditions;
  imageHeroImageVisibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
