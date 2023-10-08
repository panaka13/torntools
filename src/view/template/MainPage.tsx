import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { ViewBookieResult } from "../BookieView";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router";

function Homepage() {
  return (<></>);
}

export function Main() {
  return (
    <>
      <Navbar>
        <Nav className="navbar">
          <NavDropdown title="Bookie" id="bokkieMenu">
            <NavDropdown.Item href="/view_bookie">Result</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
      <div style={{ background: "#fff", width: "100%", height: "100%" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/view_bookie" element={<ViewBookieResult />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
