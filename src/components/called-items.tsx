import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface CalledItemsProps {
  items: (string | number)[];
}

export function CalledItems({ items }: CalledItemsProps) {
  const reversedItems = [...items].reverse();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold">Called Items</h3>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-background/60 p-4 text-center text-sm text-muted-foreground">
          No items called yet.
        </div>
      ) : (
        <ScrollArea className="h-48 lg:h-96">
            <div className="flex flex-wrap gap-2">
                {reversedItems.map((item, index) => (
                    <div
                        key={`${item}-${index}`}
                        className={cn(
                          "flex items-center justify-center rounded-full font-bold tabular-nums shadow-sm ring-1 ring-border/60",
                          "h-10 w-10 text-sm",
                          "sm:h-11 sm:w-11 sm:text-sm",
                          index === 0
                            ? "bg-primary text-primary-foreground ring-primary/40"
                            : "bg-secondary/70 text-secondary-foreground"
                        )}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </ScrollArea>
      )}
    </div>
  );
}
