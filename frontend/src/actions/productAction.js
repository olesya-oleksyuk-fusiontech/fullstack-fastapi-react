import axios from 'axios';
import {
  PIC_UPLOAD_FAIL,
  PIC_UPLOAD_REQUEST,
  PIC_UPLOAD_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
} from '../constants/productConstants';

const getProductListParams = ({ keyword, pageNumber }) => {
  const requestParams = new URLSearchParams();
  if (keyword) requestParams.set('keyword', keyword);
  if (pageNumber) requestParams.set('page', pageNumber);
  return requestParams.toString();
};

// action creators
export const listProducts = (keyword = '', pageNumber = '') => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    const requestParams = getProductListParams({ keyword, pageNumber });
    const { data } = await axios.get(`http://localhost:8000/products?${requestParams}`);

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message,
    });
  }
};

export const listProductDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    console.log('Bearer', userInfo?.token)

    const { data } = await axios.get(`http://localhost:8000/products/${id}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${userInfo?.token && null}`,
      },
    });

    console.log(data)


    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e)
    console.log(e.response.data.message);
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: {
        status: e.response && e.response.status ? e.response.status : 404,
        message:
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message,
      },
    });
  }
};

// it knows who we are by our token
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/products', {}, config);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config,
    );

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const uploadProductPicture = (pic) => async (dispatch) => {
  const formData = new FormData();
  // добавляем к объекту поле с именем image и значением загруженного изображения
  formData.append('image', pic);
  try {
    dispatch({
      type: PIC_UPLOAD_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const { data } = await axios.post('/api/upload', formData, config);

    dispatch({
      type: PIC_UPLOAD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: PIC_UPLOAD_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const createProductReview = (productId, review) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.post(`/api/products/${productId}/reviews`, review, config);

    dispatch({
      type: PRODUCT_CREATE_REVIEW_SUCCESS,
    });
  } catch (e) {
    console.log(e.response.data.message);
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload:
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message,
    });
  }
};
