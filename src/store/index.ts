import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Theme, SearchFilters } from '@/types';

interface AppStore {
  // Theme state
  theme: Theme['mode'];
  setTheme: (theme: Theme['mode']) => void;

  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearch: () => void;

  // Watchlist state
  watchlist: number[];
  addToWatchlist: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;

  // Favorites state
  favorites: number[];
  addToFavorites: (movieId: number) => void;
  removeFromFavorites: (movieId: number) => void;
  isInFavorites: (movieId: number) => boolean;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Modal state
  selectedMovie: number | null;
  setSelectedMovie: (movieId: number | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // User
      user: null,
      setUser: (user) => set({ user }),

      // Search
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      searchFilters: {
        mediaType: 'all',
      },
      setSearchFilters: (filters) => set((state) => ({
        searchFilters: { ...state.searchFilters, ...filters }
      })),
      clearSearch: () => set({
        searchQuery: '',
        searchFilters: { mediaType: 'all' }
      }),

      // Watchlist
      watchlist: [],
      addToWatchlist: (movieId) => set((state) => ({
        watchlist: state.watchlist.includes(movieId)
          ? state.watchlist
          : [...state.watchlist, movieId]
      })),
      removeFromWatchlist: (movieId) => set((state) => ({
        watchlist: state.watchlist.filter(id => id !== movieId)
      })),
      isInWatchlist: (movieId) => get().watchlist.includes(movieId),

      // Favorites
      favorites: [],
      addToFavorites: (movieId) => set((state) => ({
        favorites: state.favorites.includes(movieId)
          ? state.favorites
          : [...state.favorites, movieId]
      })),
      removeFromFavorites: (movieId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== movieId)
      })),
      isInFavorites: (movieId) => get().favorites.includes(movieId),

      // UI
      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      // Modal
      selectedMovie: null,
      setSelectedMovie: (selectedMovie) => set({ selectedMovie }),
    }),
    {
      name: 'disney-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        watchlist: state.watchlist,
        favorites: state.favorites,
      }),
    }
  )
);

// Selectors for better performance - using shallow equality
export const useUser = () => useAppStore((state) => state.user);
export const useWatchlist = () => useAppStore((state) => state.watchlist);
export const useFavorites = () => useAppStore((state) => state.favorites);
export const useSearchQuery = () => useAppStore((state) => state.searchQuery);
export const useSearchFilters = () => useAppStore((state) => state.searchFilters);

// Action selectors (these are stable references)
export const useThemeActions = () => useAppStore((state) => state.setTheme);
export const useSearchActions = () => ({
  setSearchQuery: useAppStore.getState().setSearchQuery,
  setSearchFilters: useAppStore.getState().setSearchFilters,
  clearSearch: useAppStore.getState().clearSearch,
});
export const useWatchlistActions = () => ({
  addToWatchlist: useAppStore.getState().addToWatchlist,
  removeFromWatchlist: useAppStore.getState().removeFromWatchlist,
  isInWatchlist: useAppStore.getState().isInWatchlist,
});
export const useFavoritesActions = () => ({
  addToFavorites: useAppStore.getState().addToFavorites,
  removeFromFavorites: useAppStore.getState().removeFromFavorites,
  isInFavorites: useAppStore.getState().isInFavorites,
});
