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
    const totalItems = gridSize * gridSize;
    let sourcePool: (string | number)[];

    if (gameType === 'numbers') {
        sourcePool = Array.from({ length: 75 }, (_, i) => i + 1);
    } else {
        sourcePool = (customWords || '').split(',').map(w => w.trim()).filter(Boolean);
        if (sourcePool.length < totalItems) {
            const placeholders = Array.from({length: totalItems - sourcePool.length}, (_, i) => `Word ${i+1}`);
            sourcePool.push(...placeholders);
        }
    }

    // Shuffle the main source pool
    for (let i = sourcePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sourcePool[i], sourcePool[j]] = [sourcePool[j], sourcePool[i]];
    }
    
    // For numbers, we still take the full range but shuffled. For words, we take exactly the amount needed.
    const gameSize = gameType === 'numbers' ? 75 : totalItems;

    return sourcePool.slice(0, gameSize);
}

// MODIFIED function to generate a card from a pre-defined set of items.
export function generateBingoCard(gameItems: (string | number)[], gridSize: GridSize): (number | string)[] {
  const cardSize = gridSize * gridSize;
  const itemsToShuffle = [...gameItems];

  // Fisher-Yates shuffle
  for (let i = itemsToShuffle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itemsToShuffle[i], itemsToShuffle[j]] = [itemsToShuffle[j], itemsToShuffle[i]];
  }
  
  const cardItems = itemsToShuffle.slice(0, cardSize);

  if (gridSize % 2 !== 0) {
    const centerIndex = Math.floor(cardSize / 2);
    cardItems[centerIndex] = 'FREE';
  }
  
  return cardItems;
}


// This function checks for line completions only. Win condition logic is handled in the component.
export function checkWin(
    flatCard: (number | string)[], 
    calledItems: (number | string)[], 
    gridSize: GridSize
): { lines: number, isFullHouse: boolean } {
    const card: (number | string)[][] = [];
    for (let i = 0; i < gridSize; i++) {
        card.push(flatCard.slice(i * gridSize, (i + 1) * gridSize));
    }

    let lines = 0;
    let markedCount = 0;

    const isMarked = (r: number, c: number) => {
        const value = card[r][c];
        const marked = value === 'FREE' || calledItems.includes(value);
        if (marked) markedCount++;
        return marked;
    };

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

    const isFullHouse = markedCount === gridSize * gridSize;

    return { lines, isFullHouse };
}
