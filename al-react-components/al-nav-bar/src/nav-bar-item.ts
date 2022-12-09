import { IBaseProps } from "@205093/al-base-props";
import { CSSProperties } from "react";
import { Color, Variant } from "react-bootstrap/esm/types";

export interface INavbarItemBadgeProps extends IBaseProps {
  content: string | number;
  bg?: Variant;
  text?: Color;
  style?: CSSProperties;
  className?: string;
}

export interface INavbarItemProps extends IBaseProps {
  url: string;
  text: string;
  exact?: boolean;
  badge?: INavbarItemBadgeProps;
}
