import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 – Page Not Found | BingoBlitz',
  description: "Oops! The page you're looking for doesn't exist. Head back to BingoBlitz and start a new bingo game with friends.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        {/* Big bingo-styled 404 */}
        <div
          aria-hidden="true"
          className="text-9xl font-black bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text select-none"
        >
          404
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Page Not Found</h1>

        <p className="text-muted-foreground text-lg">
          Looks like this bingo square is empty! The page you&apos;re looking for doesn&apos;t
          exist or has been moved.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
