import React, { useEffect, useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { ListGroupItem } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import LoaderSpinner from '../LoaderSpinner';

import { getOrderDetails, payOrder } from '../../actions/orderAction';
import { ORDER_PAY_PROCESS_RESET } from '../../constants/orderConstants';

// dynamically adding PayPal script
const addPayPalScript = async (setSdkReady) => {
  const { data: clientId } = await axios.get('/paypal/config');
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;

  // when script (SDK) has been loaded
  script.onload = () => {
    setSdkReady(true);
  };

  document.body.appendChild(script);
};

const PaypalButton = ({ orderId, orderIsPaid, orderPrice }) => {
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);

  const {
    loading: loadingPay, success: successPay,
  } = useSelector((state) => state.orderPayProcess);

  useEffect(() => {
    // reload order details when order has been paid
    if (successPay) {
      dispatch({ type: ORDER_PAY_PROCESS_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!orderIsPaid) {
      (!window.paypal) ? addPayPalScript(setSdkReady) : setSdkReady(true);
    }
  }, [dispatch, successPay, orderIsPaid, orderPrice]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  return (
    <>
      {!orderIsPaid && (
      <ListGroupItem>
        {loadingPay && <LoaderSpinner pageCenter />}
        {!sdkReady
          ? <LoaderSpinner pageCenter />
          : <PayPalButton amount={orderPrice} onSuccess={successPaymentHandler} />}
      </ListGroupItem>
      )}
    </>
  );
};

export default PaypalButton;
