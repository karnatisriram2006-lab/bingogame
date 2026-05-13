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
      const newConfetti = Array.from({ length: 100 }).map((_, i) => {
        const colors = ['#9400D3', '#7DF9FF', '#FFD700', '#FF4500'];
        return {
          id: i + Date.now(),
          style: {
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: Math.random() + 0.5,
          },
        };
      });
      setConfetti(newConfetti);
    };

    generateConfetti();
  }, []);

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map(c => <ConfettiPiece key={c.id} id={c.id} style={c.style} />)}
        </div>
        <DialogHeader className="z-10">
          <DialogTitle className="flex flex-col items-center gap-4 text-2xl">
            <Trophy className="h-16 w-16 text-yellow-500" />
            BINGO! We have a winner!
          </DialogTitle>
          <DialogDescription className="text-center text-lg pt-4">
            Congratulations, <span className="font-bold text-primary">{winner.name}</span>!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 mt-4 z-10">
          {isHost ? (
            <Button onClick={onPlayAgain}>Play Again</Button>
          ) : (
            <p className="text-muted-foreground text-sm">Waiting for the host to start a new game.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
