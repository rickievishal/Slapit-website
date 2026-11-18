import { api } from './api';
import { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await api.post<{ success: boolean; data: { token: string; user: User } }>('/auth/login', {
      email,
      password,
    });
    return res.data.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<{ success: boolean; data: User }>('/auth/me');
    return res.data.data;
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> {
    const res = await api.post<{ success: boolean; data: { token: string; user: User } }>(
      '/auth/register',
      { name, email, password }
    );
    return res.data.data;
  },

  async loginWithGoogle(
    credential: string,
    audience: 'admin' | 'customer'
  ): Promise<{ token: string; user: User }> {
    const res = await api.post<{ success: boolean; data: { token: string; user: User } }>(
      '/auth/google',
      { credential, audience }
    );
    return res.data.data;
  },
};
