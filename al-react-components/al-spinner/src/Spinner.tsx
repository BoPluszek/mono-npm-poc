import * as React from "react";
import { IBaseProps } from "@205093/al-base-props";
import { Spinner as RbSpinner } from "react-bootstrap";

export interface IProps extends IBaseProps {
  text?: string;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
  size?: "sm" | undefined;
  inline?: boolean;
}

export const Spinner = ({ text, variant, className, size, inline }: IProps) => {
  let rbVariant, variantClassName;
  if (variant) {
    if (variant.startsWith("al-")) variantClassName = `text-${variant}`;
    else rbVariant = variant;
  }
  return (
    <div
      className={`text-center ${variantClassName} ${className}`}
      style={{ display: inline ? "inline-block" : "block" }}
    >
      <RbSpinner
        size={size}
        animation="border"
        variant={rbVariant ? rbVariant : undefined}
        className={variantClassName ? variantClassName : undefined}
      />
      {text && <h6 className={`${variant ? `text-${variant}` : ""} mt-1`}>{text}</h6>}
    </div>
  );
};
