import * as React from "react";
import * as Types from "./types";

declare function TallSectionWPhotos(props: {
  as?: React.ElementType;
  textSubtitle?: React.ReactNode;
  metaTag?: Types.Basic.HeadingTag;
  textTitle?: React.ReactNode;
  textBodyText?: React.ReactNode;
  visiblityBody?: Types.Visibility.VisibilityConditions;
  visiblityTitleVisibility?: Types.Visibility.VisibilityConditions;
  visiblitySubtitleVisibility?: Types.Visibility.VisibilityConditions;
  visiblityTextGroupVisibility?: Types.Visibility.VisibilityConditions;
  topLeftImageImage?: Types.Asset.Image;
  topLeftImageAltText?: Types.Basic.AltText;
  topCenterImageImage?: Types.Asset.Image;
  topCenterImageAltText?: Types.Basic.AltText;
  topRightImageImage?: Types.Asset.Image;
  topRightImageAltText?: Types.Basic.AltText;
  bottomLeftImageImage?: Types.Asset.Image;
  bottomLeftImageAltText?: Types.Basic.AltText;
  bottomCenterLeftImageImage?: Types.Asset.Image;
  bottomCenterLeftImageAltText?: Types.Basic.AltText;
  bottomCenterRightImageImage?: Types.Asset.Image;
  bottomCenterRightImageAltText?: Types.Basic.AltText;
  bottomRightImageImage?: Types.Asset.Image;
  bottomRightImageAltText?: Types.Basic.AltText;
}): React.JSX.Element;
