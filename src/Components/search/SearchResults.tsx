import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Grid, List, SortAsc, X } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import MovieCard from "@/Components/MovieCard";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchFilters({ isOpen, onClose }: SearchFiltersProps) {
  const { filters, setFilters } = useSearch();

  const genres = [
    { id: "28", name: "Action" },
    { id: "12", name: "Adventure" },
    { id: "16", name: "Animation" },
    { id: "35", name: "Comedy" },
    { id: "80", name: "Crime" },
    { id: "99", name: "Documentary" },
    { id: "18", name: "Drama" },
    { id: "10751", name: "Family" },
    { id: "14", name: "Fantasy" },
    { id: "36", name: "History" },
    { id: "27", name: "Horror" },
    { id: "10402", name: "Music" },
    { id: "9648", name: "Mystery" },
    { id: "10749", name: "Romance" },
    { id: "878", name: "Sci-Fi" },
    { id: "10770", name: "TV Movie" },
    { id: "53", name: "Thriller" },
    { id: "10752", name: "War" },
    { id: "37", name: "Western" },
  ];

  const years = Array.from({ length: 30 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );
  const ratings = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Genre Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Genre
                  </label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters({ genre: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-background"
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Release Year
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({ year: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-background"
                  >
                    <option value="">Any Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({ rating: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-background"
                  >
                    <option value="">Any Rating</option>
                    {ratings.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}+ Stars
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ sortBy: e.target.value as any })
                    }
                    className="w-full p-2 rounded-lg border bg-background"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="release_date">Release Date</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() =>
                    setFilters({
                      genre: "",
                      year: "",
                      rating: "",
                      sortBy: "popularity",
                    })
                  }
                  className="w-full p-2 rounded-lg border border-muted-foreground/20 text-muted-foreground hover:bg-accent transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function SearchResults() {
  const { query, results, isLoading } = useSearch();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Search Movies & Shows</h1>
          <p className="text-muted-foreground">
            Start typing to discover amazing content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Search Results for "{query}"
          </h1>
          {!isLoading && (
            <p className="text-muted-foreground">
              {results.length} {results.length === 1 ? "result" : "results"}{" "}
              found
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-muted-foreground">Searching...</span>
          </div>
        </div>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "space-y-4",
          )}
        >
          {results.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {viewMode === "grid" ? (
                <MovieCard movie={movie} />
              ) : (
                <div className="flex gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <img
                    src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {movie.release_date?.split("-")[0]}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {movie.overview}
                    </p>
                    <div className="flex items-center mt-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {!isLoading && results.length === 0 && query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="mb-4">
            <SortAsc className="h-16 w-16 mx-auto text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
        </motion.div>
      )}

      {/* Filters Panel */}
      <SearchFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
}
