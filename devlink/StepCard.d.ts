import * as React from "react";
import * as Types from "./types";

declare function StepCard(props: {
  as?: React.ElementType;
  stepNumber?: React.ReactNode;
  stepDescription?: React.ReactNode;
  title?: React.ReactNode;
  titleTag?: Types.Basic.HeadingTag;
}): React.JSX.Element;
