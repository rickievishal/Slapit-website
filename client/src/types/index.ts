export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  tags: string[];
  sizes: string[];
  featured: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
  slug: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'placed' | 'paid' | 'printing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  _id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
}

export interface PaginatedResponse<T> {
  success: boolean;
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export interface DashboardStats {
  revenue: number;
  orders: number;
  products: number;
  customers: number;
}
