import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/store/provider';

export const metadata: Metadata = {
  title: 'Mini Project Manager',
  description: 'Clean, modern project and task management web application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
