'use client';
import { cn } from "@/lib/utils";

interface BingoCardProps {
  card: (number | string)[];
  onMark: (row: number, col: number) => void;
  calledItems: (number | string)[];
  gridSize: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  isMyTurn: boolean;
}

export function BingoCard({ card: flatCard, onMark, calledItems, gridSize, isMyTurn }: BingoCardProps) {
  const gridClasses = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
  };

  const card: (number | string)[][] = [];
  if (flatCard.length) {
    for (let i = 0; i < gridSize; i++) {
      card.push(flatCard.slice(i * gridSize, (i + 1) * gridSize));
    }
  }

  return (
    <div className={cn(
      `grid ${gridClasses[gridSize]} bg-primary/10 rounded-lg shadow-inner w-full max-w-md md:max-w-lg`,
      gridSize > 7 ? "gap-1 p-1" : gridSize > 4 ? "gap-1.5 p-1.5 md:p-2" : "gap-2 p-2 md:p-4"
    )}>
      {card.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isCalled = calledItems.includes(cell);
          const isFreeSpace = cell === 'FREE';
          const isMarked = isCalled || isFreeSpace;
          
          const isClickableToCall = isMyTurn && !isCalled && !isFreeSpace;
          const isDisabled = !isClickableToCall;

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              disabled={isDisabled}
              onClick={() => onMark(rowIndex, colIndex)}
              className={cn(
                "relative flex items-center justify-center aspect-square rounded-md transition-all duration-300 ease-in-out transform font-bold border-2",
                gridSize <= 3 ? "text-xl md:text-2xl" :      // 3
                gridSize <= 4 ? "text-lg md:text-xl" :       // 4
                gridSize <= 6 ? "text-base md:text-lg" :     // 5, 6
                gridSize <= 8 ? "text-sm md:text-base" :     // 7, 8
                "text-xs md:text-sm",                         // 9, 10
                isFreeSpace ? "bg-accent/20 border-accent text-accent-foreground" : "bg-card border-transparent shadow-sm",
                isMarked && "bg-primary text-primary-foreground scale-95 shadow-inner border-primary-foreground/20",
                isClickableToCall && "cursor-pointer hover:scale-105 hover:border-primary hover:shadow-md active:scale-95",
                !isClickableToCall && "cursor-not-allowed",
                isMarked && !isClickableToCall && "opacity-90"
              )}
            >
              <span className={cn(
                "relative z-10 transition-transform duration-300",
                isMarked && "scale-110"
              )}>{cell}</span>
              {isMarked && !isFreeSpace && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="h-full w-0.5 rotate-45 bg-primary-foreground" />
                  <div className="h-full w-0.5 -rotate-45 bg-primary-foreground" />
                </div>
              )}
            </button>
          );
        })
      )}
    </div>
  );
}
