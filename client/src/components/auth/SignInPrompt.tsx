import React, { useCallback, useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const PROMPT_DELAY_MS = 20_000;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const isBrowsingStore = (pathname: string) =>
  pathname === '/' || pathname === '/posters' || pathname.startsWith('/posters/');

export const SignInPrompt: React.FC = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [promptCycle, setPromptCycle] = useState(0);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const { loginWithGoogle, isLoading, logout } = useAuthStore();

  const dismissPrompt = useCallback(() => {
    setIsOpen(false);
    setGoogleError(null);
    setPromptCycle((cycle) => cycle + 1);
  }, []);

  const handleGoogleSuccess = async (credential?: string) => {
    if (!credential) {
      setGoogleError('Google did not return a sign-in credential. Please try again.');
      return;
    }

    setGoogleError(null);
    try {
      await loginWithGoogle(credential, 'customer');
      const signedInUser = useAuthStore.getState().user;
      if (signedInUser?.role !== 'customer') {
        logout();
        throw new Error('This Google account is not a customer account. Please use customer sign in.');
      }
      setIsOpen(false);
      navigate('/account/orders');
    } catch (error) {
      setGoogleError(
        error instanceof Error ? error.message : 'Google sign-in failed. Please try again.'
      );
    }
  };

  useEffect(() => {
    if (
      isAuthenticated ||
      isCheckingAuth ||
      !isBrowsingStore(pathname)
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, PROMPT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, isCheckingAuth, pathname, promptCycle]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissPrompt();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dismissPrompt, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismissPrompt();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-in-prompt-title"
        aria-describedby="sign-in-prompt-description"
        className="relative w-full max-w-md border-2 border-black bg-white p-7 shadow-[6px_6px_0px_0px_#000000] sm:p-9"
      >
        <button
          type="button"
          onClick={dismissPrompt}
          className="absolute right-3 top-3 p-1 text-neutral-500 hover:text-black"
          aria-label="Close sign-in prompt"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
          Slap it. account
        </p>
        <h2
          id="sign-in-prompt-title"
          className="mt-2 text-2xl font-black uppercase tracking-tight"
        >
          Make yourself at home.
        </h2>
        <p id="sign-in-prompt-description" className="mt-2 text-sm text-neutral-600">
          Sign in to keep track of your orders and make your next visit easier.
        </p>
        {googleClientId && (
          <>
            <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase text-neutral-400">
              <span className="h-px flex-1 bg-neutral-200" />
              quick sign in
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(response) => void handleGoogleSuccess(response.credential)}
                onError={() => setGoogleError('Google sign-in failed. Please try again.')}
                text="continue_with"
                shape="rectangular"
                size="large"
                width="320"
                useOneTap={false}
                cancel_on_tap_outside
              />
            </div>
          </>
        )}
        {isLoading && (
          <p className="mt-3 text-center text-xs font-semibold text-neutral-500" role="status">
            Signing you in...
          </p>
        )}
        {googleError && (
          <p className="mt-3 border border-red-300 bg-red-50 p-2 text-xs font-semibold text-red-700" role="alert">
            {googleError}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/account/login"
            onClick={dismissPrompt}
            className="inline-flex flex-1 items-center justify-center border-2 border-black bg-[#5CE1E6] px-5 py-3 text-sm font-bold text-black shadow-[3px_3px_0px_0px_#000000] hover:bg-[#3BBFC4]"
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={dismissPrompt}
            className="border-2 border-black bg-white px-5 py-3 text-sm font-bold text-black hover:bg-neutral-50"
          >
            Keep browsing
          </button>
        </div>
      </section>
    </div>
  );
};
