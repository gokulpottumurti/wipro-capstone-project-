import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

const NavigationBar = () => {
  // Custom class handler for NavLink
  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "px-3 py-2 fw-semibold text-primary border-bottom border-2 border-primary"
      : "px-3 py-2 fw-medium text-dark";

  return (
    <Navbar
      expand="lg"
      sticky="top"
      style={{
        boxShadow: "0px 2px 12px rgba(0,0,0,0.08)",
        background: "#fff",
        padding: "0.8rem 0",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand
          as={NavLink}
          to="/"
          end
          style={{
            fontWeight: "700",
            fontSize: "1.8rem",
            letterSpacing: "0.5px",
            background: "linear-gradient(90deg, #007bff, #6610f2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Healthcare & wellness Management System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav" className="justify-content-center">
          <Nav className="align-items-lg-center gap-2">
            {/* Main Links */}
            <Nav.Link
              as={NavLink}
              to="/patients"
              end
              className={getNavLinkClass}
              style={{ transition: "color 0.3s ease, transform 0.2s ease" }}
            >
              Patients
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/appointments"
              className={getNavLinkClass}
              style={{ transition: "color 0.3s ease, transform 0.2s ease" }}
            >
              Appointments
            </Nav.Link>

            {/* Dropdown - Services */}
            <NavDropdown
              title="Services & Payments"
              id="services-payments-dropdown"
              className="mx-2"
              menuVariant="light"
              style={{ borderRadius: "12px" }}
            >
              <NavDropdown.Item as={NavLink} to="/wellness" end>
                Wellness Services
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/payments" end>
                Payments
              </NavDropdown.Item>
            </NavDropdown>

            {/* Dropdown - Providers */}
            <NavDropdown
              title="Providers & Enrollments"
              id="providers-enrollments-dropdown"
              className="mx-2"
              menuVariant="light"
              style={{ borderRadius: "12px" }}
            >
              <NavDropdown.Item as={NavLink} to="/providers" end>
                Providers
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/enrollments" end>
                Enrollments
              </NavDropdown.Item>
            </NavDropdown>

            {/* Auth Links */}
            <Nav.Link
              as={NavLink}
              to="/login"
              className={getNavLinkClass}
              style={{ transition: "color 0.3s ease, transform 0.2s ease" }}
            >
              Login
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/register"
              className={`${getNavLinkClass({ isActive: false })} text-white`}
              style={{
                borderBottom: "none",
                background: "#0d6efd",
                padding: "0.6rem 1.4rem",
                borderRadius: "50px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#0056b3";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#0d6efd";
                e.target.style.transform = "scale(1)";
              }}
            >
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;