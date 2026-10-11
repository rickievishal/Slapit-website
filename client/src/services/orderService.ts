import { api } from './api';
import { Order, PaginatedResponse, DashboardStats } from '../types';

export const orderService = {
  async createOrder(data: {
    customer: { name: string; email: string; phone: string };
    items: { productId: string; size: string; quantity: number }[];
    shippingAddress: { address: string; city: string; state: string; pincode: string };
  }): Promise<Order> {
    const res = await api.post<{ success: boolean; data: Order }>('/orders', data);
    return res.data.data;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const res = await api.get<{ success: boolean; data: Order }>(`/orders/track/${orderNumber}`);
    return res.data.data;
  },

  async getAdminOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<PaginatedResponse<Order>> {
    const res = await api.get<PaginatedResponse<Order>>('/orders/admin', { params });
    return res.data;
  },

  async getAdminOrderById(id: string): Promise<Order> {
    const res = await api.get<{ success: boolean; data: Order }>(`/orders/admin/${id}`);
    return res.data.data;
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const res = await api.patch<{ success: boolean; data: Order }>(`/orders/admin/${id}/status`, { status });
    return res.data.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await api.get<{ success: boolean; data: DashboardStats }>('/orders/admin/stats');
    return res.data.data;
  },
};
