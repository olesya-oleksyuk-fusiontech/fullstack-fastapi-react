import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Rating from '../Rating';
import { toCurrency } from '../../helpers/data';
import { CURRENCY } from '../../helpers/constants';
import './style.scss';

const ProductCard = ({ product }) => {
  const price = toCurrency(product.price, CURRENCY.DEFAULT);

  return (
    <>
      <Card className="my-3 pb-0 p-sm-3 pb-md-0 h-90 rounded" bsPrefix="card-product">
        <Link to={`/product/${product.id}`}>
          <Card.Img
            src={product.image}
            onError={(e) => {
              e.target.setAttribute('src', '/images/sample.jpg');
            }}
          />
        </Link>
        <Card.Body className="pb-0 p-md-3">
          <Link to={`/product/${product.id}`} className="product-link">
            <Card.Title as="div">
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>
          <Card.Text as="div">
            <Rating
              ratingValue={product.rating}
              reviewsNumber={product.numReviews}
            />
          </Card.Text>
          <Card.Text as="h3" className="py-3">
            {price}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    rating: PropTypes.number,
    numReviews: PropTypes.number,
    price: PropTypes.number,
  }).isRequired,
};

export default React.memo(ProductCard);
