import * as React from "react";
import * as Types from "./types";

declare function MobileNav(props: {
  as?: React.ElementType;
  leftButtonLeftButtonText?: React.ReactNode;
  leftButtonOnClick?: Types.Devlink.RuntimeProps;
  leftButtonId?: Types.Basic.IdTextInput;
  leftButtonLink?: Types.Basic.Link;
  rightButtonRightButtonText?: React.ReactNode;
  rightButtonLink?: Types.Basic.Link;
  rightButtonOnClick?: Types.Devlink.RuntimeProps;
  rightButtonId?: Types.Basic.IdTextInput;
  leftButtonVisibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
