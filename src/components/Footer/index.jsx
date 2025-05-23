import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export function Footer() {
  return (
    <footer className="bg-light mt-auto py-4 border-top">
      <Container>
        <Row className="align-items-start">
          {/* Left side: Logo + copyright */}
          <Col md={6} className="text-start mb-3 mb-md-0">
            <p className="footer-logo fw-bold">Holidaze</p>
            <p className="small mb-0">
              © {new Date().getFullYear()} Holidaze. All rights reserved.
            </p>
          </Col>

          {/* Right side: Contact info, left-aligned text but container aligned right */}
          <Col md={4} className="text-start ms-auto">
            <p className="footer-contact fw-semibold">Contact</p>
            <p className="small mb-1">Email: support@holidaze.com</p>
            <p className="small mb-0">Follow us: Facebook, Instagram</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}


