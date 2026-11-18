import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { useAuthStore } from '../../store/authStore';

interface AuthPageProps {
  audience: 'admin' | 'customer';
  mode: 'login' | 'register';
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const AuthPage: React.FC<AuthPageProps> = ({ audience, mode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {
    login,
    register,
    loginWithGoogle,
    isLoading,
    isCheckingAuth,
    user,
    isAuthenticated,
    logout,
  } = useAuthStore();
  const navigate = useNavigate();
  const isRegistering = mode === 'register' && audience === 'customer';
  const isAdmin = audience === 'admin';
  const accountPath = isAdmin ? '/admin/login' : '/account/login';
  const otherAccountPath = isAdmin ? '/account/login' : '/admin/login';
  const destination = isAdmin ? '/admin/dashboard' : '/account/orders';

  if (isCheckingAuth) {
    return <div className="py-16 text-center font-bold">Checking your account...</div>;
  }

  if (isAuthenticated && user) {
    if (user.role === audience) return <Navigate to={destination} replace />;
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/account/orders'}
        replace
      />
    );
  }

  const acceptSessionForAudience = (role: string) => {
    if (role !== audience) {
      logout();
      throw new Error(
        isAdmin
          ? 'This is a customer account. Use customer sign in instead.'
          : 'This is an admin account. Use admin sign in instead.'
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      acceptSessionForAudience(useAuthStore.getState().user?.role ?? '');
      navigate(destination);
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          'Unable to sign in. Please try again.'
      );
    }
  };

  const handleGoogleSuccess = async (credential?: string) => {
    if (!credential) {
      setError('Google did not return a sign-in credential. Please try again.');
      return;
    }

    setError(null);
    try {
      await loginWithGoogle(credential, audience);
      acceptSessionForAudience(useAuthStore.getState().user?.role ?? '');
      navigate(destination);
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          'Google sign-in failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-[70vh] bg-[#FAFAFA] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 border-2 border-black bg-white p-7 shadow-[6px_6px_0px_0px_#000000] sm:p-9">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
            Slap it. {isAdmin ? 'admin portal' : 'account'}
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
            {isRegistering ? 'Create account' : isAdmin ? 'Admin sign in' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            {isAdmin
              ? 'Sign in to manage products, orders, and your storefront.'
              : 'Sign in to see your orders and keep your poster history in one place.'}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="border border-red-400 bg-red-50 p-3 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <label className="block text-xs font-bold uppercase tracking-wider">
              Name
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                className="mt-1 w-full border-2 border-black p-2.5 text-sm normal-case"
              />
            </label>
          )}
          <label className="block text-xs font-bold uppercase tracking-wider">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full border-2 border-black p-2.5 text-sm normal-case"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider">
            Password
            <input
              type="password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="mt-1 w-full border-2 border-black p-2.5 text-sm normal-case"
            />
          </label>
          <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
            {isRegistering ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <div className="flex items-center gap-3 text-[11px] font-bold uppercase text-neutral-400">
          <span className="h-px flex-1 bg-neutral-200" />
          or continue with
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        {googleClientId ? (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(response) => void handleGoogleSuccess(response.credential)}
              onError={() => setError('Google sign-in failed. Please try again.')}
              useOneTap={false}
            />
          </div>
        ) : (
          <p className="border border-neutral-200 bg-neutral-50 p-3 text-center text-xs text-neutral-600">
            Google sign-in needs `VITE_GOOGLE_CLIENT_ID` in the client environment and the same
            OAuth client ID in the server environment.
          </p>
        )}

        <p className="text-center text-sm text-neutral-600">
          {isRegistering ? 'Already have an account?' : isAdmin ? 'Shopping with us?' : 'New to Slap it?'}{' '}
          <Link
            to={
              isRegistering
                ? accountPath
                : isAdmin
                  ? otherAccountPath
                  : '/account/register'
            }
            className="font-bold text-black underline"
          >
            {isRegistering ? 'Sign in' : isAdmin ? 'Customer sign in' : 'Create one'}
          </Link>
        </p>
      </div>
    </div>
  );
};
