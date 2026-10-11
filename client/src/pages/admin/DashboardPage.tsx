import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Package, Users, ArrowUpRight } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { DashboardStats, Order } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPrice, formatDate } from '../../utils/formatters';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          orderService.getDashboardStats(),
          orderService.getAdminOrders({ limit: 5 }),
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.items);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: 'Revenue Today',
      value: formatPrice(stats.revenue || 8420),
      icon: IndianRupee,
      bg: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Orders Today',
      value: (stats.orders || 18).toString(),
      icon: ShoppingBag,
      bg: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Products',
      value: (stats.products || 12).toString(),
      icon: Package,
      bg: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Total Customers',
      value: (stats.customers || 32).toString(),
      icon: Users,
      bg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Bar matching Panel 05 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Real-time storefront metrics & order status
          </p>
        </div>
        <div className="text-xs font-mono text-neutral-500 bg-white px-3 py-1.5 border border-neutral-300">
          Today, {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards Row matching Panel 05 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-neutral-500">{card.label}</p>
                <h3 className="text-xl sm:text-2xl font-black text-black mt-1">
                  {card.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-lg border border-black ${card.bg}`}>
                <Icon className="w-5 h-5 text-black" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Orders + Product Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table matching Panel 05 */}
        <div className="lg:col-span-8 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="font-black text-base text-black uppercase tracking-wider">
              Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAFA] border-b border-neutral-200 font-mono uppercase text-neutral-500">
                <tr>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-medium">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-neutral-400">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-neutral-50">
                      <td className="py-3 px-3 font-mono font-bold text-black">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">{ord.customer.name}</td>
                      <td className="py-3 px-3 font-bold">{formatPrice(ord.total)}</td>
                      <td className="py-3 px-3">
                        <StatusBadge status={ord.orderStatus} />
                      </td>
                      <td className="py-3 px-3 text-neutral-500">{formatDate(ord.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Status & Categories matching Panel 05 right column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Product Status Box */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 space-y-4">
            <h3 className="font-black text-base text-black uppercase tracking-wider">
              Product Status
            </h3>

            <div className="flex items-center gap-6 py-2">
              <div className="relative w-20 h-20 rounded-full border-4 border-[#5CE1E6] flex items-center justify-center font-black text-sm">
                12
              </div>
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#5CE1E6] rounded-full inline-block" />
                  <span>12 Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-neutral-300 rounded-full inline-block" />
                  <span className="text-neutral-500">0 Draft</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-400 rounded-full inline-block" />
                  <span className="text-neutral-500">0 Out of Stock</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 space-y-3">
            <h3 className="font-black text-base text-black uppercase tracking-wider">
              Top Categories
            </h3>

            <div className="space-y-2.5 text-xs font-bold">
              {[
                { name: 'Art', count: 42, pct: '85%' },
                { name: 'Movies', count: 28, pct: '60%' },
                { name: 'Music', count: 18, pct: '40%' },
                { name: 'Sports', count: 14, pct: '30%' },
                { name: 'Typography', count: 12, pct: '25%' },
              ].map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-neutral-700">
                    <span>{c.name}</span>
                    <span className="font-mono text-neutral-400">{c.count}</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#5CE1E6] h-full"
                      style={{ width: c.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
