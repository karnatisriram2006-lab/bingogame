import { GameClient } from "@/components/game-client";

type RoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;
  return <GameClient roomId={roomId} />;
}
