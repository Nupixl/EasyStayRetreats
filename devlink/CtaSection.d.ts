import { ReactNode } from "react";

export interface CtaSectionProps {
  as?: any;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  metaId?: string;
}

export declare function CtaSection(props: CtaSectionProps): ReactNode;
