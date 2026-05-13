import { ScrollArea } from './ui/scroll-area';

interface CalledItemsProps {
  items: (string | number)[];
}

export function CalledItems({ items }: CalledItemsProps) {
  const reversedItems = [...items].reverse();

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Called Items ({items.length})</h3>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No items called yet.</p>
      ) : (
        <ScrollArea className="h-96">
            <div className="flex flex-wrap gap-2">
                {reversedItems.map((item, index) => (
                    <div
                        key={`${item}-${index}`}
                        className={`flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm
                            ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
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
