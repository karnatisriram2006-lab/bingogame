import type { GridSize, GameMode } from './types';

export function generateRoomCode(length: number = 5): string {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateBingoCard(gridSize: GridSize, gameType: GameMode, customWords?: string): (number | string)[] {
  const card: (number | string)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  
  if (gameType === 'numbers') {
    const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        card[i][j] = numbers.splice(randomIndex, 1)[0];
      }
    }
  } else {
    const words = (customWords || '').split(',').map(w => w.trim()).filter(Boolean);
    if (words.length < gridSize * gridSize) {
      // Pad with placeholder words if not enough are provided
      const placeholders = Array.from({length: gridSize * gridSize - words.length}, (_, i) => `Word ${i+1}`);
      words.push(...placeholders);
    }
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        card[i][j] = words.splice(randomIndex, 1)[0];
      }
    }
  }

  // For 5x5, the center is free
  if (gridSize === 5) {
    const center = Math.floor(gridSize / 2);
    card[center][center] = 'FREE';
  }

  return card.flat();
}

// NOTE: In a production app, this verification logic MUST run on the server
// (e.g., a Firebase Cloud Function) to prevent cheating.
export function checkWin(flatCard: (number | string)[], markedCells: { row: number, col: number }[], gridSize: GridSize): { lines: number, isFullHouse: boolean } {
    const card: (number | string)[][] = [];
    for (let i = 0; i < gridSize; i++) {
        card.push(flatCard.slice(i * gridSize, (i + 1) * gridSize));
    }

    let lines = 0;

    const isMarked = (r: number, c: number) => markedCells.some(cell => cell.row === r && cell.col === c) || card[r][c] === 'FREE';

    // Check rows
    for (let r = 0; r < gridSize; r++) {
        if (Array.from({length: gridSize}, (_, c) => isMarked(r,c)).every(Boolean)) {
            lines++;
        }
    }

    // Check columns
    for (let c = 0; c < gridSize; c++) {
        if (Array.from({length: gridSize}, (_, r) => isMarked(r,c)).every(Boolean)) {
            lines++;
        }
    }

    // Check diagonals
    if (Array.from({length: gridSize}, (_, i) => isMarked(i,i)).every(Boolean)) {
        lines++;
    }
    if (Array.from({length: gridSize}, (_, i) => isMarked(i, gridSize - 1 - i)).every(Boolean)) {
        lines++;
    }

    const isFullHouse = markedCells.length >= (gridSize * gridSize - (flatCard.includes('FREE') ? 1 : 0));

    return { lines, isFullHouse };
}
