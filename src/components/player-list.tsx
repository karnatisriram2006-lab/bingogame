import type { Player } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Crown, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerListProps {
  players: Player[];
}

export function PlayerList({ players }: PlayerListProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-3">
      {sortedPlayers.map((player) => (
        <div 
          key={player.id} 
          className={cn(
              "flex items-center justify-between rounded-lg p-2 transition-all",
              player.isWinner ? "bg-yellow-400/20 border border-yellow-500" : "bg-secondary/50"
          )}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${player.name}`} />
              <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{player.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {player.isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
            {player.isHost && <Crown className="h-4 w-4 text-amber-500" />}
          </div>
        </div>
      ))}
    </div>
  );
}
