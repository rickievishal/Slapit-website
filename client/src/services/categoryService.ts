import { api } from './api';
import { Category } from '../types';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const res = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return res.data.data;
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await api.post<{ success: boolean; data: Category }>('/categories', data);
    return res.data.data;
  },
};
