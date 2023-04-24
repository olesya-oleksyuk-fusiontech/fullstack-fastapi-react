import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ styleOptions }) => (
  <Spinner
    animation="border"
    role="status"
    style={{
      width: '100px',
      height: '100px',
      margin: 'auto',
      display: 'block',
      ...styleOptions,
    }}
  >
    <span className="sr-only"> Загрузка...</span>
  </Spinner>
);

export default Loader;
