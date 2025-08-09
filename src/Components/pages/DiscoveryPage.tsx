import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNotifications } from "../notifications/NotificationSystem";
import MovieCard from "../MovieCard";
import { fetchByGenre } from "../../Services/GlobalApi";
import GenresList from "../../Constants/GenresList";

interface Movie {
  id: number;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface FilterOptions {
  genres: number[];
  releaseYear: [number, number];
  rating: [number, number];
  runtime: [number, number];
  sortBy: "popularity" | "release_date" | "vote_average" | "title";
  sortOrder: "asc" | "desc";
  viewMode: "grid" | "list";
}

export default function DiscoveryPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    releaseYear: [1990, 2024],
    rating: [0, 10],
    runtime: [60, 240],
    sortBy: "popularity",
    sortOrder: "desc",
    viewMode: "grid",
  });

  const { addNotification } = useNotifications();

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      // Load movies from multiple genres for variety
      const genrePromises = GenresList.genere
        .slice(0, 5)
        .map((genre: any) => fetchByGenre(genre.id));

      const genreResults = await Promise.all(genrePromises);
      const allMovies = genreResults.flat();

      // Remove duplicates
      const uniqueMovies = allMovies.filter(
        (movie: any, index: number, arr: any[]) =>
          arr.findIndex((m: any) => m.id === movie.id) === index,
      );

      setMovies(uniqueMovies);
      addNotification({
        type: "success",
        title: "Movies Loaded",
        message: `Found ${uniqueMovies.length} movies for you to discover!`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error loading movies:", error);
      addNotification({
        type: "error",
        title: "Loading Failed",
        message: "Failed to load movies. Please try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const applyFilters = useCallback(() => {
    let filtered = [...movies];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.overview.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Genre filter
    if (filters.genres.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids.some((genreId) => filters.genres.includes(genreId)),
      );
    }

    // Release year filter
    filtered = filtered.filter((movie) => {
      const year = new Date(movie.release_date).getFullYear();
      return year >= filters.releaseYear[0] && year <= filters.releaseYear[1];
    });

    // Rating filter
    filtered = filtered.filter(
      (movie) =>
        movie.vote_average >= filters.rating[0] &&
        movie.vote_average <= filters.rating[1],
    );

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "release_date":
          aValue = new Date(a.release_date).getTime();
          bValue = new Date(b.release_date).getTime();
          break;
        case "vote_average":
          aValue = a.vote_average;
          bValue = b.vote_average;
          break;
        default:
          aValue = a.id; // Use ID as popularity proxy
          bValue = b.id;
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredMovies(filtered);
  }, [movies, searchQuery, filters]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setFilters({
      genres: [],
      releaseYear: [1990, 2024],
      rating: [0, 10],
      runtime: [60, 240],
      sortBy: "popularity",
      sortOrder: "desc",
      viewMode: "grid",
    });
    setSearchQuery("");
    addNotification({
      type: "info",
      title: "Filters Cleared",
      message: "All filters have been reset to default values.",
      duration: 2000,
    });
  };

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.releaseYear[0] !== 1990 ||
    filters.releaseYear[1] !== 2024 ||
    filters.rating[0] !== 0 ||
    filters.rating[1] !== 10 ||
    searchQuery.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Discover Movies
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            Find your next favorite movie with our advanced discovery tools
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors",
              showFilters
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
              hasActiveFilters && "border-primary",
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                Active
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, viewMode: "grid" }))
              }
              className={cn(
                "px-4 py-3 transition-colors",
                filters.viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, viewMode: "list" }))
              }
              className={cn(
                "px-4 py-3 transition-colors",
                filters.viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 border rounded-lg bg-muted/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Genres
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {GenresList.genere.slice(0, 8).map((genre) => (
                      <label
                        key={genre.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={filters.genres.includes(genre.id)}
                          onChange={() => {
                            const newGenres = filters.genres.includes(genre.id)
                              ? filters.genres.filter((id) => id !== genre.id)
                              : [...filters.genres, genre.id];
                            setFilters((prev) => ({
                              ...prev,
                              genres: newGenres,
                            }));
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{genre.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Release Year
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1990"
                      max="2024"
                      value={filters.releaseYear[0]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          releaseYear: [
                            parseInt(e.target.value),
                            prev.releaseYear[1],
                          ],
                        }))
                      }
                      className="w-full"
                    />
                    <div className="text-xs text-center">
                      {filters.releaseYear[0]} - {filters.releaseYear[1]}
                    </div>
                  </div>
                </div>

                {/* Rating Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum Rating
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.rating[0]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        rating: [parseFloat(e.target.value), prev.rating[1]],
                      }))
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-center">
                    {filters.rating[0]} / 10
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split("-");
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: sortBy as FilterOptions["sortBy"],
                        sortOrder: sortOrder as FilterOptions["sortOrder"],
                      }));
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="popularity-desc">Popularity</option>
                    <option value="release_date-desc">Newest First</option>
                    <option value="release_date-asc">Oldest First</option>
                    <option value="vote_average-desc">Highest Rated</option>
                    <option value="title-asc">Title A-Z</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {loading ? (
              "Loading movies..."
            ) : (
              <>
                Showing {filteredMovies.length} of {movies.length} movies
                {searchQuery && ` for "${searchQuery}"`}
              </>
            )}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                setFilters((prev) => ({
                  ...prev,
                  sortBy: sortBy as FilterOptions["sortBy"],
                  sortOrder: sortOrder as FilterOptions["sortOrder"],
                }));
              }}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="popularity-desc">Popularity</option>
              <option value="release_date-desc">Newest First</option>
              <option value="release_date-asc">Oldest First</option>
              <option value="vote_average-desc">Highest Rated</option>
              <option value="vote_average-asc">Lowest Rated</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-2" />
                <div className="h-4 bg-muted rounded mb-1" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <motion.div
            layout
            className={cn(
              "gap-6",
              filters.viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
                : "flex flex-col space-y-4",
            )}
          >
            <AnimatePresence>
              {filteredMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find more results.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Load More Button */}
        {!loading &&
          filteredMovies.length > 0 &&
          filteredMovies.length === movies.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMovies}
                className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
              >
                Load More Movies
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
