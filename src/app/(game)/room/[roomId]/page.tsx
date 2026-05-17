import type { Metadata } from 'next';
import { GameClient } from '@/components/game-client';

const SITE_URL = 'https://bingogameguys.vercel.app';

type RoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { roomId } = await params;

  return {
    title: `Bingo Room ${roomId} – Join the Game!`,
    description: `You've been invited to join Bingo room ${roomId} on BingoGameGuys! Jump in and play real-time online bingo with your friends.`,
    robots: {
      // Game rooms are private/dynamic – no need to index individual rooms
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${SITE_URL}/room/${roomId}`,
    },
    openGraph: {
      title: `Bingo Room ${roomId} – Join the Game!`,
      description: `You've been invited to join Bingo room ${roomId} on BingoGameGuys! Jump in and play real-time online bingo.`,
      url: `${SITE_URL}/room/${roomId}`,
      type: 'website',
    },
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;
  
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Game Room', item: `${SITE_URL}/room/${roomId}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <GameClient roomId={roomId} />
    </>
  );
}
