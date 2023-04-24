import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import DefaultLayout from '../../layout/Default';
import ProductPagination from '../../components/ProductPagination';
import ProductCatalogue from '../../components/ProductCatalogue';
import NoFoundProduct from '../../components/NoFound/Product';

import { listProducts } from '../../actions/productAction';

const Home = () => {
  const dispatch = useDispatch();
  const { keyword: searchKeyword, pageNumber: pageNumberParam } = useParams();
  const pageNumber = pageNumberParam || 1;

  const productList = useSelector((state) => state.productList);
  const {
    products, loading, error, page: productPage, pages: productPages,
  } = productList;

  useEffect(() => {
    dispatch(listProducts(searchKeyword, pageNumber));
  }, [searchKeyword, pageNumber]);

  const getProductContent = () => {
    if (!loading && products.length === 0) {
      return (
        <NoFoundProduct parentBlock="product-catalogue" />
      );
    }
    return (
      <>
        <Row className="flex-grow-1 px-0 mx-0 px-md-5">
          <ProductCatalogue
            products={products}
            loading={loading}
            error={error}
          />
        </Row>
        { !loading
          && (
          <div className="home-page__product-pagination mt-3 mt-sm-0">
            <ProductPagination pages={productPages} page={productPage} keyword={searchKeyword || ''} />
          </div>
          )}
      </>
    );
  };

  return (
    <DefaultLayout>
      <h1 className="product-catalogue__header mx-0 mx-md-5 mx-xl-0">Последние продукты</h1>
      {
        getProductContent()
      }
    </DefaultLayout>
  );
};

export default Home;
