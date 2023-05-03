import React from 'react';
import {
  Col, Image, ListGroup, ListGroupItem, Row,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Message from '../Message';

import {
  getPicUrl, paymentMethodName, toCurrency, toDateTime,
} from '../../helpers/data';
import { CURRENCY, DATE_TIME_FORMAT } from '../../helpers/constants';

const OrderInfo = (
  {
    orderId,
    isOrderPlaced = false,
    customerName = '',
    customerEmail = '',
    isDelivered = false,
    isPaid = false,
    paidAt = null,
    deliveredAt = null,
    items,
    shippingStreet,
    shippingCity,
    shippingPostalCode,
    shippingCountry,
    paymentMethod,
  },
) => {
  const shippingAddress = () => `${shippingStreet}, ${shippingCity}, ${shippingPostalCode}, ${shippingCountry}`;

  const overallProductCost = (cost, amount) => `${amount} X ${toCurrency(cost, CURRENCY.DEFAULT)} = ${toCurrency(
    (cost * amount).toFixed(2), CURRENCY.DEFAULT,
  )}`;

  const deliveryInfo = () => {
    if (!isOrderPlaced) {
      return null;
    }
    if (isDelivered) {
      return (
        <Message variant="success">
          Доставлено:&nbsp;
          {toDateTime(deliveredAt, DATE_TIME_FORMAT.LONG)}
        </Message>
      );
    }
    return (<Message variant="danger">Не доставлено</Message>);
  };

  const paymentInfo = () => {
    if (!isOrderPlaced) {
      return null;
    }
    if (isPaid) {
      return (
        <Message variant="success">
          Оплачено:&nbsp;
          {toDateTime(paidAt, DATE_TIME_FORMAT.LONG)}
        </Message>
      );
    }
    return (<Message variant="danger">Не оплачено</Message>);
  };

  return (
    <ListGroup variant="flush" className="list-group-default">
      <ListGroupItem>
        <h2>Доставка</h2>
        {isOrderPlaced && (
          <>
            <p>
              <strong>Имя:</strong>
              &nbsp;
              {customerName}
            </p>
            <p>
              <strong>Почта:</strong>
              <a href={`mailto:${customerEmail}`}>
                &nbsp;
                {customerEmail}
              </a>
            </p>
          </>
        )}
        <p>
          <strong>Адрес:</strong>
          &nbsp;
          {shippingAddress()}
        </p>
        { deliveryInfo() }
      </ListGroupItem>
      <ListGroupItem>
        <h2>Способ оплаты</h2>
        <p>
          <strong className="me-2">
            Метод:
          </strong>
          {paymentMethodName(paymentMethod)}
        </p>
        { paymentInfo() }
      </ListGroupItem>
      <ListGroupItem>
        <h2>Заказываемые товары</h2>
        {items.length === 0 ? <Message>Ваша товарная корзина пуста</Message> : (
          <ListGroup variant="flush">
            {items.map((item, index) => (
              <ListGroupItem key={index}>
                <Row>
                  <Col md={1}>
                    <Image src={getPicUrl(item.image)} alt={item.name} fluid rounded />
                  </Col>
                  <Col>
                    <Link to={`/product/${item.product}?redirect=/orders/${orderId}`}>
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={4}>
                    {overallProductCost(item.price, item.quantity)}
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </ListGroupItem>
    </ListGroup>
  );
};

export default OrderInfo;
