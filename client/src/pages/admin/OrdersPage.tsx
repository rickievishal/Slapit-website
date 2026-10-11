import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPrice, formatDate } from '../../utils/formatters';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getAdminOrders({
        status: statusFilter || undefined,
        limit: 50,
      });
      setOrders(res.items);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus as OrderStatus } : o))
      );
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const statuses: OrderStatus[] = [
    'placed',
    'paid',
    'printing',
    'packed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Orders
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Monitor and fulfill customer poster orders
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-500 uppercase">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 text-xs font-bold bg-white border-2 border-black rounded-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFA] border-b-2 border-black font-mono uppercase text-neutral-500">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-black">
                      <Link to={`/admin/orders/${ord._id}`} className="hover:underline">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-black">{ord.customer.name}</div>
                      <div className="text-[11px] text-neutral-400">{ord.customer.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600">
                      {ord.items.length} item(s)
                    </td>
                    <td className="py-3 px-4 font-black text-black">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ord.orderStatus} />
                    </td>
                    <td className="py-3 px-4 text-neutral-500">{formatDate(ord.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="p-1 text-xs border border-black bg-white rounded-none cursor-pointer"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
