import type { Timestamp } from 'firebase/firestore';

export type AppUser = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  isGuest: boolean;
};

export type Player = {
  id: string; // same as AppUser.uid
  name: string;
  isHost: boolean;
  ready: boolean;
  card: (string | number)[];
  score: number;
  isWinner: boolean;
};

export type GameMode = 'numbers' | 'words';
export type WinCondition = '1_line' | '2_lines' | 'full_house';
export type GridSize = 3 | 4 | 5;

export type Room = {
  id: string;
  code: string;
  hostId: string;
  status: 'lobby' | 'playing' | 'finished';
  gridSize: GridSize;
  gameType: GameMode;
  winCondition: WinCondition;
  customWords?: string;
  gameItems: (string | number)[];
  calledItems: (string | number)[];
  currentItem: string | number | null;
  createdAt: Timestamp;
  winnerId?: string | null;
  players: Record<string, Player>;
  playerOrder?: string[];
  currentPlayerTurn?: string;
};
