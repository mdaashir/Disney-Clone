import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { Movie, WatchlistState, WatchlistContextType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

/* eslint-disable react-refresh/only-export-components */

// Watchlist reducer
type WatchlistAction =
  | { type: "SET_WATCHLIST"; payload: Movie[] }
  | { type: "SET_FAVORITES"; payload: Movie[] }
  | { type: "ADD_TO_WATCHLIST"; payload: Movie }
  | { type: "REMOVE_FROM_WATCHLIST"; payload: number }
  | { type: "ADD_TO_FAVORITES"; payload: Movie }
  | { type: "REMOVE_FROM_FAVORITES"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_WATCHLIST" }
  | { type: "CLEAR_FAVORITES" };

const initialState: WatchlistState = {
  watchlist: [],
  favorites: [],
  isLoading: false,
};

function watchlistReducer(
  state: WatchlistState,
  action: WatchlistAction,
): WatchlistState {
  switch (action.type) {
    case "SET_WATCHLIST":
      return { ...state, watchlist: action.payload };
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };
    case "ADD_TO_WATCHLIST": {
      const newWatchlist = [...state.watchlist];
      const existingIndex = newWatchlist.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (existingIndex === -1) {
        newWatchlist.push(action.payload);
      }
      return { ...state, watchlist: newWatchlist };
    }
    case "REMOVE_FROM_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.filter(
          (item: Movie) => item.id !== action.payload,
        ),
      };
    case "ADD_TO_FAVORITES": {
      const newFavorites = [...state.favorites];
      const existingFavIndex = newFavorites.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (existingFavIndex === -1) {
        newFavorites.push(action.payload);
      }
      return { ...state, favorites: newFavorites };
    }
    case "REMOVE_FROM_FAVORITES":
      return {
        ...state,
        favorites: state.favorites.filter(
          (item: Movie) => item.id !== action.payload,
        ),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "CLEAR_WATCHLIST":
      return { ...state, watchlist: [] };
    case "CLEAR_FAVORITES":
      return { ...state, favorites: [] };
    default:
      return state;
  }
}

// Create context
const WatchlistContext = createContext<WatchlistContextType | null>(null);

