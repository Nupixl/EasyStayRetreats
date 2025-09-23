import * as React from "react";
import * as Types from "./types";

declare function LoginButton(props: {
  as?: React.ElementType;
  visibilityIcon?: Types.Visibility.VisibilityConditions;
  textButtonText?: React.ReactNode;
  metaOnClick?: Types.Devlink.RuntimeProps;
  metaLink?: Types.Basic.Link;
  metaId?: Types.Basic.IdTextInput;
  imageIcon?: Types.Asset.Image;
}): React.JSX.Element;
