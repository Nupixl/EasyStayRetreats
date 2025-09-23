import * as React from "react";
import * as Types from "./types";

declare function Status(props: {
  as?: React.ElementType;
  variant?: "Base" | "Pending";
  textTitle?: React.ReactNode;
  textPropertyQuanttity?: React.ReactNode;
  textPorpertyValue?: React.ReactNode;
  textStatValue?: React.ReactNode;
  visiblityStatValueVisibility?: Types.Visibility.VisibilityConditions;
  visiblityStatValue?: Types.Visibility.VisibilityConditions;
  visiblityStatTitle?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
