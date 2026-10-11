import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { StoreLayout } from '../components/layout/StoreLayout';
import { HomePage } from '../pages/store/HomePage';
import { PostersPage } from '../pages/store/PostersPage';
import { ProductPage } from '../pages/store/ProductPage';
import { CheckoutPage } from '../pages/store/CheckoutPage';

import { LoginPage } from '../pages/admin/LoginPage';
import { AdminLayout } from '../components/admin/AdminLayout';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { ProductsPage } from '../pages/admin/ProductsPage';
import { ProductFormPage } from '../pages/admin/ProductFormPage';
import { OrdersPage } from '../pages/admin/OrdersPage';
import { OrderDetailPage } from '../pages/admin/OrderDetailPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  // Public Storefront Routes
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'posters', element: <PostersPage /> },
      { path: 'posters/:slug', element: <ProductPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
    ],
  },

  // Admin Login
  {
    path: '/admin/login',
    element: <LoginPage />,
  },

  // Admin Dashboard & CMS
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id', element: <ProductFormPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      {
        path: 'customers',
        element: (
          <div className="p-8 bg-white border-2 border-black font-bold text-center">
            Customer management portal is synced from checkout submissions.
          </div>
        ),
      },
      {
        path: 'analytics',
        element: (
          <div className="p-8 bg-white border-2 border-black font-bold text-center">
            Detailed sales & geographic analytics will appear here as store traffic grows.
          </div>
        ),
      },
      {
        path: 'settings',
        element: (
          <div className="p-8 bg-white border-2 border-black font-bold text-center">
            Store configuration & payment gateway keys.
          </div>
        ),
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
