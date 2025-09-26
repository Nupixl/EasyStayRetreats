import * as React from "react";
import * as Types from "./types";

declare function PropertyDirectory(props: {
  as?: React.ElementType;
  /** This is the number of properties within the query*/
  numberOfProperties?: React.ReactNode;
  propertyCountLabel?: React.ReactNode;
  propertyFilter?: Types.Visibility.VisibilityConditions;
  propertyFilterSlot?: React.ReactNode;
  propertyCardSlot?: React.ReactNode;
  _4thElementTag?: Types.Basic.TagType;
  _4thElementValue?: Types.Builtin.Text;
  _4thElementKey?: Types.Builtin.Text;
  _4thElementText?: React.ReactNode;
  _3rdElementTag?: Types.Basic.TagType;
  _3rdElementText?: React.ReactNode;
  _3rdElementKey?: Types.Builtin.Text;
  _2ndElementTag?: Types.Basic.TagType;
  _2ndElementText?: React.ReactNode;
  _2ndElementKey?: Types.Builtin.Text;
  _2ndElementValue?: Types.Builtin.Text;
  _1stElementTag?: Types.Basic.TagType;
  _1stElementText?: React.ReactNode;
  _1stElementKey?: Types.Builtin.Text;
  _1stElementValue?: Types.Builtin.Text;
}): React.JSX.Element;
