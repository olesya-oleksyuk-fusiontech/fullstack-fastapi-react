import React, { useState } from 'react';
import {
  Card, Col, FormSelect, ListGroup, ListGroupItem, Row,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import ButtonCandyPrimary from '../buttons/ButtonCandyPrimary';

const PriceTag = ({
  productInfo,
}) => {
  const { productId, productPrice, countInStock } = productInfo;
  const [quantity, setQuantity] = useState(1);

  const history = useHistory();

  const addToCartHandler = () => {
    history.push(`/cart/${productId}?qty=${quantity}`);
  };

  return (
    <Card>
      <ListGroup variant="flush">
        <ListGroupItem>
          <Row>
            <Col>
              Цена:
            </Col>
            <Col>
              <strong>
                {productPrice}
              </strong>
            </Col>
          </Row>
        </ListGroupItem>
        <ListGroupItem>
          <Row>
            <Col>
              Статус:
            </Col>
            <Col>
              {countInStock > 0 ? 'В наличии' : 'Нет в наличии'}
            </Col>
          </Row>
        </ListGroupItem>
        {countInStock > 0 && (
          <ListGroupItem>
            <Row>
              <Col>Количество:</Col>
              <Col>
                <FormSelect value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                  {
                    [...Array(countInStock).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))
                  }
                </FormSelect>
              </Col>
            </Row>
          </ListGroupItem>
        )}
        <ListGroupItem className="d-grid" disabled={!countInStock}>
          <ButtonCandyPrimary type="button" variant="light" fullWidth disabled={countInStock === 0} onClick={addToCartHandler}>
            Добавить в корзину
          </ButtonCandyPrimary>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default PriceTag;
