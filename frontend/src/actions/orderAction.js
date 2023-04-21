import axios from 'axios';
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELIVERY_PROCESS_FAIL,
  ORDER_DELIVERY_PROCESS_REQUEST,
  ORDER_DELIVERY_PROCESS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_LIST_CUSTOMER_FAIL,
  ORDER_LIST_CUSTOMER_REQUEST,
  ORDER_LIST_CUSTOMER_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_PAY_PROCESS_FAIL,
  ORDER_PAY_PROCESS_REQUEST,
  ORDER_PAY_PROCESS_SUCCESS,
} from '../constants/orderConstants';

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/orders', order, config);

    // data = the new (added to DB) order
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/${id}`, config);

    // data = the fetched order
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_PAY_PROCESS_REQUEST,
    });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);

    // data = the fetched order
    dispatch({
      type: ORDER_PAY_PROCESS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: ORDER_PAY_PROCESS_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const deliverOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DELIVERY_PROCESS_REQUEST,
    });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/orders/${orderId}/deliver`, {}, config);

    // data = the fetched order
    dispatch({
      type: ORDER_DELIVERY_PROCESS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: ORDER_DELIVERY_PROCESS_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

// it knows who we are by our token
export const listCustomerOrder = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_CUSTOMER_REQUEST,
    });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/orders/myorders', config);

    // data = the fetched order
    dispatch({
      type: ORDER_LIST_CUSTOMER_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: ORDER_LIST_CUSTOMER_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/orders', config);

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};
