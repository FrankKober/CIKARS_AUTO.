'use react';
'use client';

import { useState } from 'react';
import { apiRequest } from '../lib/api';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('BUYER');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin 
      ? { email, password } 
      : { email, password, name, role };

    try {
      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        // Temporary feedback or redirect logic will go here
        alert(isLogin ? 'Logged in successfully!' : 'Registered successfully!');
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          {isLogin ? 'Access your premium automotive workspace' : 'Join the elite car marketplace'}
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-white bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-600 transition"
              placeholder="John Doe"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mt-1 text-white bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-600 transition"
            placeholder="name@domain.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mt-1 text-white bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-600 transition"
            placeholder="••••••••"
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-white bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-600 transition appearance-none"
            >
              <option value="BUYER">I want to Buy</option>
              <option value="SELLER">I want to Sell</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 text-sm font-semibold text-black bg-white rounded-xl hover:bg-neutral-200 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Get Started'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-500">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
          className="font-medium text-white underline decoration-neutral-600 hover:decoration-white transition"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </div>
    </div>
  );
}