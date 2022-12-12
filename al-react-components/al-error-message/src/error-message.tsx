import * as React from "react";
import { Alert } from "react-bootstrap";

export interface IProps {
  error?: Error;
  isFullPage?: boolean;
  className?: string;
  wrapperClassName?: string;
  style?: {};
  alSupportUrl?: string;
}

export const ErrorMessage = ({
  error,
  isFullPage,
  alSupportUrl,
  className = "",
  wrapperClassName = "",
  style = {}
}: IProps) => {
  if (isFullPage) className += " d-inline-block";

  const alert = (
    <Alert variant="danger" style={{ wordBreak: "break-word", ...style }} className={className}>
      {error?.message ?? (
        <span>
          Der skete desværre en ukendt fejl. Prøv venligst igen eller opret en supportsag{" "}
          <a href={alSupportUrl ?? "https://alsupport.al-bank.dk/opret"} target="_blank" rel="noopener noreferrer">
            her
          </a>
          .
        </span>
      )}
    </Alert>
  );

  return isFullPage ? <div className={`text-center ${wrapperClassName}`}>{alert}</div> : alert;
};
