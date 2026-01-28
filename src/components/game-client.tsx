'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import type { Room, Player } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Lobby } from '@/components/lobby';
import { PlayerList } from '@/components/player-list';
import { BingoCard } from '@/components/bingo-card';
import { CalledItems } from '@/components/called-items';
import { Button } from '@/components/ui/button';
import { WinnerPopup } from '@/components/winner-popup';
import { checkWin, generateBingoCard } from '@/lib/bingo-logic';
import { Loader2, Copy } from 'lucide-react';
import { Separator } from './ui/separator';

export function GameClient({ roomId }: { roomId: string }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!roomId) return;
    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const roomData = doc.data() as Room;
        // If current user is no longer in the player list (e.g., was kicked)
        if (user && !roomData.players[user.uid] && room?.players[user.uid]) {
          toast({ variant: 'destructive', title: 'You have been removed from the room.' });
          router.push('/');
        }
        setRoom(roomData);
      } else {
        toast({ variant: 'destructive', title: 'Room not found' });
        router.push('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [roomId, router, toast, user, room]);

  const currentPlayer = user && room ? room.players[user.uid] : null;

  const handleReady = async () => {
    if (!user || !room) return;
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      [`players.${user.uid}.ready`]: !currentPlayer?.ready,
    });
  };

  const handleStartGame = async () => {
    if (!user || !room || user.uid !== room.hostId) return;
    if (Object.values(room.players).some(p => !p.ready)) {
        toast({ variant: 'destructive', title: 'Not all players are ready!' });
        return;
    }
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, { status: 'playing' });
  };
  
  const handleCallNext = async () => {
    if (!room || room.status !== 'playing') return;
    const allPossibleItems = room.gameType === 'numbers' 
      ? Array.from({ length: 75 }, (_, i) => i + 1)
      : room.customWords?.split(',').map(w => w.trim()).filter(Boolean) || [];
      
    const availableItems = allPossibleItems.filter(item => !room.calledItems.includes(item));
    if (availableItems.length === 0) {
        toast({ title: "All items have been called!" });
        return;
    }

    const nextItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      calledItems: [...room.calledItems, nextItem],
      currentItem: nextItem,
    });
  };
  
  const handleMarkCell = async (row: number, col: number) => {
    if (!user || !currentPlayer || room?.status !== 'playing') return;
    const isAlreadyMarked = currentPlayer.markedCells.some(cell => cell.row === row && cell.col === col);
    const newMarkedCells = isAlreadyMarked
        ? currentPlayer.markedCells.filter(cell => !(cell.row === row && cell.col === col))
        : [...currentPlayer.markedCells, { row, col }];
    
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      [`players.${user.uid}.markedCells`]: newMarkedCells
    });
  };

  const handleBingo = async () => {
    if (!user || !room || !currentPlayer) return;
    const win = checkWin(currentPlayer.card, currentPlayer.markedCells, room.gridSize);
    let isWin = false;
    switch(room.winCondition) {
        case '1_line': isWin = win.lines >= 1; break;
        case '2_lines': isWin = win.lines >= 2; break;
        case 'full_house': isWin = win.isFullHouse; break;
    }

    if (isWin) {
        toast({ title: 'BINGO!', description: 'Your win has been verified!' });
        const roomRef = doc(db, 'rooms', roomId);
        await updateDoc(roomRef, {
            status: 'finished',
            winnerId: user.uid,
            [`players.${user.uid}.isWinner`]: true
        });
    } else {
        toast({ variant: 'destructive', title: 'Not quite...', description: "Your card doesn't meet the win condition yet. Keep playing!" });
    }
  };

  const handlePlayAgain = async () => {
    if (!user || !room || user.uid !== room.hostId) return;
    const roomRef = doc(db, 'rooms', roomId);
    
    const newPlayersState: Record<string, Player> = {};
    for (const p of Object.values(room.players)) {
        newPlayersState[p.id] = {
            ...p,
            ready: p.isHost,
            card: generateBingoCard(room.gridSize, room.gameType, room.customWords),
            markedCells: [],
            isWinner: false,
        };
    }

    await updateDoc(roomRef, {
        status: 'lobby',
        calledItems: [],
        currentItem: null,
        winnerId: null,
        players: newPlayersState
    });
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (!user || !room || user.uid !== room.hostId) return;

    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      [`players.${playerId}`]: deleteField(),
    });

    toast({ title: 'Player removed', description: 'The player has been removed from the lobby.' });
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Copied to clipboard!", description: "Room link ready to be shared." });
  }

  if (loading || !room) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (room.status === 'lobby') {
    return (
      <Lobby
        room={room}
        players={Object.values(room.players)}
        isHost={user?.uid === room.hostId}
        onReady={handleReady}
        onStart={handleStartGame}
        currentPlayer={currentPlayer}
        onCopyLink={copyLink}
        onRemovePlayer={handleRemovePlayer}
      />
    );
  }

  const winner = room.winnerId ? room.players[room.winnerId] : null;

  return (
    <div className="container mx-auto p-4 lg:p-6">
       {room.status === 'finished' && winner && (
        <WinnerPopup winner={winner} isHost={user?.uid === room.hostId} onPlayAgain={handlePlayAgain} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 order-2 lg:order-1 rounded-lg bg-card p-4 shadow-sm">
          <CalledItems items={room.calledItems} />
        </aside>

        <main className="lg:col-span-2 order-1 lg:order-2 flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Called</h2>
            <p className="text-6xl md:text-8xl font-black text-primary animate-pulse">{room.currentItem || '...'}</p>
          </div>
          
          {currentPlayer && <BingoCard card={currentPlayer.card} markedCells={currentPlayer.markedCells} onMark={handleMarkCell} calledItems={room.calledItems} gridSize={room.gridSize} />}
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
             {user?.uid === room.hostId && (
                <Button size="lg" onClick={handleCallNext} disabled={room.status === 'finished'}>Call Next</Button>
            )}
            <Button size="lg" variant="destructive" onClick={handleBingo} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg" disabled={room.status === 'finished'}>
                BINGO!
            </Button>
          </div>
        </main>
        
        <aside className="lg:col-span-1 order-3 rounded-lg bg-card p-4 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Players</h3>
            <PlayerList players={Object.values(room.players)} />
            <Separator className="my-4" />
            <Button variant="outline" className="w-full" onClick={copyLink}>
                <Copy className="mr-2 h-4 w-4" /> Share Link
            </Button>
        </aside>
      </div>
    </div>
  );
}
