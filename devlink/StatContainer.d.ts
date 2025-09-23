import * as React from "react";
import * as Types from "./types";

declare function StatContainer(props: {
  as?: React.ElementType;
  textMainStat?: React.ReactNode;
  textStatTitle?: React.ReactNode;
  textStatChange?: React.ReactNode;
  textStatFeature?: React.ReactNode;
  visibilityStatCard?: Types.Visibility.VisibilityConditions;
  visibilityTopSection?: Types.Visibility.VisibilityConditions;
  visibilityBottomSection?: Types.Visibility.VisibilityConditions;
  visibilityMainStataIcon?: Types.Visibility.VisibilityConditions;
  iconStatTitleIcon?: Types.Asset.Image;
  iconMainStatIcon?: Types.Asset.Image;
  visibilityStatTitleIcon?: Types.Visibility.VisibilityConditions;
  variant?: "Base" | "Hover";
}): React.JSX.Element;
