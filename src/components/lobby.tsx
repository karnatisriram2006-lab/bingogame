import type { Room, Player } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserX, CheckCircle, Circle, Crown, Copy, Play } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LobbyProps {
  room: Room;
  players: Player[];
  isHost: boolean;
  onReady: () => void;
  onStart: () => void;
  currentPlayer: Player | null;
  onCopyLink: () => void;
  onRemovePlayer: (playerId: string) => void;
}

export function Lobby({ room, players, isHost, onReady, onStart, currentPlayer, onCopyLink, onRemovePlayer }: LobbyProps) {
    const allReady = players.every(p => p.ready);
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Lobby</CardTitle>
          <CardDescription>Waiting for players to get ready. The host will start the game.</CardDescription>
            <div className="flex items-center justify-center gap-4 pt-4">
                <p className="text-sm text-muted-foreground">Room Code:</p>
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                    <span className="text-2xl font-bold tracking-widest text-primary">{room.code}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={onCopyLink}>
                        <Copy className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-4">Players ({players.length})</h3>
            <div className="space-y-3">
              {players.map((player) => (
                <div key={player.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${player.name}`} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{player.name}</span>
                    {player.isHost && <Crown className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {player.ready ? (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="h-5 w-5" />
                        <span>Ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Circle className="h-5 w-5" />
                        <span>Not Ready</span>
                      </div>
                    )}
                    {isHost && !player.isHost && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                              onClick={() => onRemovePlayer(player.id)}
                            >
                              <UserX className="h-4 w-4" />
                              <span className="sr-only">Remove {player.name}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove {player.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-col items-center gap-4">
              {isHost ? (
                <Button size="lg" onClick={onStart} disabled={!allReady} className="w-full sm:w-auto">
                  <Play className="mr-2 h-5 w-5"/>
                  {players.length > 1 && !allReady ? 'Waiting for players...' : 'Start Game'}
                </Button>
              ) : (
                <Button size="lg" onClick={onReady} className="w-full sm:w-auto">
                    {currentPlayer?.ready ? "I'm not ready" : "I'm Ready!"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
