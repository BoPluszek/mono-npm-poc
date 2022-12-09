import * as React from "react";
import * as ReactRouter from "react-router-dom";
import { Navbar as RbNavbar, Nav, Badge, Container } from "react-bootstrap";
import { IBaseProps } from "@205093/al-base-props";

import logo from "./logo.svg";
import logoSmall from "./logo_sm.svg";
import { INavbarItemProps } from "./nav-bar-item";

import "./style.scss";
import { Spinner } from "@205093/al-spinner";

export interface IProps extends IBaseProps {
  items?: Array<INavbarItemProps>;
  brand: any;
  brandClassName?: string;
  smallBrandOnly?: boolean;
  smallMenuOnly?: boolean;
  isLoading?: boolean;
}

export const Navbar = ({
  items = [],
  brand,
  brandClassName,
  className,
  style,
  smallBrandOnly = true,
  smallMenuOnly = true,
  isLoading = false
}: IProps) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <RbNavbar
      expand={smallMenuOnly ? false : "lg"}
      expanded={expanded}
      onSelect={() => setExpanded(false)}
      onToggle={() => setExpanded(!expanded)}
      className={className}
      style={style}
    >
      <Container fluid>
        <RbNavbar.Brand as={ReactRouter.Link} href={brand.url} to={brand.url} onClick={() => setExpanded(false)}>
          <div className={`d-flex flex-row ${smallBrandOnly ? "" : "flex-md-column"} align-items-center`}>
            {!smallBrandOnly && (
              <img
                src={logo}
                alt="Arbejdernes Landsbanks logo"
                className="d-none d-md-block"
                style={{ width: "348px" }}
              />
            )}

            <img
              src={logoSmall}
              alt="Lille Arbejdernes Landsbanks logo"
              className={`me-2 ${!smallBrandOnly ? "d-md-none" : ""}`}
              style={{ width: "29px" }}
            />

            {brand.text && <div className={`navbar-brand ${brandClassName || ""}`}>{brand.text}</div>}
          </div>
        </RbNavbar.Brand>
        <RbNavbar.Toggle />
        <RbNavbar.Collapse>
          <Nav className="ms-auto">
            {isLoading && <Spinner />}
            {!isLoading &&
              items.map(item => (
                <Nav.Link as={ReactRouter.Link} to={item.url} href={item.url} key={item.url} active={false}>
                  {item.text}
                  {item.badge && (
                    <sup className="ms-1">
                      <Badge
                        bg={item.badge.bg}
                        text={item.badge.text}
                        style={item.badge.style}
                        className={item.badge.className}
                      >
                        {item.badge.content}
                      </Badge>
                    </sup>
                  )}
                </Nav.Link>
              ))}
          </Nav>
        </RbNavbar.Collapse>
      </Container>
    </RbNavbar>
  );
};
