import * as React from "react";
import * as Types from "./types";

declare function DashboardHeader(props: {
  as?: React.ElementType;
  headerTextTitle?: React.ReactNode;
  headerTextHeaderSubtitle?: React.ReactNode;
  componentVisibilityRightIcons?: Types.Visibility.VisibilityConditions;
  componentVisibilityHeader?: Types.Visibility.VisibilityConditions;
  componentVisibilityEyebrow?: Types.Visibility.VisibilityConditions;
  headerTextEyebrowText?: React.ReactNode;
  headerTextPageActionText?: React.ReactNode;
}): React.JSX.Element;
