import * as React from "react";
import * as Types from "./types";

declare function LargeImageCard(props: {
  as?: React.ElementType;
  textTitle?: React.ReactNode;
  titleTag?: Types.Basic.HeadingTag;
  textSubtilte?: React.ReactNode;
  visibilityImage?: Types.Visibility.VisibilityConditions;
  imageAltText?: Types.Basic.AltText;
  imageImageId?: Types.Basic.IdTextInput;
  imageImage?: Types.Asset.Image;
}): React.JSX.Element;
