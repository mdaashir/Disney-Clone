import { useState } from "react";
import { useWatchlist } from "../../contexts/WatchlistContext";
import { useAuth } from "../../contexts/AuthContext";
import MovieCard from "../MovieCard";
import { cn } from "../../lib/utils";

export default function WatchlistPage() {
  const { user } = useAuth();
  const { watchlist, favorites, clearWatchlist, clearFavorites } =
    useWatchlist();
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites">(
    "watchlist",
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
          <p className="text-muted-foreground">
            Please sign in to view your watchlist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Collection</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-muted p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
              activeTab === "watchlist"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
              activeTab === "favorites"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "watchlist" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Watchlist</h2>
              {watchlist.length > 0 && (
                <button
                  onClick={clearWatchlist}
                  className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
                >
                  Clear All
                </button>
              )}
            </div>

            {watchlist.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Your watchlist is empty</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add movies you want to watch later
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {watchlist.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Favorites</h2>
              {favorites.length > 0 && (
                <button
                  onClick={clearFavorites}
                  className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
                >
                  Clear All
                </button>
              )}
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No favorites yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Heart movies you love to save them here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {favorites.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
