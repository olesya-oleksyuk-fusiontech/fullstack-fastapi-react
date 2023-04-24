import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form, FormControl, FormGroup, FormLabel,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import DefaultLayout from '../../layout/Default';
import CheckoutSteps from '../../components/CheckoutSteps';
import UserFormContainer from '../../components/FormContainer';
import ButtonCandyPrimary from '../../components/buttons/ButtonCandyPrimary';

import { saveShippingAddress } from '../../actions/shippmentActions';

const ShippingScreen = () => {
  const history = useHistory();

  // проверяем залогированы ли мы
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo: loggedInUser } = userLogin;

  useEffect(() => {
    if (!loggedInUser) {
      history.push('/login?redirect=shipping');
    }
  }, [loggedInUser]);

  // если в local storage есть введеная ранее адресная информация
  const shipping = useSelector((state) => state.shipping);
  const { shippingAddress } = shipping;

  const [address, setAddress] = useState(shippingAddress?.address);
  const [city, setCity] = useState(shippingAddress?.city);
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode);
  const [country, setCountry] = useState(shippingAddress?.country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({
      address, city, postalCode, country,
    }));
    history.push('/payment');
  };

  return (
    <DefaultLayout>
      <UserFormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Оформление заказа</h1>
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="address" className="my-3">
            <FormLabel>Адрес</FormLabel>
            <FormControl
              type="text"
              placeholder="Введите адрес"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="city" className="my-3">
            <FormLabel>Город</FormLabel>
            <FormControl
              type="text"
              placeholder="Введите город"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="postalCode" className="my-3">
            <FormLabel>Почтовый индекс</FormLabel>
            <FormControl
              type="text"
              placeholder="Введите индекс"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="country" className="my-3">
            <FormLabel>Страна</FormLabel>
            <FormControl
              type="text"
              placeholder="Введите название страны"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </FormGroup>
          <ButtonCandyPrimary type="submit">
            Далее
          </ButtonCandyPrimary>
        </Form>
      </UserFormContainer>
    </DefaultLayout>
  );
};

export default ShippingScreen;
