import axios from 'axios';
import { CART_ADD_ITEM, CART_CLEAR, CART_REMOVE_ITEM } from '../constants/cartConstants';

export const addToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      quantity,
    },
  });

  // сохранение в локальном хранилище
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  // сохранение в локальном хранилище
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const clearCart = () => async (dispatch, getState) => {
  dispatch({
    type: CART_CLEAR,
  });

  // сохранение в локальном хранилище
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};
