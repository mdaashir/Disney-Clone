import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/Components/ui/tooltip";
import Header from "@/Components/Header";
import ErrorBoundary from "@/Components/ErrorBoundary";
import { useTheme } from "@/hooks";
import "./App.css";

// Lazy load components for better performance
const Slider = lazy(() => import("@/Components/Slider"));
const ProductionHouse = lazy(() => import("@/Components/ProductionHouse"));
const GenreMovieList = lazy(() => import("@/Components/GenreMovieList"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-disney-blue"></div>
    <span className="ml-3 text-muted-foreground">Loading amazing content...</span>
  </div>
);

function App() {
  useTheme(); // Initialize theme

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Main Content with top padding to account for fixed header */}
            <main className="pt-16 lg:pt-20">
              <Suspense fallback={<LoadingFallback />}>
                <Slider />
                <ProductionHouse />
                <GenreMovieList />
              </Suspense>
            </main>

            {/* Toast notifications */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />

            {/* React Query Devtools (only in development) */}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </div>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
