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
  const cardSize = gridSize * gridSize;
  let sourcePool: (string | number)[];

  if (gameType === 'numbers') {
    sourcePool = Array.from({ length: 75 }, (_, i) => i + 1);
  } else {
    sourcePool = (customWords || '').split(',').map(w => w.trim()).filter(Boolean);
    if (sourcePool.length < cardSize) {
      const placeholders = Array.from({length: cardSize - sourcePool.length}, (_, i) => `Word ${i+1}`);
      sourcePool.push(...placeholders);
    }
  }

  // Fisher-Yates shuffle to ensure card uniqueness
  for (let i = sourcePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sourcePool[i], sourcePool[j]] = [sourcePool[j], sourcePool[i]];
  }

  // Handle the 'FREE' space separately for 5x5 grids
  if (gridSize === 5) {
    const itemsForCard = sourcePool.filter(item => item !== 'FREE').slice(0, cardSize - 1);
    const centerIndex = Math.floor(cardSize / 2);
    itemsForCard.splice(centerIndex, 0, 'FREE');
    return itemsForCard;
  }
  
  return sourcePool.slice(0, cardSize);
}


// This function checks for line completions only. Win condition logic is handled in the component.
export function checkWin(
    flatCard: (number | string)[], 
    markedCells: { row: number, col: number }[], 
    gridSize: GridSize
): { lines: number } {
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

    return { lines };
}
