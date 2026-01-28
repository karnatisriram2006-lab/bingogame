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
    <div className={`grid ${gridClasses[gridSize]} gap-1.5 md:gap-2 p-2 md:p-4 bg-primary/10 rounded-lg shadow-inner`}>
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
                "relative flex items-center justify-center aspect-square rounded-md transition-all duration-300 ease-in-out transform font-bold",
                gridSize <= 3 ? "text-xl md:text-3xl" :
                gridSize <= 4 ? "text-lg md:text-2xl" :
                gridSize <= 5 ? "text-base md:text-xl" :
                gridSize <= 6 ? "text-sm md:text-lg" :
                gridSize <= 8 ? "text-xs md:text-base" :
                "text-[10px] md:text-xs",
                isFreeSpace ? "bg-accent text-accent-foreground" : "bg-card shadow-sm",
                isMarked && "bg-primary text-primary-foreground scale-95 shadow-inner",
                isClickableToCall && "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-primary",
                !isClickableToCall && "cursor-not-allowed",
                isMarked && !isClickableToCall && "opacity-60"
              )}
            >
              <span className={cn("relative z-10")}>{cell}</span>
            </button>
          );
        })
      )}
    </div>
  );
}
