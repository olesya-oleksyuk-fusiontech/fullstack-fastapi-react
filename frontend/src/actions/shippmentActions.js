import { SAVE_SHIPPING_ADDRESS } from '../constants/shippingConstants';

// сохранение адресных данных в local storage
export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  // сохранение в локальном хранилище
  localStorage.setItem('shippingAddress', JSON.stringify(data));
};
