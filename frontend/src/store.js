import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  productCreateReducer,
  productCreateReviewReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productUpdateReducer,
  uploadProductPictureReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import {
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from './reducers/userReducers';
import { shippingReducer } from './reducers/shippingReducer';
import { paymentReducer } from './reducers/paymentReducers';
import {
  orderCreateReducer, orderDeliveryProcessReducer,
  orderDetailsReducer,
  orderListCustomerReducer,
  orderListReducer,
  orderPayProcessReducer,
} from './reducers/orderReducers';

// State slice names (productList, productDetails ...)
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  uploadProductPicture: uploadProductPictureReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productCreateReview: productCreateReviewReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  shipping: shippingReducer,
  payment: paymentReducer,
  orderList: orderListReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPayProcess: orderPayProcessReducer,
  orderDeliveryProcess: orderDeliveryProcessReducer,
  orderListCustomer: orderListCustomerReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
});

// fetch from the local storage
const fetchCartData = () => {
  const cartDataFromStorage = localStorage.getItem('cartItems');
  if (cartDataFromStorage) {
    return JSON.parse(cartDataFromStorage);
  }
  return [];
};

const fetchUserInfo = () => {
  const userInfoFromStorage = localStorage.getItem('userInfo');
  if (userInfoFromStorage) {
    return JSON.parse(userInfoFromStorage);
  }
  return null;
};

const fetchShippingAddress = () => {
  const shippingAddressFromStorage = localStorage.getItem('shippingAddress');
  if (shippingAddressFromStorage) {
    return JSON.parse(shippingAddressFromStorage);
  }
  return null;
};

const fetchPaymentMethod = () => {
  const paymentMethodFromStorage = localStorage.getItem('paymentMethod');
  if (paymentMethodFromStorage) {
    return JSON.parse(paymentMethodFromStorage);
  }
  return null;
};

const initialState = {
  cart: { cartItems: fetchCartData() },
  userLogin: { userInfo: fetchUserInfo() },
  shipping: { shippingAddress: fetchShippingAddress() },
  payment: { paymentMethod: fetchPaymentMethod() },
};
const middleware = [thunk];

const store = createStore(reducer, initialState,
  composeWithDevTools(applyMiddleware(...middleware)));

export default store;
