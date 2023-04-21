import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const copyrightText = 'Copyright \u00a9 CandyShop';
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <span className="footer__text">
              {copyrightText}
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
