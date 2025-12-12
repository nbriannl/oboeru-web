import React from "react";
import { Navbar } from "react-bootstrap";

export default function NavBar({ bg }) {
  return (
    <Navbar bg={bg} variant="dark" expand="lg">
      <Navbar.Brand href="#home">Oboeru</Navbar.Brand>
    </Navbar>
  );
}
