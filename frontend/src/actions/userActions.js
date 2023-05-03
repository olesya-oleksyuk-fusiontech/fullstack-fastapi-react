import axios from 'axios';
import {
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
} from '../constants/userConstants';
import { ORDER_DETAILS_RESET, ORDER_LIST_CUSTOMER_RESET } from '../constants/orderConstants';
import { baseURL } from './constants';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const { data } = await axios.post(
      `${baseURL}/login`,
      new URLSearchParams({
        username: email,
        password,
      }),
      {
        headers: {
          accept: 'application/json',
        },
      },
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // сохраняем данные о текущем залогированном пользователе в local storage
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (e) {
    console.log(e.response?.data?.message);
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_CUSTOMER_RESET });
  dispatch({ type: ORDER_DETAILS_RESET });
  dispatch({ type: USER_LIST_RESET });
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      `${baseURL}/users`,
      { name, email, password },
      config,
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    // логгируемся автоматически, сразу после регистрации
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // сохраняем данные о текущем залогированном пользователе в local storage
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (e) {
    console.log(e.response?.data?.message);
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${userInfo?.access_token || null}`,
      },
    };

    const { data } = await axios.get(`http://localhost:8000/users/${id}`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response?.data?.message);
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const body = {
      ...(user.name && { name: user.name }),
      ...(user.email && { email: user.email }),
      ...(user.password && { password: user.password }),
    };

    const config = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${userInfo?.access_token || null}`,
      },
    };

    const { data } = await axios.patch(`${baseURL}/users/profile`, body, config);

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });

    // сохраняем данные о текущем залогированном пользователе в local storage
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (e) {
    console.log(e.response?.data?.message);
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}/users`, config);

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response?.data?.message);
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };

    await axios.put(`/api/users/delete/${id}`, {}, config);

    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (e) {
    console.log(e.response?.data?.message);
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${userInfo?.access_token || null}`,
      },
    };

    await axios.patch(`${baseURL}/users/${user.id}`, user, config);

    dispatch({ type: USER_UPDATE_SUCCESS });
  } catch (e) {
    console.log(e.response?.data?.message);
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};
