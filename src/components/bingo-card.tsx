'use client';
import { cn } from "@/lib/utils";
import { Check } from 'lucide-react';

interface BingoCardProps {
  card: (number | string)[];
  onMark: (row: number, col: number) => void;
  calledItems: (number | string)[];
  gridSize: 3 | 4 | 5;
  isMyTurn: boolean;
}

export function BingoCard({ card: flatCard, onMark, calledItems, gridSize, isMyTurn }: BingoCardProps) {
  const gridClasses = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
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
          const isDisabled = !isClickableToCall && !isFreeSpace;

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              disabled={isDisabled}
              onClick={() => onMark(rowIndex, colIndex)}
              className={cn(
                "relative flex items-center justify-center aspect-square rounded-md transition-all duration-300 ease-in-out transform",
                "text-lg md:text-2xl font-bold",
                gridSize === 5 && "text-base md:text-xl",
                gridSize === 3 && "text-xl md:text-3xl",
                isFreeSpace ? "bg-accent text-accent-foreground" : "bg-card shadow-sm",
                isMarked && !isFreeSpace && "bg-primary text-primary-foreground scale-95 shadow-inner",
                isClickableToCall && "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-primary",
                isDisabled && !isMarked && "cursor-not-allowed opacity-50"
              )}
            >
              {isMarked && !isFreeSpace && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/80 rounded-md">
                   <Check className="h-1/2 w-1/2 text-primary-foreground"/>
                </div>
              )}
              <span className={cn("relative z-10", isMarked && "opacity-50")}>{cell}</span>
            </button>
          );
        })
      )}
    </div>
  );
}
