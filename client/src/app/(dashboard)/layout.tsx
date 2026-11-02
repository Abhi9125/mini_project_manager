'use client';

import React from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Navbar from '@/components/common/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-[#09090b] transition-colors overflow-hidden">
        {/* Aceternity Ambient Background Dots & Subtle Glow */}
        <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
        
        {/* Soft Ambient Radial Lights */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/5 blur-[120px] dark:from-indigo-600/15 dark:via-purple-600/10 dark:to-transparent" />

        <Navbar />

        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
