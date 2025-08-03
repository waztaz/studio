import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import BottomNav from '@/components/layout/bottom-nav';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: '매일이불 (Everyday Duvet)',
  description: '당신에게 꼭 맞는 이불을 찾아보세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-secondary")}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1 pb-16 md:pb-0">{children}</div>
          <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
