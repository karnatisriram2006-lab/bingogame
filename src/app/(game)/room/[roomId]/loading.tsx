import { Skeleton } from "@/components/ui/skeleton";

export default function RoomLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Called Items */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>

        {/* Center Column: Game Area */}
        <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col items-center">
          <Skeleton className="h-24 w-48 mb-6" />
          <div className="grid grid-cols-5 gap-2 p-4 bg-muted/50 rounded-lg">
             {[...Array(25)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-16 md:h-20 md:w-20 rounded-md" />
             ))}
          </div>
           <Skeleton className="h-12 w-48 mt-8" />
        </div>

        {/* Right Column: Players */}
        <div className="lg:col-span-1 order-3">
          <Skeleton className="h-12 w-3/4 mb-4" />
           <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
