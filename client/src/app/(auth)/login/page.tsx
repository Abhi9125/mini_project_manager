'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLoginMutation } from '@/store/services/api';
import { setCredentials } from '@/store/slices/authSlice';
import { FolderKanban, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await login({ email, password }).unwrap();
      if (response.success && response.data) {
        dispatch(setCredentials(response.data));
        router.push('/dashboard');
      }
    } catch (err: any) {
      if (err?.status === 'FETCH_ERROR') {
        setErrorMessage(
          'Cannot connect to backend server. Please verify the Express backend is running on http://localhost:5000.'
        );
      } else {
        setErrorMessage(
          err?.data?.message || 'Invalid email or password. Please try again.'
        );
      }
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@example.com');
    setPassword('password123');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            <FolderKanban className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Mini Project & Task Management System
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={handleFillDemo}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/60 py-2 px-3 text-xs font-medium text-indigo-700 hover:bg-indigo-100/60 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Autofill Evaluator Demo Credentials</span>
            </button>
            <p className="mt-1 text-center text-[11px] text-gray-400">
              admin@example.com / password123
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
