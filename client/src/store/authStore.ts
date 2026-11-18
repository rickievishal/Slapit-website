import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AUTH_TOKEN_KEY = 'slapit_auth_token';
const LEGACY_TOKEN_KEY = 'slapit_admin_token';
const getStoredToken = () =>
  localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

export const useAuthStore = create<AuthState>((set) => ({
  token: getStoredToken(),
  user: null,
  isAuthenticated: !!getStoredToken(),
  isLoading: false,
  isCheckingAuth: !!getStoredToken(),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authService.login(email, password);
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
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

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await authService.register(name, email, password);
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
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

  loginWithGoogle: async (credential) => {
    set({ isLoading: true });
    try {
      const res = await authService.loginWithGoogle(credential);
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
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
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  },

  checkAuth: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ isAuthenticated: false, user: null, isCheckingAuth: false });
      return;
    }
    try {
      const user = await authService.getMe();
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      set({ token, user, isAuthenticated: true });
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      set({ token: null, user: null, isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
