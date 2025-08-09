import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  Calendar,
  Star,
  Clock,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface FilterOptions {
  genres: number[];
  releaseYear: {
    min: number;
    max: number;
  };
  rating: {
    min: number;
    max: number;
  };
  runtime: {
    min: number;
    max: number;
  };
  sortBy: "popularity" | "release_date" | "vote_average" | "title";
  sortOrder: "asc" | "desc";
  viewMode: "grid" | "list";
}

export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  // eslint-disable-next-line no-unused-vars
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "release_date", label: "Release Date" },
  { value: "vote_average", label: "Rating" },
  { value: "title", label: "Title" },
];

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset,
}: FilterPanelProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleGenre = (genreId: number) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId];
    updateFilters({ genres: newGenres });
  };

  const hasActiveFilters = () => {
    return (
      filters.genres.length > 0 ||
      filters.releaseYear.min > 1900 ||
      filters.releaseYear.max < new Date().getFullYear() ||
      filters.rating.min > 0 ||
      filters.rating.max < 10 ||
      filters.runtime.min > 0 ||
      filters.runtime.max < 300
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 bottom-0 w-80 bg-background border-l shadow-lg z-50 overflow-y-auto"
        >
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters & Sort
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {hasActiveFilters() && (
              <button
                onClick={onReset}
                className="mt-2 text-sm text-muted-foreground hover:text-foreground underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          <div className="p-4 space-y-6">
            {/* View Mode */}
            <div>
              <h3 className="font-medium mb-3">View Mode</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => updateFilters({ viewMode: "grid" })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-colors",
                    filters.viewMode === "grid"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted",
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                  Grid
                </button>
                <button
                  onClick={() => updateFilters({ viewMode: "list" })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-colors",
                    filters.viewMode === "list"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted",
                  )}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="font-medium mb-3">Sort By</h3>
              <div className="space-y-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    updateFilters({ sortBy: e.target.value as any })
                  }
                  className="w-full p-2 rounded-lg border bg-background"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateFilters({ sortOrder: "desc" })}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-colors",
                      filters.sortOrder === "desc"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted",
                    )}
                  >
                    <SortDesc className="h-4 w-4" />
                    Desc
                  </button>
                  <button
                    onClick={() => updateFilters({ sortOrder: "asc" })}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-colors",
                      filters.sortOrder === "asc"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted",
                    )}
                  >
                    <SortAsc className="h-4 w-4" />
                    Asc
                  </button>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div>
              <button
                onClick={() =>
                  setActiveSection(activeSection === "genres" ? "" : "genres")
                }
                className="w-full flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <h3 className="font-medium">Genres</h3>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    activeSection === "genres" && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {activeSection === "genres" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {genres.map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() => toggleGenre(genre.id)}
                          className={cn(
                            "p-2 text-sm rounded-lg border transition-colors text-left",
                            filters.genres.includes(genre.id)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-muted",
                          )}
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Release Year */}
            <div>
              <button
                onClick={() =>
                  setActiveSection(activeSection === "year" ? "" : "year")
                }
                className="w-full flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <h3 className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Release Year
                </h3>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    activeSection === "year" && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {activeSection === "year" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          From
                        </label>
                        <input
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={filters.releaseYear.min}
                          onChange={(e) =>
                            updateFilters({
                              releaseYear: {
                                ...filters.releaseYear,
                                min: parseInt(e.target.value) || 1900,
                              },
                            })
                          }
                          className="w-full p-2 rounded-lg border bg-background mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          To
                        </label>
                        <input
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={filters.releaseYear.max}
                          onChange={(e) =>
                            updateFilters({
                              releaseYear: {
                                ...filters.releaseYear,
                                max:
                                  parseInt(e.target.value) ||
                                  new Date().getFullYear(),
                              },
                            })
                          }
                          className="w-full p-2 rounded-lg border bg-background mt-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rating */}
            <div>
              <button
                onClick={() =>
                  setActiveSection(activeSection === "rating" ? "" : "rating")
                }
                className="w-full flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <h3 className="font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Rating
                </h3>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    activeSection === "rating" && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {activeSection === "rating" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Minimum
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={filters.rating.min}
                          onChange={(e) =>
                            updateFilters({
                              rating: {
                                ...filters.rating,
                                min: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="w-full mt-1"
                        />
                        <div className="text-sm text-center">
                          {filters.rating.min.toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Maximum
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={filters.rating.max}
                          onChange={(e) =>
                            updateFilters({
                              rating: {
                                ...filters.rating,
                                max: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="w-full mt-1"
                        />
                        <div className="text-sm text-center">
                          {filters.rating.max.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Runtime */}
            <div>
              <button
                onClick={() =>
                  setActiveSection(activeSection === "runtime" ? "" : "runtime")
                }
                className="w-full flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <h3 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Runtime (minutes)
                </h3>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    activeSection === "runtime" && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {activeSection === "runtime" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Minimum
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="300"
                          step="10"
                          value={filters.runtime.min}
                          onChange={(e) =>
                            updateFilters({
                              runtime: {
                                ...filters.runtime,
                                min: parseInt(e.target.value),
                              },
                            })
                          }
                          className="w-full mt-1"
                        />
                        <div className="text-sm text-center">
                          {filters.runtime.min} min
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Maximum
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="300"
                          step="10"
                          value={filters.runtime.max}
                          onChange={(e) =>
                            updateFilters({
                              runtime: {
                                ...filters.runtime,
                                max: parseInt(e.target.value),
                              },
                            })
                          }
                          className="w-full mt-1"
                        />
                        <div className="text-sm text-center">
                          {filters.runtime.max} min
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Filter Button Component
export function FilterButton({
  onClick,
  hasActiveFilters,
}: {
  onClick: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
        hasActiveFilters
          ? "bg-primary text-primary-foreground border-primary"
          : "hover:bg-muted",
      )}
    >
      <Filter className="h-4 w-4" />
      Filters
      {hasActiveFilters && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
}
