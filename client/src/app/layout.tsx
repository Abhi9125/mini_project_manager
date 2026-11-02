import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/store/provider';

export const metadata: Metadata = {
  title: 'Mini Project Manager — Modern Workspace',
  description: 'Clean, modern project and task management web application inspired by Aceternity UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
