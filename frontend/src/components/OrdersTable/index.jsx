import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../Message';
import LoaderSpinner from '../LoaderSpinner';
import { CrossIcon } from '../IconsForTable';

import useAdaptiveCell from '../../helpers/AdaptiveTable';
import { toCurrency, toDateTime } from '../../helpers/data';
import { CURRENCY, DATE_TIME_FORMAT } from '../../helpers/constants';

import { listCustomerOrder } from '../../actions/orderAction';

const OrdersTable = () => {
  const dispatch = useDispatch();

  const orderListCustomer = useSelector((state) => state.orderListCustomer);
  const { loading, error, ordersData } = orderListCustomer;
  const orders = ordersData?.orders || [];

  const { onClickCellHandler, adaptiveCell } = useAdaptiveCell();

  useEffect(() => {
    dispatch(listCustomerOrder());
  }, []);

  const getOrdersContent = () => {
    if (loading) {
      return (
        <LoaderSpinner center />
      );
    }
    if (error) return <Message variant="danger">{error}</Message>;
    if (!orders && !orders.length) return <Message variant="secondary">Заказов нет!</Message>;
    return (
      <Table striped bordered hover responsive className="table-adaptive">
        <thead>
          <tr>
            <th>ID</th>
            <th>ДАТА</th>
            <th>ИТОГО</th>
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
              <td>
                {toDateTime(order.createdAt, DATE_TIME_FORMAT.SHORT)}
              </td>
              <td>{toCurrency(order.totalPrice, CURRENCY.USD)}</td>
              <td className="td-center">
                {order.isPaid ? toDateTime(order.paidAt, DATE_TIME_FORMAT.SHORT)
                  : <CrossIcon /> }
              </td>
              <td className="td-center">
                {order.isDelivered ? toDateTime(order.deliveredAt, DATE_TIME_FORMAT.SHORT)
                  : <CrossIcon /> }
              </td>
              <td className="td-center">
                <LinkContainer to={`orders/${order._id}`}>
                  <Button className="btn-table" variant="light">Детали</Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      {getOrdersContent()}
    </>
  );
};

export default OrdersTable;
