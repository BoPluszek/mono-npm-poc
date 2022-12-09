import * as React from "react";
import { Container } from "react-bootstrap";

export interface IProps {
  version: string;
}

export const VersionFooter = (props: IProps) => {
  return (
    <footer className="version-footer">
      <Container fluid className="text-muted text-end">
        v{props.version}
      </Container>
    </footer>
  );
};
