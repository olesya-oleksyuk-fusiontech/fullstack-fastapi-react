import React from 'react';
import Pagination from '@vlsergey/react-bootstrap-pagination';
import { useHistory } from 'react-router-dom';

import useBreakpoints from '../../hooks/useBreakpoints';

const ProductPagination = ({
  pages, page, isAdmin = false, keyword = '',
}) => {
  const history = useHistory();

  const viewport = useBreakpoints(window);

  const getLink = (pageNumber) => {
    if (isAdmin) {
      return `/admin/productlist/${pageNumber}`;
    }
    if (keyword) {
      return `/search/${keyword}/page/${pageNumber}`;
    }
    return `/page/${pageNumber}`;
  };

  const handleChange = ({ target: { value } }) => {
    history.push(getLink(value, keyword, isAdmin));
  };

  return pages > 1 && (
    <div className={`product-pagination-${viewport}`}>
      <Pagination
        value={page}
        totalPages={pages}
        firstPageValue={1}
        onChange={handleChange}
        showFirstLast={viewport === 'xl'}
        showPrevNext={false}
        atBeginEnd={1}
      />
    </div>
  );
};

export default ProductPagination;
