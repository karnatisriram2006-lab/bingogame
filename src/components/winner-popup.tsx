'use client';

import { useEffect, useState } from 'react';
import type { Player } from '@/lib/types';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Trophy } from 'lucide-react';

interface WinnerPopupProps {
  winner: Player;
  isHost: boolean;
  onPlayAgain: () => void;
}

const ConfettiPiece = ({ id, style }: { id: number; style: React.CSSProperties }) => (
    <div key={id} className="confetti" style={style}></div>
);

export function WinnerPopup({ winner, isHost, onPlayAgain }: WinnerPopupProps) {
  const [confetti, setConfetti] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const generateConfetti = () => {
      const newConfetti = Array.from({ length: 150 }).map((_, i) => {
        const colors = ['#9400D3', '#7DF9FF', '#FFD700', '#FF4500', '#00FF00', '#FF00FF'];
        return {
          id: i + Date.now(),
          style: {
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 3}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: Math.random() + 0.5,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
          },
        };
      });
      setConfetti(newConfetti);
    };

    generateConfetti();
  }, []);

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)]" onInteractOutside={(e) => e.preventDefault()}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map(c => <ConfettiPiece key={c.id} id={c.id} style={c.style} />)}
        </div>
        <DialogHeader className="z-10">
          <div className="flex justify-center mb-4">
            <div className="relative">
                <Trophy className="h-24 w-24 text-yellow-500 animate-bounce" />
                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-2 animate-ping">
                    <Trophy className="h-4 w-4" />
                </div>
            </div>
          </div>
          <DialogTitle className="text-center text-3xl font-black bg-gradient-to-b from-yellow-400 to-yellow-700 bg-clip-text text-transparent uppercase tracking-tighter">
            BINGO! WE HAVE A WINNER!
          </DialogTitle>
          <DialogDescription className="text-center text-xl pt-6 font-medium">
            Let's celebrate <span className="font-black text-2xl text-primary underline decoration-yellow-500 underline-offset-4">{winner.name}</span>'s victory!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 mt-8 z-10">
          {isHost ? (
            <Button size="lg" onClick={onPlayAgain} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-6 text-xl transition-all hover:scale-110 shadow-xl">
                Start Next Round!
            </Button>
          ) : (
            <div className="bg-muted p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 animate-pulse">
                <p className="text-muted-foreground font-semibold text-center italic">Waiting for the host to lead us into the next battle...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
