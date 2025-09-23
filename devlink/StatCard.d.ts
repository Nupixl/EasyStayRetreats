import * as React from "react";
import * as Types from "./types";

declare function StatCard(props: {
  as?: React.ElementType;
  textTitle?: React.ReactNode;
  textMainStat?: React.ReactNode;
  textBooking?: React.ReactNode;
  textAvgPrice?: React.ReactNode;
  textPillText?: React.ReactNode;
  statBookingsStat?: React.ReactNode;
  statAveragePrice?: React.ReactNode;
  visibilitySecondLine?: Types.Visibility.VisibilityConditions;
  visibilityFirstLine?: Types.Visibility.VisibilityConditions;
  visibilityThirdLine?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
