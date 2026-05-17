import type { Player } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Crown, Trophy, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface PlayerListProps {
  players: Player[];
  currentPlayerTurnId?: string;
}

export function PlayerList({ players, currentPlayerTurnId }: PlayerListProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-3">
      {sortedPlayers.map((player) => (
        <div 
          key={player.id} 
          className={cn(
              "flex items-center justify-between rounded-lg border bg-background/70 p-3 transition-all",
              player.isWinner && "border-amber-400 bg-amber-400/10",
              player.id === currentPlayerTurnId && "border-primary/60 ring-2 ring-primary/20"
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${player.name}`} />
              <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-grow">
                <span className="block truncate text-sm font-semibold">{player.name}</span>
                <p className="text-xs font-medium text-muted-foreground">Score <span className="text-foreground font-bold">{player.score}</span></p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {player.id === currentPlayerTurnId && (
              <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/10">
                <Mic className="h-3 w-3" /> Turn
              </Badge>
            )}
            {player.isWinner && <Trophy className="h-4 w-4 text-amber-500" />}
            {player.isHost && <Crown className="h-4 w-4 text-amber-500" />}
          </div>
        </div>
      ))}
    </div>
  );
}
