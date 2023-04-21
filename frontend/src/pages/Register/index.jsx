import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import DefaultLayout from '../../layout/Default';
import AuthorizationScreenWrapper from '../../components/AuthorizationScreenWrapper';
import FormGroupBorderless from '../../components/formElements/FormGroupBorderless';
import LoaderSpinner from '../../components/LoaderSpinner';
import Message from '../../components/Message';

import WelcomeLogoRegistration from '../../svg/welcomeLogoRegistration';

import useInputAutocomplete from '../../hooks/useInputAutocomplete';
import { register } from '../../actions/userActions';

const Register = () => {
  const history = useHistory();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  useInputAutocomplete(passwordRef, 'new-password');
  useInputAutocomplete(confirmPasswordRef, 'new-password');

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo: userRegisteredInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userRegisteredInfo) {
      history.push(redirect);
    }
  }, [dispatch, history, userRegisteredInfo, redirect]);

  const submitHandler = (e) => {
    setMessage(null);
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают!');
    } else {
      dispatch(register(name, email, password));
    }
  };

  const loginFormContent = () => {
    if (loading) {
      return (
        <>
          <LoaderSpinner pageCenter />
        </>
      );
    }

    if (!userRegisteredInfo) {
      return (
        <>
          { message && <Message variant="danger">{message}</Message>}
          { error && <Message variant="danger">{error}</Message>}
          <AuthorizationScreenWrapper
            registerPage
            headerLogo={WelcomeLogoRegistration}
            submitAuthorizationForm={submitHandler}
            redirect={redirect}
          >
            <FormGroupBorderless
              inputValue={name}
              setInputValue={setName}
              controlId="name"
              inputType="name"
              variant="dark"
              inputPositioning="ms-0 pt-1 pt-sm-2_5"
              positioning="mt-0 mt-lg-5"
            >
              Введите имя
            </FormGroupBorderless>
            <FormGroupBorderless
              inputValue={email}
              setInputValue={setEmail}
              controlId="email"
              inputType="email"
              variant="dark"
              inputPositioning="ms-0 pt-1 pt-sm-2_5"
            >
              Введите электронную почту
            </FormGroupBorderless>
            <FormGroupBorderless
              controlId="password"
              inputValue={password}
              setInputValue={setPassword}
              inputType="password"
              variant="dark"
              inputPositioning="ms-0 pt-1 pt-sm-2_5"
              inputRef={passwordRef}
            >
              Введите пароль
            </FormGroupBorderless>
            <FormGroupBorderless
              controlId="confirmPassword"
              inputValue={confirmPassword}
              setInputValue={setConfirmPassword}
              inputType="password"
              variant="dark"
              inputPositioning="ms-0 pt-1 pt-sm-2_5"
              inputRef={confirmPasswordRef}
            >
              Повторите пароль
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

export default Register;
