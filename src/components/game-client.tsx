'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc, deleteField, increment } from 'firebase/firestore';
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
import { checkWin, generateBingoCard, generateGameItems } from '@/lib/bingo-logic';
import { Hash, Loader2, Copy, Users } from 'lucide-react';
import { Separator } from './ui/separator';
import { Chat } from './chat';
import { cn } from '@/lib/utils';

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
        setRoom(prevRoom => {
          if (user && prevRoom && prevRoom.players[user.uid] && !roomData.players[user.uid]) {
            toast({ variant: 'destructive', title: 'You have been removed from the room.' });
            router.push('/');
            return prevRoom;
          }
          return roomData;
        });
      } else {
        toast({ variant: 'destructive', title: 'Room not found' });
        router.push('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [roomId, router, toast, user]);

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
    
    const playerIds = Object.keys(room.players).sort(() => Math.random() - 0.5);

    await updateDoc(roomRef, { 
      status: 'playing',
      playerOrder: playerIds,
      currentPlayerTurn: playerIds[0],
    });
  };
  
  const handleCellClick = async (row: number, col: number) => {
    if (!user || !currentPlayer || !room || room.status !== 'playing') return;

    const cellValue = currentPlayer.card[row * room.gridSize + col];
    if (cellValue === 'FREE') return;

    const isMyTurn = user.uid === room.currentPlayerTurn;
    const isCalled = room.calledItems.includes(cellValue);

    if (isMyTurn && !isCalled) {
        const playerOrder = room.playerOrder!;
        const currentPlayerIndex = playerOrder.indexOf(room.currentPlayerTurn!);
        const nextPlayerIndex = (currentPlayerIndex + 1) % playerOrder.length;
        const nextPlayerId = playerOrder[nextPlayerIndex];

        const roomRef = doc(db, 'rooms', roomId);
        await updateDoc(roomRef, {
            calledItems: [...room.calledItems, cellValue],
            currentItem: cellValue,
            currentPlayerTurn: nextPlayerId,
        });
    } else if (!isMyTurn) {
        toast({ variant: 'destructive', title: 'Not your turn!', description: "Please wait for your turn to call an item." });
    }
  };

  const handleBingo = async () => {
    if (!user || !room || !currentPlayer) return;

    const winResult = checkWin(currentPlayer.card, room.calledItems, room.gridSize);
    let isWin = false;

    switch (room.winCondition) {
      case '1_line':
        isWin = winResult.lines >= 1;
        break;
      case '2_lines':
        isWin = winResult.lines >= 2;
        break;
      case '3_lines':
        isWin = winResult.lines >= 3;
        break;
      case '4_lines':
        isWin = winResult.lines >= 4;
        break;
      case '5_lines':
        isWin = winResult.lines >= 5;
        break;
      case 'full_house':
        isWin = winResult.isFullHouse;
        break;
    }

    if (isWin) {
      toast({ title: 'BINGO!', description: 'Your win has been verified!' });
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        status: 'finished',
        winnerId: user.uid,
        [`players.${user.uid}.isWinner`]: true,
        [`players.${user.uid}.score`]: increment(1),
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Not a BINGO yet...',
        description: "Your card doesn't meet the win condition. Keep playing!",
      });
    }
  };

  const handlePlayAgain = async () => {
    if (!user || !room || user.uid !== room.hostId) return;
    const roomRef = doc(db, 'rooms', roomId);
    
    const newGameItems = generateGameItems(room.gridSize, room.gameType, room.customWords);
    
    const newPlayersState: Record<string, Player> = {};
    for (const p of Object.values(room.players)) {
        newPlayersState[p.id] = {
            ...p,
            ready: p.isHost,
            card: generateBingoCard(newGameItems, room.gridSize),
            isWinner: false,
        };
    }

    await updateDoc(roomRef, {
        status: 'lobby',
        calledItems: [],
        currentItem: null,
        winnerId: null,
        players: newPlayersState,
        gameItems: newGameItems,
        playerOrder: deleteField(),
        currentPlayerTurn: deleteField(),
        messages: [],
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

  const handleSettingChange = async (key: 'gridSize' | 'gameType' | 'winCondition' | 'customWords', value: any) => {
    if (!user || !room || user.uid !== room.hostId) return;

    const roomRef = doc(db, 'rooms', roomId);

    const tempSettings = {
        gridSize: room.gridSize,
        gameType: room.gameType,
        customWords: room.customWords,
        ...{ [key]: value },
    };

    const updates: Partial<Room> = { [key]: value };
    const needsCardReset = ['gridSize', 'gameType', 'customWords'].includes(key);

    if (needsCardReset) {
        if (tempSettings.gameType === 'words') {
            const wordCount = (tempSettings.customWords || '').split(',').filter(Boolean).length;
            if (wordCount < tempSettings.gridSize * tempSettings.gridSize) {
                toast({
                    variant: "destructive",
                    title: "Not enough words",
                    description: `Please provide at least ${tempSettings.gridSize * tempSettings.gridSize} words to start the game.`,
                });
            }
        }
        
        const newGameItems = generateGameItems(tempSettings.gridSize, tempSettings.gameType, tempSettings.customWords);
        updates.gameItems = newGameItems;

        const newPlayersState: Record<string, Player> = {};
        for (const p of Object.values(room.players)) {
            newPlayersState[p.id] = {
                ...p,
                ready: p.isHost, // Reset ready status for all but host
                card: generateBingoCard(newGameItems, tempSettings.gridSize),
            };
        }
        updates.players = newPlayersState;
    }
    
    await updateDoc(roomRef, updates as { [x: string]: any });
    if(needsCardReset){
        toast({ title: 'Game setting updated!', description: 'Player cards and ready status have been reset.' });
    } else {
        toast({ title: 'Game setting updated!'});
    }
  };
  
  const copyRoomCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    toast({ title: "Copied to clipboard!", description: "Room code ready to be shared." });
  }

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
        onCopyLink={copyRoomCode}
        onRemovePlayer={handleRemovePlayer}
        onSettingChange={handleSettingChange}
      />
    );
  }

  const winner = room.winnerId ? room.players[room.winnerId] : null;

  return (
    <div className="container mx-auto p-4 pb-28 lg:p-6 lg:pb-6">
       {room.status === 'finished' && winner && (
        <WinnerPopup winner={winner} isHost={user?.uid === room.hostId} onPlayAgain={handlePlayAgain} />
      )}
      <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-card/85 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Hash className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Room</p>
            <p className="font-mono text-xl font-black tracking-widest text-primary">{room.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium">
            <Users className="h-4 w-4 text-muted-foreground" />
            {Object.keys(room.players).length}
          </div>
          <Button variant="outline" className="h-10 flex-1 sm:flex-none" onClick={copyLink}>
            <Copy className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 order-2 lg:order-1 rounded-lg border bg-card/85 p-4 shadow-sm backdrop-blur">
          <CalledItems items={room.calledItems} />
        </aside>

        <main className="lg:col-span-2 order-1 lg:order-2 flex flex-col items-center gap-4">
          <div className="w-full max-w-lg rounded-lg border bg-card/85 p-4 text-center shadow-sm backdrop-blur">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Called</h2>
            <p className="mt-2 text-5xl md:text-7xl font-black text-primary">
              {room.currentItem || '…'}
            </p>
          </div>

          {room.status === 'playing' && room.currentPlayerTurn && (
              <div className={cn(
                "text-center w-full max-w-lg p-3 rounded-lg border transition-colors duration-300",
                user?.uid === room.currentPlayerTurn 
                    ? 'bg-accent/80 border-accent/40' 
                    : 'bg-secondary/40 border-border/60'
              )}>
                  <p className={cn(
                      "font-bold text-lg",
                      user?.uid === room.currentPlayerTurn && 'text-accent-foreground'
                  )}>
                      {user?.uid === room.currentPlayerTurn ? "It's your turn to call a number!" : `Waiting for ${room.players[room.currentPlayerTurn]?.name || 'a player'}...`}
                  </p>
              </div>
          )}
          
          {currentPlayer && <BingoCard card={currentPlayer.card} onMark={handleCellClick} calledItems={room.calledItems} gridSize={room.gridSize} isMyTurn={user?.uid === room.currentPlayerTurn} />}
          
          <div className="hidden sm:flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button size="lg" variant="destructive" onClick={handleBingo} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg" disabled={room.status === 'finished'}>
              BINGO!
            </Button>
          </div>
        </main>
        
        <aside className="lg:col-span-1 order-3 rounded-lg border bg-card/85 p-4 shadow-sm backdrop-blur flex flex-col gap-4">
            <div>
                <h3 className="text-lg font-bold mb-4">Players</h3>
                <PlayerList players={Object.values(room.players)} currentPlayerTurnId={room.currentPlayerTurn} />
                <Separator className="my-4" />
                <Button variant="outline" className="w-full" onClick={copyLink}>
                    <Copy className="mr-2 h-4 w-4" /> Share Link
                </Button>
            </div>
            <Separator />
            <div className="h-96">
                <Chat roomId={roomId} messages={room.messages} />
            </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur sm:hidden pb-safe">
        <div className="container mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</p>
            <p className="truncate text-sm font-medium">
              {room.currentPlayerTurn
                ? user?.uid === room.currentPlayerTurn
                  ? "Your turn to call"
                  : `Waiting for ${room.players[room.currentPlayerTurn]?.name || 'player'}`
                : "Game in progress"}
            </p>
          </div>
          <Button
            size="lg"
            variant="destructive"
            onClick={handleBingo}
            className="h-12 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
            disabled={room.status === 'finished'}
          >
            BINGO!
          </Button>
        </div>
      </div>
    </div>
  );
}
