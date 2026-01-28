import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'BingoBlitz - Modern Online Bingo',
  description: 'Play real-time Bingo with friends. Create custom rooms, generate cards, and get ready to shout BINGO!',
  icons: {
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238400FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z' /%3e%3cpath d='M7.4 17.5c.5.8 1.2 1.5 2.1 1.9' /%3e%3cpath d='M11 19.5c.8.3 1.7.3 2.5 0' /%3e%3cpath d='M14.5 19.4c.8-.4 1.6-1.1 2.1-1.9' /%3e%3cpath d='M17.5 14.5c.4-.8.6-1.7.6-2.5' /%3e%3cpath d='M18.1 11.5c0-.8-.2-1.7-.6-2.5' /%3e%3cpath d='M16.6 6.5c-.5-.8-1.2-1.5-2.1-1.9' /%3e%3cpath d='M9.5 4.6c-.8.4-1.6 1.1-2.1 1.9' /%3e%3cpath d='M6.5 9.5C6.2 10.3 6 11.2 6 12' /%3e%3cpath d='M12.5 7.5h-3c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h3c1.7 0 3-1.3 3-3v-3c0-1.7-1.3-3-3-3Zm-2 1h1c.6 0 1 .4 1 1s-.4 1-1 1h-1v-2Zm2 6h-2v-2h2c.6 0 1 .4 1 1s-.4 1-1 1Z' /%3e%3c/svg%3e",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <div className="relative flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
