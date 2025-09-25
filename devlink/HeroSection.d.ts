import { ReactNode } from "react";

export interface HeroSectionProps {
  as?: any;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  features?: string;
  backgroundImage?: string;
  metaId?: string;
}

export declare function HeroSection(props: HeroSectionProps): ReactNode;
