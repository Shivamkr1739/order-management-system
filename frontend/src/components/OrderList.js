import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '../api';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await fetchOrders();
    setOrders(data);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  const handleCancel = async (orderId) => {
    const confirmCancel = window.confirm("Cancel this order?");
    if (!confirmCancel) return;

    await updateOrderStatus(orderId, 'cancelled');
    loadOrders();
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'total_amount') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }

    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <h2>Orders</h2>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th onClick={() => handleSort('quantity')}>Qty</th>
            <th onClick={() => handleSort('total_amount')}>Total</th>
            <th>Status</th>
            <th onClick={() => handleSort('created_at')}>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedOrders.map((order, index) => (
            <tr key={index}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td>{order.total_amount}</td>

              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>

              <td>{new Date(order.created_at).toLocaleDateString()}</td>

              <td>
                {order.status !== 'cancelled' && (
                  <button onClick={() => handleCancel(order.id)}>
                    Cancel
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;