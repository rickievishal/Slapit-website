import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_#5CE1E6] p-8 space-y-6">
        <div className="text-center">
          <h1 className="font-logo text-3xl font-black text-black">Slap it.</h1>
          <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 mt-1">
            Admin Access Only
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-800 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 text-sm border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
              placeholder="admin@slapit.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 text-sm border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-2 py-3"
          >
            Authenticate
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-neutral-400 font-mono">
            Demo credentials: admin@slapit.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};
