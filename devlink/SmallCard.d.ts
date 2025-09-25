import * as React from "react";
import * as Types from "./types";

declare function SmallCard(props: {
  as?: React.ElementType;
  textTitle?: React.ReactNode;
  metaTitleTag?: Types.Basic.HeadingTag;
  item1Visibility?: Types.Visibility.VisibilityConditions;
  textItem1Text?: React.ReactNode;
  textItem2Visibility?: Types.Visibility.VisibilityConditions;
  textItem2Text?: React.ReactNode;
  textItem3Text?: React.ReactNode;
  item3Visibility?: Types.Visibility.VisibilityConditions;
  textCardEyebrow?: React.ReactNode;
  visiblityListVisibility?: Types.Visibility.VisibilityConditions;
  visiblityTitleVisibility?: Types.Visibility.VisibilityConditions;
  visiblitySubtitleVisibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
