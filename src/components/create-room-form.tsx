'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateRoomCode, generateBingoCard, generateGameItems } from '@/lib/bingo-logic';
import type { Room, Player, GridSize, GameMode, WinCondition } from '@/lib/types';
import { AuthForm } from './auth-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CreateRoomFormProps {
  onRoomCreated: () => void;
}

export function CreateRoomForm({ onRoomCreated }: CreateRoomFormProps) {
  const { user } = useAuth();
  const [isAuthStep, setAuthStep] = useState(!user);
  
  const [gridSize, setGridSize] = useState<GridSize>(5);
  const [gameType, setGameType] = useState<GameMode>('numbers');
  const [winCondition, setWinCondition] = useState<WinCondition>('1_line');
  const [customWords, setCustomWords] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (gameType === 'words' && customWords.split(',').filter(Boolean).length < gridSize * gridSize) {
        toast({
            variant: "destructive",
            title: "Not enough words",
            description: `Please provide at least ${gridSize * gridSize} comma-separated words.`,
        });
        return;
    }

    setLoading(true);

    const roomCode = generateRoomCode();
    const roomId = doc(db, 'rooms', roomCode).id;

    const gameItems = generateGameItems(gridSize, gameType, customWords);

    const hostPlayer: Player = {
      id: user.uid,
      name: user.displayName || 'Host',
      isHost: true,
      ready: true,
      card: generateBingoCard(gameItems, gridSize),
      score: 0,
      isWinner: false,
    };

    const newRoom: Room = {
      id: roomId,
      code: roomCode,
      hostId: user.uid,
      status: 'lobby',
      gridSize,
      gameType,
      winCondition,
      gameItems,
      calledItems: [],
      currentItem: null,
      createdAt: serverTimestamp(),
      players: {
        [user.uid]: hostPlayer
      },
      messages: [],
    };
    
    if (gameType === 'words') {
        newRoom.customWords = customWords;
    }

    try {
      await setDoc(doc(db, 'rooms', roomId), newRoom);
      toast({ title: "Room created!", description: `Your room code is ${roomCode}` });
      onRoomCreated();
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Error creating room: ", error);
      toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: "There was a problem creating your room." });
      setLoading(false);
    }
  };

  if (isAuthStep) {
    return <AuthForm onAuthSuccess={() => setAuthStep(false)} />;
  }

  return (
    <form onSubmit={handleCreateRoom} className="grid gap-6">
      <div className="space-y-2">
        <Label>Grid Size</Label>
        <RadioGroup value={String(gridSize)} onValueChange={(v) => setGridSize(Number(v) as GridSize)} className="flex flex-wrap gap-2">
          {[3, 4, 5, 6, 7, 8, 9, 10].map(size => (
            <Label key={size} className="flex items-center gap-2 cursor-pointer border p-3 rounded-md has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
              <RadioGroupItem value={String(size)} id={`g${size}`} /> {size}x{size}
            </Label>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label>Game Type</Label>
        <RadioGroup value={gameType} onValueChange={(v) => setGameType(v as GameMode)} className="flex flex-wrap gap-4">
          <Label className="flex items-center gap-2 cursor-pointer border p-3 rounded-md has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
            <RadioGroupItem value="numbers" id="t-num" /> Numbers
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer border p-3 rounded-md has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
            <RadioGroupItem value="words" id="t-word" /> Words
          </Label>
        </RadioGroup>
      </div>
       {gameType === 'words' && (
        <div className="space-y-2">
            <Label htmlFor="customWords">Custom Words</Label>
            <Input
                id="customWords"
                placeholder="cat, dog, house, car..."
                value={customWords}
                onChange={(e) => setCustomWords(e.target.value)}
                required
            />
            <p className="text-sm text-muted-foreground">Enter at least {gridSize * gridSize} words, separated by commas.</p>
        </div>
      )}
      <div className="space-y-2">
        <Label>Win Condition</Label>
        <RadioGroup value={winCondition} onValueChange={(v) => setWinCondition(v as WinCondition)} className="flex flex-wrap gap-4">
          <Label className="flex items-center gap-2 cursor-pointer border p-3 rounded-md has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
            <RadioGroupItem value="1_line" id="w1" /> 1 Line
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer border p-3 rounded-md has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
            <RadioGroupItem value="2_lines" id="w2" /> 2 Lines
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer border p-3 rounded-md has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
            <RadioGroupItem value="full_house" id="w3" /> Full House
          </Label>
        </RadioGroup>
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Room
      </Button>
    </form>
  );
}
