import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useAuthStore } from '../../store/authStore';
import { Order, PaginatedResponse } from '../../types';
import { formatDate, formatPrice } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';

export const CustomerOrdersPage: React.FC = () => {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
  const [orders, setOrders] = useState<PaginatedResponse<Order> | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'customer') return;

    let active = true;
    orderService
      .getMyOrders({ page, limit: 20 })
      .then((result) => {
        if (active) setOrders(result);
      })
      .catch((requestError: any) => {
        if (active) {
          setError(requestError.response?.data?.message || 'Could not load your order history.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, page, user?.role]);

  if (isCheckingAuth) {
    return <div className="py-16 text-center font-bold">Checking your account...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/account/login" replace />;
  }

  if (user.role !== 'customer') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const changePage = (nextPage: number) => {
    setIsLoading(true);
    setError(null);
    setPage(nextPage);
  };

  return (
    <section className="min-h-[65vh] bg-[#FAFAFA] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b-2 border-black pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-500">
              Your account
            </p>
            <h1 className="mt-1 text-3xl font-black uppercase tracking-tight">Order history</h1>
            <p className="mt-1 text-sm text-neutral-600">Orders associated with {user.email}</p>
          </div>
          <Link to="/posters" className="text-sm font-bold underline">
            Continue shopping
          </Link>
        </div>

        {error && (
          <div role="alert" className="mb-5 border-2 border-red-600 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="border-2 border-black bg-white p-8 text-center font-bold">
            Loading your orders...
          </div>
        ) : orders?.items.length ? (
          <div className="space-y-4">
            {orders.items.map((order) => (
              <article
                key={order._id}
                className="grid gap-4 border-2 border-black bg-white p-5 shadow-[3px_3px_0px_0px_#000000] sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to={`/account/orders/${order._id}`}
                      className="font-mono text-sm font-black underline underline-offset-2"
                    >
                      {order.orderNumber}
                    </Link>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Placed {formatDate(order.createdAt)} · {order.items.length} item(s)
                  </p>
                  <p className="mt-3 text-sm font-semibold">
                    {order.items.map((item) => `${item.quantity} × ${item.productName}`).join(', ')}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-black">{formatPrice(order.total)}</p>
                  <p className="text-xs text-neutral-500">Payment: {order.paymentStatus}</p>
                  <Link
                    to={`/account/orders/${order._id}`}
                    className="mt-2 inline-block text-xs font-bold underline"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}

            {orders.pages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-xs font-mono font-bold">
                  Page {orders.page} of {orders.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= orders.pages}
                  onClick={() => changePage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-black bg-white p-10 text-center shadow-[4px_4px_0px_0px_#000000]">
            <h2 className="text-xl font-black">No account orders yet</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Sign in before checkout and future orders will appear here.
            </p>
            <Link to="/posters" className="mt-5 inline-block">
              <Button>Shop posters</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
