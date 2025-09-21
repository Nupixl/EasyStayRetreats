import * as React from "react";
import * as Types from "./types";

declare function PropertyCard(props: {
  as?: React.ElementType;
  propertyTitle?: React.ReactNode;
  firstLine?: React.ReactNode;
  secoundLine?: React.ReactNode;
  comparedPrice?: React.ReactNode;
  /** Price*/
  price?: React.ReactNode;
  duration?: React.ReactNode;
  propertyRating?: React.ReactNode;
  numberOfReviews?: React.ReactNode;
  propertyAccolade?: Types.Visibility.VisibilityConditions;
  propertyAccoladeType?: React.ReactNode;
  accoladeImageDispaly?: Types.Visibility.VisibilityConditions;
  accoladeIcon?: Types.Asset.Image;
  imageAccoladeAltText?: Types.Basic.AltText;
  acolladeFavoriteTag?: Types.Basic.TagType;
  imageSlot?: Types.Devlink.Slot;
  runtimeProp?: Types.Devlink.RuntimeProps;
  cardLink?: Types.Basic.TagType;
}): React.JSX.Element;
