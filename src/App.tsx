import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/Components/ui/tooltip";
import Header from "@/Components/Header";
import ErrorBoundary from "@/Components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { NotificationProvider } from "@/Components/notifications/NotificationSystem";
import { useTheme } from "@/hooks";
import { initPerformanceMonitoring } from "@/hooks/usePerformanceMonitor";
import { warmCache } from "@/Services/CacheService";
import "./App.css";

// Lazy load components for better performance
const HomePage = lazy(() => import("./Components/HomePage"));
const MovieDetailPage = lazy(
  () => import("./Components/movies/MovieDetailPage"),
);
const VideoPlayer = lazy(() => import("./Components/player/VideoPlayer"));
const WatchlistPage = lazy(
  () => import("./Components/watchlist/WatchlistPage"),
);
const UserDashboard = lazy(
  () => import("./Components/dashboard/UserDashboard"),
);
const DiscoveryPage = lazy(() => import("./Components/pages/DiscoveryPage"));

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
    <span className="ml-3 text-muted-foreground">
      Loading amazing content...
    </span>
  </div>
);

function App() {
  useTheme(); // Initialize theme

  // Initialize performance monitoring and service worker
  useEffect(() => {
    // Initialize performance monitoring
    if (typeof window !== "undefined") {
      initPerformanceMonitoring();

      // Warm API cache
      warmCache().catch((error) => {
        console.warn("Failed to warm cache:", error);
      });

      // Register service worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // eslint-disable-next-line no-console
            console.log("Service Worker registered:", registration);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          <WatchlistProvider>
            <NotificationProvider>
              <TooltipProvider>
                <ErrorBoundary>
                  <Router>
                    <div className="min-h-screen bg-background text-foreground">
                      <Header />

                      {/* Main Content with routing */}
                      <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route
                            path="/movie/:id"
                            element={<MovieDetailPage />}
                          />
                          <Route path="/watch/:id" element={<VideoPlayer />} />
                          <Route
                            path="/watchlist"
                            element={<WatchlistPage />}
                          />
                          <Route
                            path="/dashboard"
                            element={<UserDashboard />}
                          />
                          <Route path="/discover" element={<DiscoveryPage />} />
                        </Routes>
                      </Suspense>

                      {/* Toast notifications */}
                      <Toaster
                        position="bottom-right"
                        toastOptions={{
                          duration: 4000,
                          style: {
                            background: "hsl(var(--background))",
                            color: "hsl(var(--foreground))",
                            border: "1px solid hsl(var(--border))",
                          },
                        }}
                      />

                      {/* React Query Devtools (only in development) */}
                      {import.meta.env.DEV && (
                        <ReactQueryDevtools initialIsOpen={false} />
                      )}
                    </div>
                  </Router>
                </ErrorBoundary>
              </TooltipProvider>
            </NotificationProvider>
          </WatchlistProvider>
        </SearchProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
