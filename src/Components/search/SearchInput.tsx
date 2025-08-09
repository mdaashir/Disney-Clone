import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, Trash2 } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";
import { imageBaseUrl } from "@/Services/GlobalApi";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  showSuggestions?: boolean;
}

export default function SearchInput({
  className,
  placeholder = "Search movies, shows...",
  onFocus,
  onBlur,
  showSuggestions = true,
}: SearchInputProps) {
  const {
    query,
    suggestions,
    history,
    isLoading,
    setQuery,
    getSuggestions,
    searchMovies,
    clearHistory,
  } = useSearch();

  const [isFocused, setIsFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle input changes with debouncing
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setQuery(localQuery);
      if (localQuery.trim().length > 1 && showSuggestions) {
        getSuggestions(localQuery.trim());
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localQuery, setQuery, getSuggestions, showSuggestions]);

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        onBlur?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      searchMovies(searchQuery.trim());
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: (typeof suggestions)[0]) => {
    setLocalQuery(suggestion.title);
    handleSearch(suggestion.title);
  };

  const handleHistoryClick = (historyItem: string) => {
    setLocalQuery(historyItem);
    handleSearch(historyItem);
  };

  const showDropdown =
    isFocused &&
    showSuggestions &&
    (suggestions.length > 0 || history.length > 0 || localQuery.length > 0);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(localQuery);
            }
            if (e.key === "Escape") {
              setIsFocused(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border bg-background/50 backdrop-blur-sm pl-10 pr-10 py-2.5",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "transition-all duration-200",
            isFocused && "bg-background/80 shadow-lg",
          )}
        />

        {/* Clear button */}
        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery("");
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-auto rounded-lg border bg-background/95 backdrop-blur-sm shadow-xl"
          >
            {/* Search History */}
            {history.length > 0 && localQuery.length === 0 && (
              <div className="p-3 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Recent Searches
                  </h4>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  {history.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="flex items-center w-full px-2 py-1.5 text-sm text-left hover:bg-accent rounded transition-colors"
                    >
                      <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Suggestions
                </h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center w-full p-2 text-left hover:bg-accent rounded transition-colors group"
                    >
                      {suggestion.poster_path ? (
                        <img
                          src={`${imageBaseUrl}/w92${suggestion.poster_path}`}
                          alt={suggestion.title}
                          className="w-8 h-12 object-cover rounded mr-3 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-12 bg-muted rounded mr-3 flex-shrink-0 flex items-center justify-center">
                          <Search className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {suggestion.title}
                        </p>
                        {suggestion.year && (
                          <p className="text-xs text-muted-foreground">
                            {suggestion.year}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {localQuery.length > 2 &&
              suggestions.length === 0 &&
              !isLoading && (
                <div className="p-6 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No suggestions found</p>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
