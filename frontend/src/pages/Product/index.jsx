import React, { useEffect } from 'react';
import {
  Col, Image, ListGroup, Row,
} from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import DefaultLayout from '../../layout/Default';
import Rating from '../../components/Rating';
import Message from '../../components/Message';
import PriceTag from '../../components/PriceTag';
import LoaderSpinner from '../../components/LoaderSpinner';
import ButtonReturn from '../../components/buttons/ButtonReturn';
import ReviewsSection from '../../components/ReviewsSection';
import NoFoundProduct from '../../components/NoFound/Product';

import { toCurrency } from '../../helpers/data';
import { CURRENCY } from '../../helpers/constants';

import { listProductDetails } from '../../actions/productAction';
import { PRODUCT_DETAILS_RESET } from '../../constants/productConstants';

const Product = () => {
  const dispatch = useDispatch();
  const { id: productId } = useParams();
  const location = useLocation();

  const redirect = location.search ? location.search.split('redirect=')[1] : '/home';
  useEffect(() => {
    dispatch(listProductDetails(productId));
    return () => {
      dispatch({ type: PRODUCT_DETAILS_RESET });
    };
  }, [productId]);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const currentProductId = product && product.id;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const price = product && product.price && toCurrency(product.price, CURRENCY.DEFAULT);

  const getContent = () => {
    if (error && error.status && error.status === 404) {
      return (<NoFoundProduct />);
    }
    if (error) {
      return (<Message variant="danger">{error.message}</Message>);
    }
    if (loading || (currentProductId !== +productId)) {
      return <LoaderSpinner pageCenter />;
    }

    if (currentProductId && product.id === +productId) {
      return (
        <>
          <Row>
            <Col md={6}>
              <Image
                src={product.image}
                onError={(e) => {
                  e.target.setAttribute('src', '/images/sample.jpg');
                }}
                alt={product.name}
                fluid
              />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating reviewsNumber={product.numReviews} ratingValue={product.rating} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <div>
                    Цена:&nbsp;
                    {price}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div>
                    Описание:&nbsp;
                    {product.description}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <PriceTag
                productInfo={{
                  productId,
                  productPrice: price,
                  countInStock: product.countInStock,
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="my-3">
              <ReviewsSection
                reviews={product.reviews}
                productId={productId}
                isLoggedIn={userInfo}
              />
            </Col>
          </Row>
        </>
      );
    }
    return <></>;
  };

  return (
    <DefaultLayout>
      <Row xs="auto">
        <Col>
          <div className="my-3">
            <ButtonReturn to={redirect}>Вернуться</ButtonReturn>
          </div>
        </Col>
      </Row>
      {getContent()}
    </DefaultLayout>
  );
};
export default Product;
