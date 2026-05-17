import { useEffect, useState } from 'react';
import type { Room, Player, GridSize, GameMode, WinCondition } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserX, CheckCircle, Circle, Crown, Copy, Play, Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { Chat } from './chat';
import { Badge } from './ui/badge';

interface LobbyProps {
  room: Room;
  players: Player[];
  isHost: boolean;
  onReady: () => void;
  onStart: () => void;
  currentPlayer: Player | null;
  onCopyLink: () => void;
  onRemovePlayer: (playerId: string) => void;
  onSettingChange: (key: 'gridSize' | 'gameType' | 'winCondition' | 'customWords', value: any) => void;
}

const optionTileClass =
  "flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-semibold transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground hover:bg-secondary/70";

export function Lobby({ room, players, isHost, onReady, onStart, currentPlayer, onCopyLink, onRemovePlayer, onSettingChange }: LobbyProps) {
    const allReady = players.every(p => p.ready);
    const [customWords, setCustomWords] = useState(room.customWords || '');
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    useEffect(() => {
        setCustomWords(room.customWords || '');
    }, [room.customWords]);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 pb-28 sm:py-10 sm:pb-10">
      <Card className="overflow-hidden border bg-card/90 shadow-xl backdrop-blur">
        <CardHeader className="border-b bg-secondary/35 p-5 text-center sm:p-6">
          <CardTitle className="text-2xl font-black sm:text-3xl">Lobby</CardTitle>
          <CardDescription>Waiting for players to get ready. The host will start the game.</CardDescription>
            <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3 text-left shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Room Code</p>
                  <span className="font-mono text-2xl font-black tracking-widest text-primary">{room.code}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{players.length} players</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={onCopyLink}>
                        <Copy className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold">Players</h3>
                <div className="space-y-3">
                {sortedPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between rounded-lg border bg-background/80 p-3 shadow-sm">
                    <div className="flex min-w-0 items-center gap-3">
                        <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${player.name}`} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <span className="block truncate font-semibold">{player.name}</span>
                            <p className="text-xs font-medium text-muted-foreground">Score <span className="text-foreground font-bold">{player.score}</span></p>
                        </div>
                        {player.isHost && <Crown className="h-5 w-5 text-yellow-500" />}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {player.ready ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Ready</span>
                        </div>
                        ) : (
                        <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                            <Circle className="h-4 w-4" />
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

                <div className="hidden pt-4 sm:flex flex-col items-center gap-4">
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
            <div className="h-96 rounded-lg border bg-background/60 p-4 shadow-sm md:h-[32rem]">
                <Chat roomId={room.id} messages={room.messages} />
            </div>
          </div>
          {isHost && (
            <>
                <Separator className="my-8" />
                <div className="space-y-6">
                    <h3 className="flex items-center justify-center gap-2 text-base font-bold">
                        <Settings className="h-5 w-5"/>
                        Game Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <Label>Grid Size</Label>
                            <RadioGroup value={String(room.gridSize)} onValueChange={(v) => onSettingChange('gridSize', Number(v) as GridSize)} className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                                {[3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                                    <Label key={`lobby-${size}`} className={optionTileClass}>
                                        <RadioGroupItem value={String(size)} id={`lobby-g${size}`} /> {size}x{size}
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label>Win Condition</Label>
                            <RadioGroup value={room.winCondition} onValueChange={(v) => onSettingChange('winCondition', v as WinCondition)} className="grid grid-cols-2 gap-2">
                                <Label className={optionTileClass}>
                                    <RadioGroupItem value="1_line" id="w1-lobby" /> 1 Line
                                </Label>
                                <Label className={optionTileClass}>
                                    <RadioGroupItem value="2_lines" id="w2-lobby" /> 2 Lines
                                </Label>
                                <Label className={optionTileClass}>
                                    <RadioGroupItem value="3_lines" id="w3-lobby" /> 3 Lines
                                </Label>
                                <Label className={optionTileClass}>
                                    <RadioGroupItem value="4_lines" id="w4-lobby" /> 4 Lines
                                </Label>
                                <Label className={optionTileClass}>
                                    <RadioGroupItem value="5_lines" id="w5-lobby" /> 5 Lines
                                </Label>
                                <Label className={optionTileClass}>
                                    <RadioGroupItem value="full_house" id="wfh-lobby" /> Full House
                                </Label>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Game Type</Label>
                            <RadioGroup value={room.gameType} onValueChange={(v) => onSettingChange('gameType', v as GameMode)} className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                                <Label className={optionTileClass}>
                                    <RadioGroupItem value="numbers" id="t-num-lobby" /> Numbers
                                </Label>
                                <Label className={optionTileClass}>
                                    <RadioGroupItem value="words" id="t-word-lobby" /> Words
                                </Label>
                            </RadioGroup>
                        </div>
                        {room.gameType === 'words' && (
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="customWords">Custom Words</Label>
                                <Input
                                    id="customWords"
                                    placeholder="cat, dog, house, car..."
                                    value={customWords}
                                    onChange={(e) => setCustomWords(e.target.value)}
                                    onBlur={() => onSettingChange('customWords', customWords)}
                                />
                                <p className="text-sm text-muted-foreground">Enter at least {room.gridSize * room.gridSize} words, separated by commas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </>
          )}
        </CardContent>
      </Card>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur sm:hidden pb-safe">
        <div className="container mx-auto px-4 py-3">
          {isHost ? (
            <Button size="lg" onClick={onStart} disabled={!allReady} className="h-12 w-full rounded-lg">
              <Play className="mr-2 h-5 w-5"/>
              {players.length > 1 && !allReady ? 'Waiting for players...' : 'Start Game'}
            </Button>
          ) : (
            <Button size="lg" onClick={onReady} className="h-12 w-full rounded-lg">
              {currentPlayer?.ready ? "I'm not ready" : "I'm Ready!"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
