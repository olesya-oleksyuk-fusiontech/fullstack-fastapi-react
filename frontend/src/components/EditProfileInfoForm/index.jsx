import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Message from '../Message';
import ButtonCandyPrimary from '../buttons/ButtonCandyPrimary';
import LoaderSpinner from '../LoaderSpinner';
import FormGroupBorderless from '../formElements/FormGroupBorderless';

import useInputAutocomplete from '../../hooks/useInputAutocomplete';

import { getUserDetails, updateUserProfile } from '../../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../../constants/userConstants';

import './style.scss';

const EditProfileInfoForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else if (!user?.name || userInfo.id !== user.id) {
      dispatch(getUserDetails('profile'));
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, history, userInfo, user]);

  // удаляем сообщение об "обновлении профиля", если оно есть при уходе со страницы
  useEffect(() => function removeUpdateMessage() {
    if (success) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [history, success]);

  const submitHandler = (e) => {
    setMessage(null);
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают!');
    } else {
      dispatch(updateUserProfile({
        id: user.id, name, email, password,
      }));
    }
  };

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();

  useInputAutocomplete(nameRef, 'off');
  useInputAutocomplete(emailRef, 'off');
  useInputAutocomplete(passwordRef, 'new-password');
  useInputAutocomplete(confirmPasswordRef, 'new-password');

  const colorScheme = 'light';

  const getFormContent = () => {
    if (loading) {
      return (
        <LoaderSpinner center stylingOptions={{ marginBottom: '1rem' }} />
      );
    }
    return (
      <>
        { message && <Message variant="danger">{message}</Message>}
        { error && <Message variant="danger">{error}</Message>}
        { success && <Message variant="success">Профиль обновлён</Message>}
        <Form onSubmit={submitHandler}>
          <FormGroupBorderless
            controlId="name"
            inputValue={name}
            setInputValue={setName}
            valueAsPlaceholder
            inputType="name"
            variant={colorScheme}
            inputRef={nameRef}
            blockClass="profile-page"
          >
            Имя пользователя
          </FormGroupBorderless>
          <FormGroupBorderless
            controlId="email"
            inputValue={email}
            setInputValue={setEmail}
            valueAsPlaceholder
            inputType="email"
            variant={colorScheme}
            inputRef={emailRef}
            blockClass="profile-page"
          >
            Электронная почта
          </FormGroupBorderless>
          <FormGroupBorderless
            controlId="password"
            inputValue={password}
            setInputValue={setPassword}
            inputType="password"
            variant={colorScheme}
            inputRef={passwordRef}
            blockClass="profile-page"
          >
            Пароль
          </FormGroupBorderless>
          <FormGroupBorderless
            controlId="confirmPassword"
            inputValue={confirmPassword}
            setInputValue={setConfirmPassword}
            inputType="password"
            variant={colorScheme}
            inputRef={confirmPasswordRef}
            blockClass="profile-page"
          >
            Повторите пароль
          </FormGroupBorderless>
          <div className="edit-profile__update-btn">
            <ButtonCandyPrimary type="submit" variant="light" fullWidth>Обновить</ButtonCandyPrimary>
          </div>
        </Form>
      </>
    );
  };

  return (
    <>
      {getFormContent()}
    </>
  );
};

export default EditProfileInfoForm;
