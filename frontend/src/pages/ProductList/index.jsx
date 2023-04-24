import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button, Col, Row, Table,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DefaultLayout from '../../layout/Default';
import Message from '../../components/Message';
import ProductPagination from '../../components/ProductPagination';
import LoaderSpinner from '../../components/LoaderSpinner';
import { EditIcon, TrashIcon } from '../../components/IconsForTable';
import ButtonCandyPrimary from '../../components/buttons/ButtonCandyPrimary';

import { CURRENCY } from '../../helpers/constants';
import { toCurrency } from '../../helpers/data';
import useAdaptiveCell from '../../helpers/AdaptiveTable';

import { createProduct, deleteProduct, listProducts } from '../../actions/productAction';

const ProductList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { onClickCellHandler, adaptiveCell } = useAdaptiveCell();

  const params = useParams();
  const pageNumber = params.pageNumber || 1;

  const productList = useSelector((state) => state.productList);
  const {
    loading, error, products, page, pages,
  } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const { error: errorDelete, success: successDelete } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);

  const {
    loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo: loggedInUser } = userLogin;

  useEffect(() => {
    if (loggedInUser && loggedInUser.isAdmin) {
      if (successCreate) {
        history.push(`/admin/product/${createdProduct._id}/edit`);
      } else {
        dispatch(listProducts('', pageNumber));
      }
    } else {
      history.push('/login');
    }
  }, [dispatch, history, loggedInUser, successDelete, successCreate, createdProduct, pageNumber]);

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const deleteHandler = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить продукт?')) {
      dispatch(deleteProduct(id));
    }
  };

  const deleteProductProgress = () => {
    if (errorDelete) {
      return <Message variant="danger">{errorCreate}</Message>;
    }
    return <></>;
  };

  const createProductProgress = () => {
    if (loadingCreate) {
      return <LoaderSpinner pageCenter />;
    }
    if (errorCreate) {
      return <Message variant="danger">{errorCreate}</Message>;
    }
    return <></>;
  };

  const getTableProductList = () => {
    if (!loadingCreate && !successCreate) {
      if (loading) {
        return (
          <LoaderSpinner pageCenter />
        );
      }
      if (error) return <Message variant="danger">{error}</Message>;
      if (products.length !== 0) {
        return (
          <>
            <div className="mb-3 mb-md-0">
              <Table striped bordered hover responsive className="table-adaptive">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>НАЗВАНИЕ</th>
                    <th>ЦЕНА</th>
                    <th>КАТЕГОРИЯ</th>
                    <th>БРЕНД</th>
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td
                        className={adaptiveCell(product._id)}
                        onClick={() => onClickCellHandler(product._id)}
                        onKeyPress={() => onClickCellHandler(product._id)}
                      >
                        {product._id}
                      </td>
                      <td>
                        {product.name}
                      </td>
                      <td>{toCurrency(product.price, CURRENCY.DEFAULT)}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td className="td-control">
                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                          <Button variant="link" size="sm" className="btn-table">
                            <EditIcon />
                          </Button>
                        </LinkContainer>
                        <Button variant="warning" size="sm" className="btn-table ms-sm-2" onClick={() => deleteHandler(product._id)}>
                          <TrashIcon />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <ProductPagination pages={pages} page={page} isAdmin />
          </>
        );
      }
    }
    return <></>;
  };

  return (
    <DefaultLayout>
      {!loadingCreate && (
      <Row className="align-items-center">
        <Col>
          <h1>Продукты</h1>
        </Col>
        <Col className="text-end">
          <ButtonCandyPrimary type="button" variant="light" className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus" />
            {' '}
            СОЗДАТЬ
          </ButtonCandyPrimary>
        </Col>
      </Row>
      )}
      {deleteProductProgress()}
      {createProductProgress()}
      {getTableProductList()}
    </DefaultLayout>
  );
};

export default ProductList;
