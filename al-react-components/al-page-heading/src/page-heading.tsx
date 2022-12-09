import * as React from "react";
import { IBaseProps } from "@205093/al-base-props";
import { Variants } from "@205093/al-variants";

export interface IProps extends IBaseProps {
  children: any;
  rightContent?: any;
  rightContentClass?: any;
  subtitle?: any;
  variant?: string;
  textVariant?: string;
  titleStyle?: any;
  subtitleStyle?: any;
  padding?: number;
}

export const PageHeading = ({
  children,
  rightContent = undefined,
  rightContentClass = "",
  subtitle = null,
  variant = Variants.Dark,
  textVariant = Variants.White,
  className = "",
  style = {},
  titleStyle = {},
  subtitleStyle = {},
  padding = 4
}: IProps) => {
  return (
    <div
      className={`py-${padding} px-${
        padding !== 5 ? padding + 1 : 5
      } bg-${variant} text-${textVariant} ${className} page-heading`}
      style={style}
    >
      <div className="d-flex justify-content-between">
        <span>
          <h1 className={`${subtitle == null ? "m-0 " : ""}title`} style={titleStyle}>
            {children}
          </h1>
          {subtitle != null && (
            <p className="m-0 subtitle" style={subtitleStyle}>
              {subtitle}
            </p>
          )}
        </span>
        {rightContent && <span className={rightContentClass}>{rightContent}</span>}
      </div>
    </div>
  );
};