// Provider component
export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(watchlistReducer, initialState);
  const { user } = useAuth();

  // Load user's watchlist and favorites from localStorage
  const loadUserData = useCallback(() => {
    if (!user) {
      dispatch({ type: "CLEAR_WATCHLIST" });
      dispatch({ type: "CLEAR_FAVORITES" });
      return;
    }

    const watchlistKey = `watchlist_${user.id}`;
    const favoritesKey = `favorites_${user.id}`;

    const savedWatchlist = localStorage.getItem(watchlistKey);
    const savedFavorites = localStorage.getItem(favoritesKey);

    if (savedWatchlist) {
      try {
        const watchlist = JSON.parse(savedWatchlist);
        dispatch({ type: "SET_WATCHLIST", payload: watchlist });
      } catch (error) {
        console.error("Error loading watchlist:", error);
      }
    }

    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        dispatch({ type: "SET_FAVORITES", payload: favorites });
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    }
  }, [user]);

  // Save to localStorage
  const saveToStorage = useCallback(
    (key: string, data: Movie[]) => {
      if (!user) return;

      try {
        localStorage.setItem(`${key}_${user.id}`, JSON.stringify(data));
      } catch (error) {
        console.error("Error saving to storage:", error);
      }
    },
    [user],
  );

  // Watchlist operations
  const addToWatchlist = useCallback(
    (movie: Movie) => {
      if (!user) {
        toast.error("Please sign in to add movies to your watchlist");
        return;
      }

      const isAlreadyInWatchlist = state.watchlist.some(
        (item: Movie) => item.id === movie.id,
      );
      if (isAlreadyInWatchlist) {
        toast("Movie is already in your watchlist");
        return;
      }

      dispatch({ type: "ADD_TO_WATCHLIST", payload: movie });
      const updatedWatchlist = [...state.watchlist, movie];
      saveToStorage("watchlist", updatedWatchlist);
      toast.success(`Added "${movie.title}" to watchlist`);
    },
    [user, state.watchlist, saveToStorage],
  );

  const removeFromWatchlist = useCallback(
    (movieId: number) => {
      if (!user) return;

      const movie = state.watchlist.find((item: Movie) => item.id === movieId);
      dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: movieId });
      const updatedWatchlist = state.watchlist.filter(
        (item: Movie) => item.id !== movieId,
      );
      saveToStorage("watchlist", updatedWatchlist);

      if (movie) {
        toast.success(`Removed "${movie.title}" from watchlist`);
      }
    },
    [user, state.watchlist, saveToStorage],
  );

  const toggleWatchlist = useCallback(
    (movie: Movie) => {
      const isInWatchlist = state.watchlist.some(
        (item: Movie) => item.id === movie.id,
      );
      if (isInWatchlist) {
        removeFromWatchlist(movie.id);
      } else {
        addToWatchlist(movie);
      }
    },
    [state.watchlist, addToWatchlist, removeFromWatchlist],
  );

  // Favorites operations
  const addToFavorites = useCallback(
    (movie: Movie) => {
      if (!user) {
        toast.error("Please sign in to add movies to your favorites");
        return;
      }

      const isAlreadyInFavorites = state.favorites.some(
        (item: Movie) => item.id === movie.id,
      );
      if (isAlreadyInFavorites) {
        toast("Movie is already in your favorites");
        return;
      }

      dispatch({ type: "ADD_TO_FAVORITES", payload: movie });
      const updatedFavorites = [...state.favorites, movie];
      saveToStorage("favorites", updatedFavorites);
      toast.success(`Added "${movie.title}" to favorites`);
    },
    [user, state.favorites, saveToStorage],
  );

  const removeFromFavorites = useCallback(
    (movieId: number) => {
      if (!user) return;

      const movie = state.favorites.find((item: Movie) => item.id === movieId);
      dispatch({ type: "REMOVE_FROM_FAVORITES", payload: movieId });
      const updatedFavorites = state.favorites.filter(
        (item: Movie) => item.id !== movieId,
      );
      saveToStorage("favorites", updatedFavorites);

      if (movie) {
        toast.success(`Removed "${movie.title}" from favorites`);
      }
    },
    [user, state.favorites, saveToStorage],
  );

  const toggleFavorites = useCallback(
    (movie: Movie) => {
      const isInFavorites = state.favorites.some(
        (item: Movie) => item.id === movie.id,
      );
      if (isInFavorites) {
        removeFromFavorites(movie.id);
      } else {
        addToFavorites(movie);
      }
    },
    [state.favorites, addToFavorites, removeFromFavorites],
  );

  // Check if movie is in lists
  const isInWatchlist = useCallback(
    (movieId: number) => {
      return state.watchlist.some((item: Movie) => item.id === movieId);
    },
    [state.watchlist],
  );

  const isInFavorites = useCallback(
    (movieId: number) => {
      return state.favorites.some((item: Movie) => item.id === movieId);
    },
    [state.favorites],
  );

  // Clear operations
  const clearWatchlist = useCallback(() => {
    if (!user) return;

    dispatch({ type: "CLEAR_WATCHLIST" });
    saveToStorage("watchlist", []);
    toast.success("Watchlist cleared");
  }, [user, saveToStorage]);

  const clearFavorites = useCallback(() => {
    if (!user) return;

    dispatch({ type: "CLEAR_FAVORITES" });
    saveToStorage("favorites", []);
    toast.success("Favorites cleared");
  }, [user, saveToStorage]);

  // Load data when user changes
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Context value
  const contextValue: WatchlistContextType = {
    ...state,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    addToFavorites,
    removeFromFavorites,
    toggleFavorites,
    isInWatchlist,
    isInFavorites,
    clearWatchlist,
    clearFavorites,
  };

  return (
    <WatchlistContext.Provider value={contextValue}>
      {children}
    </WatchlistContext.Provider>
  );
}

// Hook to use watchlist context
export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}

export default WatchlistContext;
