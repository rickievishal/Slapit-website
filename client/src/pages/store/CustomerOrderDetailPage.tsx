import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuthStore } from '../../store/authStore';
import { Order } from '../../types';
import { formatDate, formatPrice } from '../../utils/formatters';
import { getImageUrl } from '../../utils/imageUrl';
import { orderService } from '../../services/orderService';

export const CustomerOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !isAuthenticated || user?.role !== 'customer') return;

    let active = true;
    orderService
      .getMyOrderById(id)
      .then((result) => {
        if (active) setOrder(result);
      })
      .catch((requestError: any) => {
        if (active) {
          setError(
            requestError.response?.status === 404
              ? 'We could not find that order in your account.'
              : requestError.response?.data?.message || 'Could not load order details.'
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isAuthenticated, user?.role]);

  if (isCheckingAuth) {
    return <div className="py-16 text-center font-bold">Checking your account...</div>;
  }

  if (!isAuthenticated || !user) return <Navigate to="/account/login" replace />;
  if (user.role !== 'customer') return <Navigate to="/admin/dashboard" replace />;

  return (
    <section className="min-h-[65vh] bg-[#FAFAFA] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/account/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to order history
        </Link>

        {isLoading ? (
          <div className="border-2 border-black bg-white p-8 text-center font-bold">
            Loading order details...
          </div>
        ) : error ? (
          <div className="space-y-4 border-2 border-red-600 bg-white p-8 text-center">
            <p role="alert" className="font-bold text-red-700">{error}</p>
            <Link to="/account/orders">
              <Button variant="outline">Back to order history</Button>
            </Link>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <header className="flex flex-col justify-between gap-4 border-b-2 border-black pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Order details
                </p>
                <h1 className="mt-1 text-3xl font-black uppercase tracking-tight">
                  {order.orderNumber}
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Placed {formatDate(order.createdAt)}
                </p>
              </div>
              <StatusBadge status={order.orderStatus} />
            </header>

            <div className="grid gap-6 md:grid-cols-[1fr_320px]">
              <section className="border-2 border-black bg-white p-5 shadow-[3px_3px_0px_0px_#000000]">
                <h2 className="mb-4 border-b border-neutral-200 pb-3 text-sm font-black uppercase tracking-wider">
                  Items ({order.items.length})
                </h2>
                <div className="divide-y divide-neutral-200">
                  {order.items.map((item, index) => (
                    <div key={`${item.productId}-${item.size}-${index}`} className="flex gap-4 py-4">
                      <div className="h-24 w-16 shrink-0 overflow-hidden border border-black bg-neutral-100">
                        <img
                          src={getImageUrl(item.image || 'https://placehold.co/160x240/1a1a1a/5CE1E6?text=Poster')}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{item.productName}</h3>
                          <p className="mt-1 text-xs text-neutral-500">
                            Size: {item.size} · Quantity: {item.quantity}
                          </p>
                          <p className="mt-2 text-xs text-neutral-500">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                        <p className="whitespace-nowrap text-sm font-black">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t-2 border-black pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-bold">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-bold">{formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-black">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <p className="pt-1 text-xs text-neutral-500">
                    Payment status: <span className="font-bold capitalize">{order.paymentStatus}</span>
                  </p>
                </div>
              </section>

              <aside className="space-y-5">
                <section className="border-2 border-black bg-white p-5 shadow-[3px_3px_0px_0px_#000000]">
                  <h2 className="mb-3 text-sm font-black uppercase tracking-wider">Delivery address</h2>
                  <div className="space-y-1 text-sm text-neutral-700">
                    <p className="font-bold text-black">{order.customer.name}</p>
                    <p>{order.customer.email}</p>
                    <p>{order.customer.phone}</p>
                    <p className="pt-2">{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>
                </section>

                <section className="border-2 border-black bg-white p-5 shadow-[3px_3px_0px_0px_#000000]">
                  <h2 className="mb-3 text-sm font-black uppercase tracking-wider">Order status</h2>
                  <StatusBadge status={order.orderStatus} />
                  <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                    Your order status is updated as it moves through fulfillment.
                  </p>
                </section>
              </aside>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
