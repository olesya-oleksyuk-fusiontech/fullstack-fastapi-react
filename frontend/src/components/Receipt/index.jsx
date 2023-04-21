import React from 'react';
import {
  Card, Col, ListGroup, ListGroupItem, Row,
} from 'react-bootstrap';

import ButtonCandyPrimary from '../buttons/ButtonCandyPrimary';
import PaypalButton from '../PaypalButton';
import { toCurrency } from '../../helpers/data';

import { CURRENCY, PAYMENT_METHOD } from '../../helpers/constants';

const Receipt = (
  {
    orderId = null,
    adminAccess = false,
    totalProductPrice,
    shippingPrice,
    totalPrice,
    currency = CURRENCY.DEFAULT,
    paymentMethod = PAYMENT_METHOD.PAYPAL,
    isPaid,
    isDelivered,
    loadingProgressDeliver,
    children,
    deliverHandler,
  },
) => {
  const totalProductPriceInCurrency = () => toCurrency(totalProductPrice, currency);
  const shippingPriceInCurrency = () => toCurrency(shippingPrice, currency);
  const totalPriceInCurrency = () => toCurrency(totalPrice, currency);

  const payButton = () => {
    if (paymentMethod === 'paypal' && !!orderId) {
      return (
        <PaypalButton
          orderId={orderId}
          orderIsPaid={isPaid}
          orderPrice={totalPrice}
        />
      );
    }
    return <></>;
  };

  const deliveryButton = () => {
    if (adminAccess && isPaid && !isDelivered) {
      return (
        <ListGroupItem>
          <div className="d-grid">
            <ButtonCandyPrimary type="button" onClick={deliverHandler} fullWidth>
              {loadingProgressDeliver ? 'Загрузка...' : 'Отметить как доставлено'}
            </ButtonCandyPrimary>
          </div>
        </ListGroupItem>
      );
    } return <></>;
  };

  return (
    <Card>
      <ListGroup variant="flush">
        <ListGroupItem>
          <h2>Чек</h2>
        </ListGroupItem>
        <ListGroupItem>
          <Row>
            <Col>Товары</Col>
            <Col>
              {totalProductPriceInCurrency()}
            </Col>
          </Row>
        </ListGroupItem>
        <ListGroupItem>
          <Row>
            <Col>Доставка</Col>
            <Col>
              {shippingPriceInCurrency()}
            </Col>
          </Row>
        </ListGroupItem>
        <ListGroupItem>
          <Row>
            <Col>Итого</Col>
            <Col>
              {totalPriceInCurrency()}
            </Col>
          </Row>
        </ListGroupItem>
        { payButton() }
        { deliveryButton() }
        {children && (
          <ListGroupItem>
            {children}
          </ListGroupItem>
        )}
      </ListGroup>
    </Card>
  );
};

export default Receipt;
