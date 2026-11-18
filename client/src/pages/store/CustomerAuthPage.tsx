import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

interface CustomerAuthPageProps {
  mode: 'login' | 'register';
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const CustomerAuthPage: React.FC<CustomerAuthPageProps> = ({ mode }) => {
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
  } = useAuthStore();
  const navigate = useNavigate();
  const isRegistering = mode === 'register';

  if (isCheckingAuth) {
    return <div className="py-16 text-center font-bold">Checking your account...</div>;
  }

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/account/orders'} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/account/orders');
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credential?: string) => {
    if (!credential) {
      setError('Google did not return a sign-in credential. Please try again.');
      return;
    }

    setError(null);
    try {
      await loginWithGoogle(credential);
      navigate('/account/orders');
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] bg-[#FAFAFA] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 border-2 border-black bg-white p-7 shadow-[6px_6px_0px_0px_#000000] sm:p-9">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
            Slap it. account
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
            {isRegistering ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Sign in to see your orders and keep your poster history in one place.
          </p>
        </div>

        {error && (
          <div role="alert" className="border border-red-400 bg-red-50 p-3 text-sm font-semibold text-red-700">
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
          {isRegistering ? 'Already have an account?' : 'New to Slap it?'}{' '}
          <Link
            to={isRegistering ? '/account/login' : '/account/register'}
            className="font-bold text-black underline"
          >
            {isRegistering ? 'Sign in' : 'Create one'}
          </Link>
        </p>
      </div>
    </div>
  );
};
