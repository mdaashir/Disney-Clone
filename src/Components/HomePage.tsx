import { Suspense, lazy } from "react";

// Lazy load components for better performance
const Slider = lazy(() => import("./Slider"));
const ProductionHouse = lazy(() => import("./ProductionHouse"));
const GenreMovieList = lazy(() => import("./GenreMovieList"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-disney-blue"></div>
    <span className="ml-3 text-muted-foreground">
      Loading amazing content...
    </span>
  </div>
);

export default function HomePage() {
  return (
    <main className="pt-16 lg:pt-20">
      <h1 className="sr-only">Disney+ Home - Movies, TV Shows and Originals</h1>
      <Suspense fallback={<LoadingFallback />}>
        <Slider />
        <ProductionHouse />
        <GenreMovieList />
      </Suspense>
    </main>
  );
}
