import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPrice, formatDate } from '../../utils/formatters';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    orderService
      .getAdminOrderById(id)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      const updated = await orderService.updateOrderStatus(order._id, newStatus);
      setOrder(updated);
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

  if (isLoading) {
    return <div className="py-12 text-center text-sm font-bold">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="font-bold">Order not found</p>
        <Link to="/admin/orders" className="text-xs text-neutral-500 underline mt-2 block">
          Return to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Orders</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-mono font-bold text-neutral-400">Order Detail</span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-0.5">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={order.orderStatus} />
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="p-2 text-xs font-bold border-2 border-black bg-white rounded-none cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-6 space-y-3">
          <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500">
            Customer Information
          </h3>
          <div className="text-sm space-y-1">
            <p className="font-bold text-black">{order.customer.name}</p>
            <p className="text-neutral-600">{order.customer.email}</p>
            <p className="text-neutral-600 font-mono">{order.customer.phone}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-6 space-y-3">
          <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500">
            Shipping Address
          </h3>
          <div className="text-sm space-y-1 text-neutral-700">
            <p className="font-bold text-black">{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              <span className="font-mono font-bold">{order.shippingAddress.pincode}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Items list with price snapshots */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 space-y-4">
        <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500">
          Order Items ({order.items.length})
        </h3>

        <div className="divide-y divide-neutral-200">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-18 bg-neutral-100 border border-black overflow-hidden shrink-0">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black">{item.productName}</h4>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    Size: {item.size} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-black">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <p className="text-[11px] font-mono text-neutral-400">
                  ({formatPrice(item.price)} each)
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t-2 border-black space-y-2 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span className="font-bold text-black">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span className="font-bold text-black">{formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-black text-black pt-2 border-t border-neutral-200">
            <span>Total Amount</span>
            <span className="text-lg">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
