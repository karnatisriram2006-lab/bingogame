import type { GridSize, GameMode } from './types';

export function generateRoomCode(length: number = 5): string {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// New function to create the pool of items for the entire game.
export function generateGameItems(gridSize: GridSize, gameType: GameMode, customWords?: string): (string | number)[] {
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

    // Shuffle the main source pool
    for (let i = sourcePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sourcePool[i], sourcePool[j]] = [sourcePool[j], sourcePool[i]];
    }
    
    // Select the items for this specific game
    return sourcePool.slice(0, cardSize);
}

// MODIFIED function to generate a card from a pre-defined set of items.
export function generateBingoCard(gameItems: (string | number)[], gridSize: GridSize): (number | string)[] {
  const itemsToShuffle = [...gameItems];

  // Fisher-Yates shuffle
  for (let i = itemsToShuffle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itemsToShuffle[i], itemsToShuffle[j]] = [itemsToShuffle[j], itemsToShuffle[i]];
  }
  
  if (gridSize === 5) {
    const centerIndex = Math.floor((gridSize * gridSize) / 2);
    // Replace the center item with 'FREE'. The original item at that position will not be on this card.
    itemsToShuffle[centerIndex] = 'FREE';
  }
  
  return itemsToShuffle;
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
