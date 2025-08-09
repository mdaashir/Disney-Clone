import { Skeleton } from "@/Components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const MovieCardSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn("space-y-3", className)}>
    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const HorizontalMovieCardSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn("flex space-x-4", className)}>
    <Skeleton className="aspect-[16/9] w-48 rounded-xl" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

export const SliderSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn("space-y-4", className)}>
    <div className="relative">
      <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
      <div className="absolute bottom-6 left-6 space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export const ProductionHouseSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn("grid grid-cols-2 md:grid-cols-5 gap-4", className)}>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="relative group">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
      </div>
    ))}
  </div>
);

export const GenreListSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn("space-y-8", className)}>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, j) => (
            <MovieCardSkeleton key={j} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const SearchResultsSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn("space-y-6", className)}>
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <HorizontalMovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export const HeaderSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn("flex items-center justify-between p-5", className)}>
    <div className="flex items-center space-x-8">
      <Skeleton className="h-12 w-24" />
      <div className="hidden md:flex space-x-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16" />
        ))}
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-64 rounded-full hidden md:block" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

// Legacy skeleton for backward compatibility
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}

// Default component for legacy imports
const Skeletons = () => (
  <div className="flex overflow-x-auto space-x-4 p-4">
    {Array.from({ length: 7 }).map((_, i) => (
      <div
        key={i}
        className="min-w-[260px] md:min-w-[330px] p-2 px-3 bg-gradient-to-t from-disney-dark to-disney-blue rounded-lg relative hover:scale-110 transition-all duration-150 ease-in-out cursor-pointer shadow-xl shadow-black/25"
      >
        <Skeleton className="h-[140px] md:h-[180px] rounded-lg" />
      </div>
    ))}
  </div>
);

// Default export for backward compatibility
export default Skeletons;
