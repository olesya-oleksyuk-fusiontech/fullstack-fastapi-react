import { SAVE_PAYMENT_METHOD } from '../constants/paymentConstants';

// сохранение адресных данных в local storage
export const savePaymentMethod = ({ paymentMethod }) => async (dispatch) => {
  dispatch({
    type: SAVE_PAYMENT_METHOD,
    payload: paymentMethod,
  });

  // сохранение в локальном хранилище
  localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
};

// SAVE_PAYMENT_METHOD
