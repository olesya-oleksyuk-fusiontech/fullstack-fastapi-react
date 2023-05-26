import React, { useEffect, useState } from 'react';
import {
  Button, Form, FormControl, FormGroup, FormLabel, ListGroup, ListGroupItem,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../Message';
import Rating from '../Rating';

import { ratingMarks, ratingOption } from './constants';
import { toDateTime } from '../../helpers/data';
import { DATE_TIME_FORMAT } from '../../helpers/constants';

import { PRODUCT_CREATE_REVIEW_RESET } from '../../constants/productConstants';
import { createProductReview, listProductDetails } from '../../actions/productAction';

const ReviewsSection = ({
  productId, reviews, isLoggedIn,
}) => {
  const dispatch = useDispatch();
  const reviewsNumber = reviews?.length;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const productReviewCreated = useSelector(((state) => state.productCreateReview));
  const { success: successProductReview, error: errorProductReview } = productReviewCreated;

  const submitReviewHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(productId, { rating, comment }));
  };

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
      dispatch(listProductDetails(productId));
    }
    if (!isLoggedIn) {
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    return () => {
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    };
  }, [successProductReview, isLoggedIn]);

  const reviewPost = (rew) => {
    const defaultComment = (ratingValue) => `${ratingMarks[ratingValue - 1]}`;

    return (
      <ListGroupItem key={rew.id}>
        <strong>{rew.owner.name}</strong>
        <Rating ratingValue={rew.rating} noReviewsNumber />
        <p>
          {toDateTime({
            date: { dateStr: rew.created_on }, version: DATE_TIME_FORMAT.SHORT,
          })}
        </p>
        <p>{rew.comment || defaultComment(rew.rating)}</p>
      </ListGroupItem>
    );
  };

  const reviewForm = () => (
    <Form onSubmit={submitReviewHandler}>
      <FormGroup controlId="rating" className="mb-2">
        <FormLabel>Оценка</FormLabel>
        <FormControl as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">Выбор...</option>
          { ratingMarks.map((mark, index) => (
            <option value={index + 1}>
              {ratingOption(mark, index)}
            </option>
          )) }
        </FormControl>
      </FormGroup>
      <FormGroup controlId="comment">
        <FormLabel>Комментарий</FormLabel>
        <FormControl as="textarea" row="3" value={comment} onChange={(e) => setComment(e.target.value)} />
      </FormGroup>
      <Button type="submit" variant="primary" className="mt-2">
        Отправить
      </Button>
    </Form>
  );
  return (
    <>
      <h1 className="ms-3 mb-0">Отзывы</h1>
      {reviewsNumber === 0 && <Message variant="info">Отзывов пока нет</Message>}
      <ListGroup variant="flush">
        {reviews.map((rew) => reviewPost(rew))}
        <ListGroupItem>
          <h2>Оставить отзыв</h2>
          {errorProductReview && <Message variant="secondary">{errorProductReview}</Message> }
          {isLoggedIn ? (
            reviewForm()
          ) : (
            <Message>
              Вам необходимо
              {' '}
              <Link className="inline-link" to={`/login?redirect=product/${productId}`}>авторизоваться</Link>
              {' '}
              для написания отзыва
            </Message>
          )}
        </ListGroupItem>
      </ListGroup>
    </>
  );
};

export default ReviewsSection;
