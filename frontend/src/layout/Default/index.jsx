import React from 'react';
import { Container } from 'react-bootstrap';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DefaultLayout = ({ noFooter = false, mainContainerPaddings = 'py-1 py-sm-3', children }) => (
  <div className="page">
    <header className="page__header">
      <Header />
    </header>
    <Container className={`page__main ${mainContainerPaddings} ${noFooter ? 'page__main--no-footer' : ''}`}>
      {children}
    </Container>
    { !noFooter
      && (
      <footer className="page__footer">
        <Footer />
      </footer>
      )}
  </div>
);

export default DefaultLayout;
