import { GameClient } from "@/components/game-client";

type RoomPageProps = {
  params: {
    roomId: string;
  };
};

export default function RoomPage({ params }: RoomPageProps) {
  return <GameClient roomId={params.roomId} />;
}
