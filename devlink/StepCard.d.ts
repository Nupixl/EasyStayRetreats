import * as React from "react";
import * as Types from "./types";

declare function StepCard(props: {
  as?: React.ElementType;
  stepNumber?: React.ReactNode;
  stepDescription?: React.ReactNode;
  title?: React.ReactNode;
  titleTag?: Types.Basic.HeadingTag;
  variant?: "Base" | "Icon";
  visibilityIcon?: Types.Visibility.VisibilityConditions;
  iconImage?: Types.Asset.Image;
}): React.JSX.Element;
