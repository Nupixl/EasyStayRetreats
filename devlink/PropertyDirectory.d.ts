import * as React from "react";
import * as Types from "./types";

declare function PropertyDirectory(props: {
  as?: React.ElementType;
  /** This is the number of properties within the query*/
  numberOfProperties?: React.ReactNode;
  /** This is where features maybe exampled*/
  directoryFeature?: Types.Visibility.VisibilityConditions;
  directoryFeaturreIconVisbility?: Types.Visibility.VisibilityConditions;
  directoryFeatureIcon?: Types.Asset.Image;
  propertyCardSlot?: Types.Devlink.Slot;
  cmsPropertyListings?: Types.Visibility.VisibilityConditions;
  propertyFilter?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
