import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button, Form, FormCheck, FormControl, FormGroup, FormLabel, Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import DefaultLayout from '../../layout/Default';
import Message from '../../components/Message';
import LoaderSpinner from '../../components/LoaderSpinner';
import UserFormContainer from '../../components/FormContainer';
import ButtonReturn from '../../components/buttons/ButtonReturn';

import { getUserDetails, updateUser } from '../../actions/userActions';
import { USER_UPDATE_RESET } from '../../constants/userConstants';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const history = useHistory();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo: loggedInUser } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  useEffect(() => {
    if (loggedInUser && loggedInUser.isAdmin) {
      if (successUpdate) {
        dispatch({ type: USER_UPDATE_RESET });
        history.push('/admin/userlist');
      } else if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    } else {
      history.push('/login');
    }
  }, [dispatch, user, userId, successUpdate, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({
      _id: userId, name, email, isAdmin,
    }));
  };

  const loginFormContent = () => {
    if (loading || loadingUpdate) {
      return (
        <>
          <LoaderSpinner pageCenter />
        </>
      );
    }

    if (error) {
      return <Message variant="danger">{error}</Message>;
    }

    if (userDetails) {
      return (
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="name" className="my-3">
            <FormLabel>Имя пользователя</FormLabel>
            <FormControl type="name" placeholder="Введите имя" value={name} onChange={(e) => setName(e.target.value)} />
          </FormGroup>
          <FormGroup controlId="email" className="my-3">
            <FormLabel>Электронная почта</FormLabel>
            <FormControl type="email" placeholder="Введите email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormGroup>
          <FormGroup controlId="isadmin" className="my-3">
            <FormCheck type="checkbox" label="Является администратором" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          </FormGroup>
          <Button type="submit" variant="primary" className="mt-3">
            Обновить
          </Button>
        </Form>
      );
    }

    return <></>;
  };

  const updateUserProgress = () => {
    if (errorUpdate) {
      return <Message variant="danger">{errorUpdate}</Message>;
    }
    return <></>;
  };

  return (
    <DefaultLayout>
      { !loadingUpdate
      && (
      <Row xs={1} sm="auto" className="mx-2 mx-sm-0">
        <div className="my-3">
          <ButtonReturn to="/admin/userlist">Вернуться</ButtonReturn>
        </div>
      </Row>
      )}
      <UserFormContainer>
        { !loadingUpdate && <h1>Редактирование</h1> }
        {updateUserProgress()}
        { !loadingUpdate && loginFormContent()}
      </UserFormContainer>
    </DefaultLayout>
  );
};

export default UserEditScreen;
