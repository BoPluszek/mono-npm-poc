import * as React from "react";
import { Button, Spinner } from "react-bootstrap";
import { ButtonProps } from "react-bootstrap/Button";

export interface IProps extends ButtonProps {
  block?: boolean;
  isLoading: boolean;
}

export const SpinnerButton = ({ block, isLoading, ...props }: IProps) => {
  const content = isLoading ? <Spinner animation="border" role="status" as="span" size="sm" /> : props.children;
  const { children, ...buttonProps } = props;
  const button = (
    <Button disabled={isLoading || props.disabled} {...buttonProps}>
      {content}
    </Button>
  );
  return block ? <div className="d-grid">{button}</div> : button;
};
