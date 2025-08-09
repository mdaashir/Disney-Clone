import { createContext, useContext, useReducer, useCallback } from "react";
import {
  SearchSuggestion,
  Movie,
  SearchState,
  SearchContextType,
} from "@/types";
import GlobalApi from "@/Services/GlobalApi";
import toast from "react-hot-toast";

/* eslint-disable react-refresh/only-export-components */

// Search reducer
type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_RESULTS"; payload: Movie[] }
  | { type: "SET_SUGGESTIONS"; payload: SearchSuggestion[] }
  | { type: "ADD_TO_HISTORY"; payload: string }
  | { type: "CLEAR_HISTORY" }
  | { type: "SET_FILTERS"; payload: Partial<SearchState["filters"]> }
  | { type: "CLEAR_SEARCH" };

const initialState: SearchState = {
  query: "",
  results: [],
  suggestions: [],
  history: JSON.parse(localStorage.getItem("searchHistory") || "[]"),
  isLoading: false,
  filters: {
    genre: "",
    year: "",
    rating: "",
    sortBy: "popularity",
  },
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_RESULTS":
      return { ...state, results: action.payload, isLoading: false };
    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.payload };
    case "ADD_TO_HISTORY": {
      const newHistory = [
        action.payload,
        ...state.history.filter((h: string) => h !== action.payload),
      ].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      return { ...state, history: newHistory };
    }
    case "CLEAR_HISTORY":
      localStorage.removeItem("searchHistory");
      return { ...state, history: [] };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "CLEAR_SEARCH":
      return { ...state, query: "", results: [], suggestions: [] };
    default:
      return state;
  }
}

// Create context
const SearchContext = createContext<SearchContextType | null>(null);

// Provider component
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Debounced search function
  const searchMovies = useCallback(
    async (query: string, filters?: SearchState["filters"]) => {
      if (!query.trim()) {
        dispatch({ type: "CLEAR_SEARCH" });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });

      try {
        // Search for movies
        const searchResults = await GlobalApi.searchMovies(query);
        let results = searchResults.results || [];

        // Apply filters
        if (filters) {
          if (filters.genre) {
            results = results.filter((movie) =>
              movie.genre_ids?.includes(parseInt(filters.genre)),
            );
          }

          if (filters.year) {
            results = results.filter((movie) =>
              movie.release_date?.startsWith(filters.year),
            );
          }

          if (filters.rating) {
            const minRating = parseFloat(filters.rating);
            results = results.filter(
              (movie) => movie.vote_average >= minRating,
            );
          }

          // Sort results
          switch (filters.sortBy) {
            case "popularity":
              results.sort((a, b) => b.popularity - a.popularity);
              break;
            case "rating":
              results.sort((a, b) => b.vote_average - a.vote_average);
              break;
            case "release_date":
              results.sort(
                (a, b) =>
                  new Date(b.release_date || "").getTime() -
                  new Date(a.release_date || "").getTime(),
              );
              break;
            case "alphabetical":
              results.sort((a, b) => a.title.localeCompare(b.title));
              break;
          }
        }

        dispatch({ type: "SET_RESULTS", payload: results });

        // Add to search history if it's a real search
        if (query.length > 2) {
          dispatch({ type: "ADD_TO_HISTORY", payload: query });
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Search failed. Please try again.");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [],
  );

  // Get search suggestions
  const getSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      dispatch({ type: "SET_SUGGESTIONS", payload: [] });
      return;
    }

    try {
      const searchResults = await GlobalApi.searchMovies(query);
      const suggestions: SearchSuggestion[] = (searchResults.results || [])
        .slice(0, 5)
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          mediaType: "movie" as const,
          year: movie.release_date?.split("-")[0],
          poster_path: movie.poster_path || undefined,
          overview: movie.overview || undefined,
        }));

      dispatch({ type: "SET_SUGGESTIONS", payload: suggestions });
    } catch (error) {
      console.error("Suggestions error:", error);
    }
  }, []);

  // Context value
  const contextValue: SearchContextType = {
    ...state,
    searchMovies: (query: string) => searchMovies(query, state.filters),
    getSuggestions,
    setQuery: (query: string) =>
      dispatch({ type: "SET_QUERY", payload: query }),
    setFilters: (filters: Partial<SearchState["filters"]>) =>
      dispatch({ type: "SET_FILTERS", payload: filters }),
    clearHistory: () => dispatch({ type: "CLEAR_HISTORY" }),
    clearSearch: () => dispatch({ type: "CLEAR_SEARCH" }),
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

// Hook to use search context
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

export default SearchContext;
