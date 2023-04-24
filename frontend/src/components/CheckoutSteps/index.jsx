import React from 'react';
import { Nav, NavItem, NavLink } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import './style.scss';
import { useDispatch } from 'react-redux';
import { logout } from '../../actions/userActions';

const CheckoutSteps = ({
  step1, step2, step3, step4,
}) => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <Nav className="justify-content-evenly mb-4">
      <NavItem>
        {step1 ? (
          <LinkContainer to="/login">
            <NavLink className="checkout checkout-passed" onClick={logoutHandler}>Вход</NavLink>
          </LinkContainer>
        ) : <NavLink disabled className="checkout">Вход</NavLink>}
      </NavItem>
      <NavItem>
        {step2 ? (
          <LinkContainer to="/shipping">
            <NavLink className="checkout checkout-passed">Доставка</NavLink>
          </LinkContainer>
        ) : <NavLink disabled className="checkout">Доставка</NavLink>}
      </NavItem>
      <NavItem>
        {step3 ? (
          <LinkContainer to="/payment">
            <NavLink className="checkout checkout-passed">Оплата</NavLink>
          </LinkContainer>
        ) : <NavLink disabled className="checkout">Оплата</NavLink>}
      </NavItem>
      <NavItem>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <NavLink className="checkout checkout-passed">Оформить</NavLink>
          </LinkContainer>
        ) : <NavLink disabled className="checkout">Оформить</NavLink>}
      </NavItem>
    </Nav>
  );
};

export default CheckoutSteps;
