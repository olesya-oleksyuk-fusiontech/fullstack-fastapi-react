import { SAVE_PAYMENT_METHOD } from '../constants/paymentConstants';

export const paymentReducer = (state = { paymentMethod: {} }, action) => {
  switch (action.type) {
    case SAVE_PAYMENT_METHOD: {
      return {
        ...state,
        paymentMethod: action.payload,
      };
    }
    default:
      return state;
  }
};
