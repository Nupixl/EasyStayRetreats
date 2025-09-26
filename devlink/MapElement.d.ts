import * as React from "react";
import * as Types from "./types";

declare function MapElement(props: {
  as?: React.ElementType;
  metaAcolladeFavoriteTag?: Types.Basic.TagType;
  metaRuntimeProp?: Types.Devlink.RuntimeProps;
  metaSlug?: Types.Builtin.Text;
  mapSlot?: React.ReactNode;
  children?: React.ReactNode;
}): React.JSX.Element;
