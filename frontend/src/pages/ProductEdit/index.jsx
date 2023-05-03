import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Form, FormControl, FormGroup, FormLabel, Row,
} from 'react-bootstrap';

import DefaultLayout from '../../layout/Default';
import Message from '../../components/Message';
import UserFormContainer from '../../components/FormContainer';
import LoaderSpinner from '../../components/LoaderSpinner';
import ButtonReturn from '../../components/buttons/ButtonReturn';

import { listProductDetails, updateProduct, uploadProductPicture } from '../../actions/productAction';

import { PIC_UPLOAD_RESET, PRODUCT_CREATE_RESET, PRODUCT_UPDATE_RESET } from '../../constants/productConstants';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const history = useHistory();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const dispatch = useDispatch();
  const imgInputRef = useRef();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo: loggedInUser } = userLogin;

  const createdProductInfo = useSelector((state) => state.productCreate);
  const { success: successCreate, product: createdProduct } = createdProductInfo;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading: loadingProduct, error: errorProductDetails, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  const uploadProductPic = useSelector((state) => state.uploadProductPicture);
  const {
    loading: loadingPic, success: successPic, error: errorPic, pic: loadedPic,
  } = uploadProductPic;

  const limitImageTypesToAccept = (inputFileRef) => inputFileRef.current?.setAttribute('accept', 'image/*');

  useEffect(() => {
    if (loggedInUser && loggedInUser.isAdmin) {
      imgInputRef.current && limitImageTypesToAccept(imgInputRef);

      if (successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET });
        dispatch({ type: PRODUCT_CREATE_RESET });
        history.push('/admin/productlist');
      }

      if (successCreate) {
        setName(createdProduct.name);
        setPrice(createdProduct.price);
        setImage(createdProduct.image);
        setBrand(createdProduct.brand);
        setCategory(createdProduct.category);
        setCountInStock(createdProduct.countInStock);
        setDescription(createdProduct.description);
      } else if (!product?.name || product.id !== +productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    } else {
      history.push('/login');
    }
  }, [dispatch, product, productId, history, successUpdate]);

  useEffect(() => {
    if (successPic) {
      setImage(loadedPic);
      dispatch({ type: PIC_UPLOAD_RESET });
    }
  }, [uploadProductPic, image]);

  const uploadFileHandler = async (e) => {
    const pic = e.target.files[0];
    dispatch(uploadProductPicture(pic));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProduct({
      id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    }));
  };

  const loginFormContent = () => {
    if (loadingProduct) {
      return (
        <>
          <LoaderSpinner pageCenter />
        </>
      );
    }

    if (errorProductDetails) {
      return <Message variant="danger">{errorProductDetails}</Message>;
    }

    return (
      <>
        <h1>Редактирование</h1>
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="name" className="my-3">
            <FormLabel>Название</FormLabel>
            <FormControl type="text" placeholder="Введите название" value={name} onChange={(e) => setName(e.target.value)} />
          </FormGroup>
          <FormGroup controlId="price" className="my-3">
            <FormLabel>Цена</FormLabel>
            <FormControl type="number" placeholder="Введите цену" value={price} onChange={(e) => setPrice(e.target.value)} />
          </FormGroup>
          <FormGroup controlId="image" className="my-3">
            <FormLabel>Фото</FormLabel>
            <FormControl type="text" placeholder="Введите URL-фото" value={image} onChange={(e) => setImage(e.target.value)} />
          </FormGroup>
          <Form.Group controlId="image-file" className="mb-3">
            <Form.Control type="file" size="sm" aria-label="Выберете файл" onChange={uploadFileHandler} ref={imgInputRef} />
            {loadingPic && <LoaderSpinner center stylingOptions={{ marginTop: '1rem' }} />}
            {errorPic && <Message variant="danger">{errorPic}</Message>}
            {successPic && <Message variant="success">Новое фото загружено</Message>}
          </Form.Group>
          <FormGroup controlId="brand" className="my-3">
            <FormLabel>Бренд</FormLabel>
            <FormControl type="text" placeholder="Введите бренд" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </FormGroup>
          <FormGroup controlId="countInStock" className="my-3">
            <FormLabel>Количество</FormLabel>
            <FormControl type="number" placeholder="Введите количество на складе" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
          </FormGroup>
          <FormGroup controlId="category" className="my-3">
            <FormLabel>Категория</FormLabel>
            <FormControl type="text" placeholder="Введите категорию" value={category} onChange={(e) => setCategory(e.target.value)} />
          </FormGroup>
          <FormGroup controlId="description" className="my-3">
            <FormLabel>Описание</FormLabel>
            <FormControl type="text" placeholder="Введите описание" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormGroup>
          <Button type="submit" variant="primary" className="mt-3">
            Обновить
          </Button>
        </Form>
      </>
    );
  };

  const updateProductProgress = () => {
    if (loadingUpdate) {
      return <LoaderSpinner pageCenter />;
    }
    if (errorUpdate) {
      return <Message variant="danger">{errorUpdate}</Message>;
    }
    return <></>;
  };

  return (
    <DefaultLayout>
      <Row xs={1} sm="auto" className="mx-2 mx-sm-0">
        <div
          className="my-3"
          role="button"
          tabIndex={0}
          onClick={() => {
            dispatch({ type: PRODUCT_CREATE_RESET });
            dispatch({ type: PRODUCT_UPDATE_RESET });
          }}
          onKeyDown={() => {
            dispatch({ type: PRODUCT_CREATE_RESET });
            dispatch({ type: PRODUCT_UPDATE_RESET });
          }}
        >
          <ButtonReturn to="/admin/productlist">Вернуться</ButtonReturn>
        </div>
      </Row>
      <UserFormContainer>
        {updateProductProgress()}
        {loginFormContent()}
      </UserFormContainer>
    </DefaultLayout>
  );
};

export default ProductEditScreen;
