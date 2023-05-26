import {
  CURRENCY, DATE_TIME_FORMAT, LOCALES, PAYMENT_METHOD,
} from './constants';
import { baseURL } from '../actions/constants';

export const toCurrency = (number, format = CURRENCY.DEFAULT) => {
  const { curr, langFormat } = format;
  return Intl.NumberFormat(langFormat, { style: 'currency', currency: curr }).format(number);
};

export const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

export const toDateTime = ({ date: { dateStr, isUtc = false }, version, locales = LOCALES.RU }) => {
  const localTimeObj = new Date(`${dateStr}${isUtc ? 'Z' : ''}`);

  switch (version) {
    case DATE_TIME_FORMAT.LONG:
      return new Intl.DateTimeFormat(locales, { dateStyle: 'medium', timeStyle: 'short' }).format(localTimeObj);
    case DATE_TIME_FORMAT.MEDIUM:
      return new Intl.DateTimeFormat(locales, { dateStyle: 'short', timeStyle: 'short' }).format(localTimeObj);
    case DATE_TIME_FORMAT.SHORT:
      return new Intl.DateTimeFormat('ru').format(localTimeObj);
    default:
      return new Intl.DateTimeFormat('ru').format(localTimeObj);
  }
};

export const capitalize = (str) => {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const paymentMethodName = (paymentMethod) => {
  if (paymentMethod) {
    switch (paymentMethod) {
      case PAYMENT_METHOD.DEFAULT:
        return 'PayPal';
      case PAYMENT_METHOD.PAYPAL:
        return 'PayPal';
      case PAYMENT_METHOD.QIWI:
        return 'QIWI';
      default:
        return capitalize(paymentMethod);
    }
  }
  return 'не выбран';
};

export const getPicUrl = (imgPath) => `${baseURL}/${imgPath}`;
