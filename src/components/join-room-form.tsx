'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateBingoCard } from '@/lib/bingo-logic';
import type { Room, Player } from '@/lib/types';
import { AuthForm } from './auth-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface JoinRoomFormProps {
  onRoomJoined: () => void;
}

export function JoinRoomForm({ onRoomJoined }: JoinRoomFormProps) {
  const { user } = useAuth();
  const [isAuthStep, setAuthStep] = useState(!user);
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !roomCode) return;
    setLoading(true);

    const code = roomCode.toUpperCase().trim();
    const roomRef = doc(db, 'rooms', code);

    try {
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        toast({ variant: 'destructive', title: 'Room not found', description: 'Please check the code and try again.' });
        setLoading(false);
        return;
      }

      const roomData = roomSnap.data() as Room;

      if (roomData.status !== 'lobby') {
        toast({ variant: 'destructive', title: 'Game in progress', description: 'This game has already started.' });
        setLoading(false);
        return;
      }
      
      const newPlayer: Player = {
        id: user.uid,
        name: user.displayName || 'Player',
        isHost: false,
        ready: false,
        card: generateBingoCard(roomData.gameItems, roomData.gridSize),
        markedCells: [],
        score: 0,
        isWinner: false,
      };

      await updateDoc(roomRef, {
        [`players.${user.uid}`]: newPlayer
      });

      toast({ title: 'Joined room!', description: 'Get ready to play.' });
      onRoomJoined();
      router.push(`/room/${code}`);

    } catch (error) {
      console.error("Error joining room: ", error);
      toast({ variant: 'destructive', title: 'Uh oh! Something went wrong.', description: 'There was a problem joining the room.' });
      setLoading(false);
    }
  };

  if (isAuthStep) {
    return <AuthForm onAuthSuccess={() => setAuthStep(false)} />;
  }

  return (
    <form onSubmit={handleJoinRoom} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="room-code">Room Code</Label>
        <Input
          id="room-code"
          placeholder="ABCDE"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="uppercase"
          maxLength={5}
          required
        />
      </div>
      <Button type="submit" disabled={loading || roomCode.length < 5}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Join Room
      </Button>
    </form>
  );
}
