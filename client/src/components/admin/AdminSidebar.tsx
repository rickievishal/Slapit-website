import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Products', icon: Package, path: '/admin/products' },
    { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Customers', icon: Users, path: '/admin/customers' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-[#111827] text-white shrink-0 flex flex-col justify-between border-r border-neutral-800 min-h-screen">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-neutral-800">
          <Link to="/admin/dashboard" className="block">
            <h1 className="font-logo text-2xl font-black text-white tracking-tight">
              Slap it.
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5CE1E6] mt-0.5 block">
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-[#1F2937] text-[#5CE1E6] border-l-4 border-[#5CE1E6]'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <span>View Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
