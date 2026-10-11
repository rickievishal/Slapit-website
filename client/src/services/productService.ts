import { api } from './api';
import { Product, PaginatedResponse } from '../types';

export const productService = {
  async getProducts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    status?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Product>> {
    const res = await api.get<PaginatedResponse<Product>>('/products', { params });
    return res.data;
  },

  async getFeaturedProducts(limit = 3): Promise<Product[]> {
    const res = await api.get<{ success: boolean; data: Product[] }>('/products/featured', {
      params: { limit },
    });
    return res.data.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await api.get<{ success: boolean; data: Product }>(`/products/${slug}`);
    return res.data.data;
  },

  async getRelatedProducts(id: string, limit = 4): Promise<Product[]> {
    const res = await api.get<{ success: boolean; data: Product[] }>(`/products/${id}/related`, {
      params: { limit },
    });
    return res.data.data;
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await api.post<{ success: boolean; data: Product }>('/products', data);
    return res.data.data;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await api.put<{ success: boolean; data: Product }>(`/products/${id}`, data);
    return res.data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async updateStatus(id: string, status: 'draft' | 'published'): Promise<Product> {
    const res = await api.patch<{ success: boolean; data: Product }>(`/products/${id}/status`, { status });
    return res.data.data;
  },
};
