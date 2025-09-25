import * as React from "react";
import * as Types from "./types";

declare function StatWrapper(props: {
  as?: React.ElementType;
  slot?: Types.Slots.SlotContent;
  textTitle?: React.ReactNode;
  visibilityStatCardIconVisibility?: Types.Visibility.VisibilityConditions;
  imageStatCardImage?: Types.Asset.Image;
  variant?: "Base" | "Card";
  slot?: Types.Slots.SlotContent;
  slot?: Types.Slots.SlotContent;
  slot?: Types.Slots.SlotContent;
}): React.JSX.Element;
