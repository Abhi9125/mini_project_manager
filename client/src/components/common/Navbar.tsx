'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import ThemeToggle from './ThemeToggle';
import { LayoutDashboard, LogOut, FolderKanban, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
              <FolderKanban className="h-5 w-5" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  Mini Project Manager
                </span>
                <span className="hidden sm:inline-flex rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 -mt-0.5 hidden sm:block">
                Modern Workspace
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all',
                pathname === '/dashboard' || pathname.startsWith('/projects')
                  ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100/60 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200'
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Projects</span>
            </Link>
          </nav>
        </div>

        {/* Right Section: Theme Toggle, User Profile & Logout */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
              {/* User Avatar & Info */}
              <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-slate-50/80 py-1 pl-1.5 pr-3 dark:border-white/10 dark:bg-zinc-900/60 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-[11px] font-bold text-white shadow-sm">
                  {getInitials(user.name)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-800 dark:text-zinc-200 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-none">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/60 p-2 sm:px-3 text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:border-white/10 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/20 transition-all shadow-sm"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
