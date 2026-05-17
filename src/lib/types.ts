import type { FieldValue, Timestamp } from 'firebase/firestore';

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
export type WinCondition = '1_line' | '2_lines' | '3_lines' | '4_lines' | '5_lines' | 'full_house';
export type GridSize = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Timestamp;
};

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
  createdAt: Timestamp | FieldValue;
  winnerId?: string | null;
  players: Record<string, Player>;
  playerOrder?: string[];
  currentPlayerTurn?: string;
  messages: ChatMessage[];
};
