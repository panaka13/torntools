import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { ViewBookieResult } from "../BookieView";

export function CreateNavbar() {
  return (
    <>
      <Navbar>
        <Nav className="navbar">
          <NavDropdown title="bookie" id="bokkieMenu">
            <NavDropdown.Item href="#">result</NavDropdown.Item>
            <NavDropdown.Item href="#">pending</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
      <ViewBookieResult />
    </>
  );
}
