import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { useHistory } from 'react-router-dom';

import DefaultLayout from '../../layout/Default';
import Message from '../../components/Message';
import { CrossIcon } from '../../components/IconsForTable';
import LoaderSpinner from '../../components/LoaderSpinner';

import { toCurrency, toDateTime } from '../../helpers/data';
import { CURRENCY, DATE_TIME_FORMAT } from '../../helpers/constants';
import useAdaptiveCell from '../../helpers/AdaptiveTable';

import { listOrders } from '../../actions/orderAction';

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { onClickCellHandler, adaptiveCell } = useAdaptiveCell();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  const getTableUserList = () => {
    if (loading) return <LoaderSpinner pageCenter />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (orders) {
      return (
        <Table striped bordered hover responsive className="table-adaptive">
          <thead>
            <tr>
              <th>ID</th>
              <th>ИМЯ</th>
              <th>ДАТА</th>
              <th>СУММА</th>
              <th className="td-center">ОПЛАЧЕНО</th>
              <th className="td-center">ДОСТАВЛЕНО</th>
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td
                  className={adaptiveCell(order._id)}
                  onClick={() => onClickCellHandler(order._id)}
                  onKeyPress={() => onClickCellHandler(order._id)}
                >
                  {order._id}
                </td>
                <td>{order.user && order.user.name}</td>
                <td>{ toDateTime(order.createdAt, DATE_TIME_FORMAT.SHORT)}</td>
                <td>{toCurrency(order.totalPrice, CURRENCY.DEFAULT)}</td>
                <td className="td-center">
                  {order.isPaid
                    ? (toDateTime(order.paidAt, DATE_TIME_FORMAT.SHORT))
                    : <CrossIcon />}
                </td>
                <td className="td-center">
                  {order.isDelivered
                    ? (toDateTime(order.deliveredAt, DATE_TIME_FORMAT.SHORT))
                    : <CrossIcon />}
                </td>
                <td className="td-center">
                  <LinkContainer to={`/orders/${order._id}`}>
                    <Button variant="link" className="btn-table">
                      Детали
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
    return <></>;
  };

  return (
    <DefaultLayout>
      <h1>Заказы</h1>
      {getTableUserList()}
    </DefaultLayout>
  );
};

export default OrderListScreen;
