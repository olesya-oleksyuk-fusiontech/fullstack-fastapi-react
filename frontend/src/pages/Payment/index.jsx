import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Col, Form, FormCheck, FormGroup, FormLabel,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import DefaultLayout from '../../layout/Default';
import CheckoutSteps from '../../components/CheckoutSteps';
import ButtonCandyPrimary from '../../components/buttons/ButtonCandyPrimary';
import UserFormContainer from '../../components/FormContainer';

import { savePaymentMethod } from '../../actions/paymentActions';
import { PAYMENT_METHOD } from '../../helpers/constants';

const PaymentScreen = () => {
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo: loggedInUser } = userLogin;

  // если в local storage есть введеная ранее адресная информация
  const shipping = useSelector((state) => state.shipping);

  useEffect(() => {
    if (!loggedInUser) {
      history.push('/login?redirect=payment');
    } else if (!shipping.shippingAddress) {
      history.push('/shipping');
    }
  }, [loggedInUser, shipping]);

  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod({
      paymentMethod,
    }));
    history.push('/placeorder');
  };

  return (
    <DefaultLayout>
      <UserFormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Способ оплаты</h1>
        <Form onSubmit={submitHandler}>
          <FormGroup className="my-4">
            <FormLabel as="legend">Выберете способ оплаты:</FormLabel>
            <Col>
              <FormCheck
                checked
                type="radio"
                label="Оплата с помощью PayPal"
                id="paypal"
                name="paymentMethod"
                value={PAYMENT_METHOD.PAYPAL}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FormCheck
                disabled
                type="radio"
                label="Оплата с помощью QIWI или дебетовой картой"
                id="qiwi"
                name="paymentMethod"
                value={PAYMENT_METHOD.QIWI}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Col>
          </FormGroup>
          <ButtonCandyPrimary type="submit">
            Далее
          </ButtonCandyPrimary>
        </Form>
      </UserFormContainer>
    </DefaultLayout>
  );
};

export default PaymentScreen;
