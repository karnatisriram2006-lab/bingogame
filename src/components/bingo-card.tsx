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

  const cellSize = gridSize >= 9 ? 44 : gridSize >= 7 ? 48 : 56;
  const gridMinWidth = gridSize * cellSize + (gridSize - 1) * (gridSize > 7 ? 4 : gridSize > 4 ? 6 : 8) + 24;

  return (
    <div className="w-full overflow-x-auto">
      <div
        className={cn(
          `grid ${gridClasses[gridSize]} rounded-xl border bg-card shadow-sm ring-1 ring-border/60`,
          gridSize > 7 ? "gap-1 p-2" : gridSize > 4 ? "gap-1.5 p-3" : "gap-2 p-4"
        )}
        style={{ minWidth: gridMinWidth }}
        role="grid"
        aria-label={`Bingo card ${gridSize} by ${gridSize}`}
      >
        {card.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isCalled = calledItems.includes(cell);
            const isFreeSpace = cell === 'FREE';
            const isMarked = isCalled || isFreeSpace;

            const isClickableToCall = isMyTurn && !isCalled && !isFreeSpace;
            const isDisabled = !isClickableToCall;

            const label =
              cell === 'FREE'
                ? 'Free space'
                : `${cell}${isCalled ? ', called' : ''}${isMyTurn ? ', tap to call' : ''}`;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                disabled={isDisabled}
                onClick={() => onMark(rowIndex, colIndex)}
                aria-label={label}
                aria-disabled={isDisabled}
                className={cn(
                  "relative flex items-center justify-center aspect-square select-none rounded-xl border text-center font-extrabold tabular-nums outline-none transition",
                  "overflow-hidden",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  gridSize <= 3 ? "text-xl sm:text-2xl" :
                  gridSize <= 4 ? "text-lg sm:text-xl" :
                  gridSize <= 6 ? "text-base sm:text-lg" :
                  gridSize <= 8 ? "text-sm sm:text-base" :
                  "text-xs sm:text-sm",
                  isFreeSpace ? "bg-accent text-accent-foreground" : "bg-background",
                  isMarked && "bg-primary text-primary-foreground border-primary/60 shadow-inner opacity-100",
                  isClickableToCall && "cursor-pointer active:scale-[0.98] hover:border-primary/50 hover:ring-1 hover:ring-primary/30",
                  !isClickableToCall && !isMarked && "cursor-not-allowed opacity-75",
                  isCalled && "animate-in fade-in-0 zoom-in-95 duration-200"
                )}
                style={{ minHeight: cellSize, minWidth: cellSize }}
                role="gridcell"
              >
                <span className="relative z-10 min-w-0 max-w-full px-1 leading-tight [overflow-wrap:anywhere]">
                  {cell}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
