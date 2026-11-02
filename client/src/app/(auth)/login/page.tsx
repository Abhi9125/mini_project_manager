'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLoginMutation } from '@/store/services/api';
import { setCredentials } from '@/store/slices/authSlice';
import ThemeToggle from '@/components/common/ThemeToggle';
import { FolderKanban, Loader2, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

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
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] px-4 py-12 transition-colors overflow-hidden">
      {/* Aceternity Dot Background */}
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

      {/* Ambient Gradient Glow Spheres */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-[130px]" />

      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          {/* <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-glow">
            <FolderKanban className="h-7 w-7" />
          </div> */}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Sign in to manage your projects, boards, and workflows
          </p>
        </div>

        {/* Glass Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-2xl">
          {errorMessage && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-600 dark:text-red-400 leading-relaxed">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative group mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 py-2.5 px-4 text-xs font-semibold text-white shadow-glow transition-all duration-200 hover:opacity-95 hover:shadow-indigo-500/30 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 border-t border-slate-200/70 pt-5 dark:border-white/10">
            <button
              type="button"
              onClick={handleFillDemo}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/70 py-2 px-3 text-xs font-medium text-indigo-700 hover:bg-indigo-100/70 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Autofill Evaluator Demo Credentials</span>
            </button>
            <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-zinc-500">
              admin@example.com • password123
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
