import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('slapit_admin_token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('slapit_admin_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('slapit_admin_token', res.token);
      set({
        token: res.token,
        user: res.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('slapit_admin_token');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('slapit_admin_token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true });
    } catch (err) {
      localStorage.removeItem('slapit_admin_token');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));
