import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BingoGameGuys',
    short_name: 'BingoGameGuys',
    description: 'Play real-time multiplayer bingo online with friends.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#8400FF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
