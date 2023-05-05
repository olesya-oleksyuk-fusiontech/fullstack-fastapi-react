import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_FINISH,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELIVERY_PROCESS_FAIL,
  ORDER_DELIVERY_PROCESS_REQUEST,
  ORDER_DELIVERY_PROCESS_RESET,
  ORDER_DELIVERY_PROCESS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_RESET,
  ORDER_DETAILS_SUCCESS,
  ORDER_LIST_CUSTOMER_FAIL,
  ORDER_LIST_CUSTOMER_REQUEST,
  ORDER_LIST_CUSTOMER_RESET,
  ORDER_LIST_CUSTOMER_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_RESET,
  ORDER_LIST_SUCCESS,
  ORDER_PAY_PROCESS_FAIL,
  ORDER_PAY_PROCESS_REQUEST,
  ORDER_PAY_PROCESS_RESET,
  ORDER_PAY_PROCESS_SUCCESS,
} from '../constants/orderConstants';

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {
        loading: true,
      };
    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };
    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_CREATE_FINISH:
      return {
        ...state,
        success: false,
      };
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { }, action,
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const orderPayProcessReducer = (state = { }, action) => {
  switch (action.type) {
    case ORDER_PAY_PROCESS_REQUEST:
      return {
        loading: true,
      };
    case ORDER_PAY_PROCESS_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_PAY_PROCESS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_PAY_PROCESS_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDeliveryProcessReducer = (state = { }, action) => {
  switch (action.type) {
    case ORDER_DELIVERY_PROCESS_REQUEST:
      return {
        loading: true,
      };
    case ORDER_DELIVERY_PROCESS_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_DELIVERY_PROCESS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_DELIVERY_PROCESS_RESET:
      return {};
    default:
      return state;
  }
};

export const orderListCustomerReducer = (
  state = { orders: [] }, action,
) => {
  switch (action.type) {
    case ORDER_LIST_CUSTOMER_REQUEST:
      return {
        loading: true,
      };
    case ORDER_LIST_CUSTOMER_SUCCESS:
      return {
        loading: false,
        ordersData: action.payload,
      };
    case ORDER_LIST_CUSTOMER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_LIST_CUSTOMER_RESET:
      return { orders: [] };
    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { loading: true };
    case ORDER_LIST_SUCCESS:
      return { loading: false, ordersData: action.payload };
    case ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_LIST_RESET:
      return { orders: [] };
    default:
      return state;
  }
};
