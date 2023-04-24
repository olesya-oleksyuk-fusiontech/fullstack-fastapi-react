import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import DefaultLayout from '../../layout/Default';
import AuthorizationScreenWrapper from '../../components/AuthorizationScreenWrapper';
import FormGroupBorderless from '../../components/formElements/FormGroupBorderless';
import Message from '../../components/Message';
import LoaderSpinner from '../../components/LoaderSpinner';

import WelcomeLogoLogin from '../../svg/welcomeLogoLogin';
import { login } from '../../actions/userActions';

const Login = () => {
  const history = useHistory();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/home';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [dispatch, history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const loginFormContent = () => {
    if (loading) {
      return (
        <>
          <h1>Авторизация</h1>
          <LoaderSpinner pageCenter />
        </>
      );
    }

    if (!userInfo) {
      return (
        <>
          { error && (
          <Message
            variant="danger"
            styleOptions={{ marginTop: '1rem', marginBottom: '0' }}
          >
            {error}
          </Message>
          )}
          <AuthorizationScreenWrapper
            loginPage
            headerLogo={WelcomeLogoLogin}
            submitAuthorizationForm={submitHandler}
            redirect={redirect}
            humanIcon
          >
            <FormGroupBorderless
              valueAsPlaceholder
              inputValue={email}
              setInputValue={setEmail}
              controlId="email"
              inputType="email"
              variant="dark"
              positioning="mt-0"
              inputPositioning="ms-0 pt-2_5"
            >
              Электронная почта
            </FormGroupBorderless>

            <FormGroupBorderless
              controlId="password"
              inputValue={password}
              setInputValue={setPassword}
              valueAsPlaceholder
              inputType="password"
              variant="dark"
              inputPositioning="ms-0 pt-2_5"
            >
              Пароль
            </FormGroupBorderless>
          </AuthorizationScreenWrapper>
        </>
      );
    }

    return <></>;
  };

  return (
    <DefaultLayout noFooter mainContainerPaddings="p-0">
      {loginFormContent()}
    </DefaultLayout>
  );
};

export default Login;
