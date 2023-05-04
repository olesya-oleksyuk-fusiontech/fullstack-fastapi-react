import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import DefaultLayout from '../../layout/Default';
import Message from '../../components/Message';
import Receipt from '../../components/Receipt';
import OrderInfo from '../../components/OrderInfo';
import LoaderSpinner from '../../components/LoaderSpinner';

import { CURRENCY } from '../../helpers/constants';

import { deliverOrder, getOrderDetails } from '../../actions/orderAction';
import { ORDER_DELIVERY_PROCESS_RESET } from '../../constants/orderConstants';

const OrderOverviewPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id: orderId } = useParams();

  const { order, loading, error } = useSelector((state) => state.orderDetails);

  const {
    loading: loadingDelivery,
    success: successDelivery,
  } = useSelector((state) => state.orderDeliveryProcess);

  // проверяем залогированы ли мы
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo: loggedInUser } = userLogin;

  useEffect(() => {
    if (!loggedInUser) {
      history.push(`/login?redirect=orders/${orderId}`);
    } else if (!order || successDelivery || order.id !== +orderId) {
      dispatch(getOrderDetails(orderId));
      dispatch({ type: ORDER_DELIVERY_PROCESS_RESET });
    }
  }, [loggedInUser, order, orderId, successDelivery]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  const getContent = () => {
    if (loading) {
      return <LoaderSpinner pageCenter />;
    }
    if (error) {
      return <Message variant="danger">{error}</Message>;
    }
    if (order) {
      return (
        <>
          <h1 className="d-flex flex-wrap">
            <span> Номер заказа:</span>
            <span className="ms-3 orderId">{order._id}</span>
          </h1>
          <Row>
            <Col md={8}>
              <OrderInfo
                orderId={orderId}
                isOrderPlaced
                customerName={order.user.name}
                customerEmail={order.user.email}
                isDelivered={order.isDelivered}
                isPaid={order.isPaid}
                paidAt={order.paidAt}
                deliveredAt={order.deliveredAt}
                items={order.orderItems}
                shippingStreet={order.shippingAddress.address}
                shippingCity={order.shippingAddress.city}
                shippingPostalCode={order.shippingAddress.postalCode}
                shippingCountry={order.shippingAddress.country}
                paymentMethod={order.paymentMethod}
              />
            </Col>
            <Col md={4}>
              <Receipt
                orderId={orderId}
                adminAccess={loggedInUser.isAdmin}
                isPaid={order.isPaid}
                totalProductPrice={order.itemsPrice}
                shippingPrice={order.shippingPrice}
                totalPrice={order.totalPrice}
                currency={CURRENCY.DEFAULT}
                paymentMethod={order.paymentMethod}
                isDelivered={order.isDelivered}
                loadingProgressDeliver={loadingDelivery}
                deliverHandler={deliverHandler}
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
      {getContent()}
    </DefaultLayout>
  );
};

export default OrderOverviewPage;
