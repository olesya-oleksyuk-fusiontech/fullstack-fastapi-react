import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const ButtonReturn = ({ to, children }) => (
  <Link className="btn btn-return" to={to}>{children}</Link>
);

export default ButtonReturn;
