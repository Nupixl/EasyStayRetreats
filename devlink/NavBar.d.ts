import * as React from "react";
import * as Types from "./types";

declare function NavBar(props: {
  as?: React.ElementType;
  navHamburgerMenu?: Types.Visibility.VisibilityConditions;
  mainNavMenu?: Types.Visibility.VisibilityConditions;
  searchNavWrapper?: Types.Visibility.VisibilityConditions;
  buttonBtnOnclick?: Types.Devlink.RuntimeProps;
  buttonButtonText?: React.ReactNode;
  buttonId?: Types.Basic.IdTextInput;
  buttonButtonLink?: Types.Basic.Link;
}): React.JSX.Element;
