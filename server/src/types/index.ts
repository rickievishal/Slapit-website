import { Document, Types } from 'mongoose';

// ===== Product =====
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: Types.ObjectId;
  tags: string[];
  sizes: string[];
  featured: boolean;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// ===== Category =====
export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== User =====
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ===== Order =====
export interface IOrderItem {
  productId: Types.ObjectId;
  productName: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

export interface ICustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface IShippingAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'placed' | 'paid' | 'printing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrder extends Document {
  orderNumber: string;
  customer: ICustomerInfo;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

// ===== API Response =====
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
