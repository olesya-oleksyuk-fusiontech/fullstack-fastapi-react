import React, { useEffect, useMemo } from 'react';
import {
  Link, useHistory, useLocation, useParams,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Card, Col, FormSelect, Image, ListGroup, ListGroupItem, Row,
} from 'react-bootstrap';

import DefaultLayout from '../../layout/Default';
import Message from '../../components/Message';
import ButtonCandyPrimary from '../../components/buttons/ButtonCandyPrimary';

import { toCurrency } from '../../helpers/data';
import { CURRENCY } from '../../helpers/constants';

import { addToCart, removeFromCart } from '../../actions/cartAction';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const Cart = () => {
  const { id: productId } = useParams();
  const history = useHistory();

  const query = useQuery();
  const qty = query.get('qty') || 1;

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  const overallProductQuantity = () => cartItems
    .reduce((acc, item) => acc + Number(item.quantity), 0);

  const overallProductPrice = () => toCurrency(cartItems
    .reduce((acc, item) => acc + item.quantity * item.price, 0)
    .toFixed(2), CURRENCY.DEFAULT);

  return (
    <DefaultLayout>
      <Row>
        <Col md={8} className="py-sm-0 px-sm-6 p-md-0">
          <h1 className="header-1">Корзина товаров</h1>
          {!cartItems.length ? (
            <Message variant="warning">
              Ваша корзина пуста
              <Link to="/home" className="ms-4">Вернуться</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroupItem
                  key={item.product}
                  className="cart-list px-5 px-sm-3 pb-4"
                >
                  <Row>
                    <Col md={2} className="cart-img p-0 py-sm-4 px-sm-7 p-md-0 px-lg-4">
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={4} className="mt-4 mt-md-2">
                      <Link
                        style={{ textDecoration: 'none' }}
                        to={`/product/${item.product}`}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={2} className="mt-2">
                      {toCurrency(item.price, CURRENCY.DEFAULT)}
                    </Col>
                    <Col
                      xs={9}
                      sm={6}
                      md={2}
                      className="mt-2 mt-md-0 p-md-0 px-xl-4"
                    >
                      <FormSelect
                        bsPrefix="cart-product-quantity-select"
                        value={item.quantity}
                        onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                      >
                        {
                          [...Array(item.countInStock).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))
                        }
                      </FormSelect>
                    </Col>
                    <Col
                      xs={3}
                      sm={2}
                      md={1}
                      className="mt-2 mt-md-0 ms-auto ms-md-3 p-0 py-md-0 cart-btn"
                    >
                      <Button
                        type="button"
                        variant="outline-dark"
                        className="btn-block mx-auto"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className="fas fa-trash" />
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card className="mt-2">
            <ListGroup variant="flush">
              <ListGroupItem>
                <span className="cart-overall-text">
                  Всего (
                  {overallProductQuantity()}
                  ) товаров в корзине
                </span>
                <h2>
                  Итого:
                  {' '}
                  {overallProductPrice()}
                </h2>
              </ListGroupItem>
              <ListGroupItem className="d-flex justify-content-end">
                <ButtonCandyPrimary type="button" onClick={checkoutHandler} disabled={cartItems.length === 0}>
                  Оформить заказ
                </ButtonCandyPrimary>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </DefaultLayout>
  );
};

export default Cart;
