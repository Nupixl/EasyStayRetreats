import * as React from "react";
import * as Types from "./types";

declare function StatWrapper(props: {
  as?: React.ElementType;
  slot?: Types.Slots.SlotContent;
  textTitle?: React.ReactNode;
  visibilityStatCardIconVisibility?: Types.Visibility.VisibilityConditions;
  imageStatCardImage?: Types.Asset.Image;
  variant?: "Base" | "Card";
}): React.JSX.Element;
