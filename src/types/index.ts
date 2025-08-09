export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  video: boolean;
}

export interface TvShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  adult: boolean;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: Genre[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  revenue: number;
  runtime: number | null;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string | null;
}

export interface TvShowDetails extends TvShow {
  created_by: Array<{
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }>;
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  } | null;
  networks: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }>;
  status: string;
  tagline: string;
  type: string;
}

export interface MediaItem {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  media_type: "movie" | "tv" | "person";

  // Movie-specific properties (optional for TV shows)
  title?: string;
  original_title?: string;
  release_date?: string;
  video?: boolean;

  // TV show-specific properties (optional for movies)
  name?: string;
  original_name?: string;
  first_air_date?: string;
  origin_country?: string[];
}

export interface Cast {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchResponse<T> extends ApiResponse<T> {}

export interface TrendingResponse<T> extends ApiResponse<T> {
  dates?: {
    maximum: string;
    minimum: string;
  };
}

export interface ErrorResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
  sessionToken?: string;
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    notifications: boolean;
    autoplay: boolean;
    subtitles: boolean;
    quality: "auto" | "hd" | "sd";
  };
  watchlist: number[];
  favorites: number[];
  watchHistory: WatchHistoryItem[];
  continueWatching: ContinueWatchingItem[];
}

export interface WatchHistoryItem {
  id: number;
  mediaType: "movie" | "tv";
  watchedAt: string;
  title: string;
  poster_path: string;
}

export interface ContinueWatchingItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  poster_path: string;
  progress: number; // 0-100 percentage
  duration: number; // total duration in minutes
  watchedDuration: number; // watched duration in minutes
  lastWatchedAt: string;
  episodeNumber?: number; // for TV shows
  seasonNumber?: number; // for TV shows
}

export interface AuthContextType {
  user: User | null;
  // eslint-disable-next-line no-unused-vars
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    // eslint-disable-next-line no-unused-vars
    email: string,
    // eslint-disable-next-line no-unused-vars
    password: string,
    // eslint-disable-next-line no-unused-vars
    name: string,
  ) => Promise<boolean>;
  logout: () => void;
  // eslint-disable-next-line no-unused-vars
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  quality: "auto" | "hd" | "sd";
  subtitles: boolean;
  playbackRate: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  rating: number; // 1-5 stars
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface SearchSuggestion {
  id: number;
  title: string;
  mediaType: "movie" | "tv" | "person";
  year?: string;
  poster_path?: string;
  overview?: string;
}

export interface SearchState {
  query: string;
  results: Movie[];
  suggestions: SearchSuggestion[];
  history: string[];
  isLoading: boolean;
  filters: {
    genre: string;
    year: string;
    rating: string;
    sortBy: "popularity" | "rating" | "release_date" | "alphabetical";
  };
}

export interface SearchContextType extends SearchState {
  // eslint-disable-next-line no-unused-vars
  searchMovies: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  getSuggestions: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  setFilters: (filters: Partial<SearchState["filters"]>) => void;
  clearHistory: () => void;
  clearSearch: () => void;
}

export interface WatchlistState {
  watchlist: Movie[];
  favorites: Movie[];
  isLoading: boolean;
}

export interface WatchlistContextType extends WatchlistState {
  // eslint-disable-next-line no-unused-vars
  addToWatchlist: (movie: Movie) => void;
  // eslint-disable-next-line no-unused-vars
  removeFromWatchlist: (movieId: number) => void;
  // eslint-disable-next-line no-unused-vars
  toggleWatchlist: (movie: Movie) => void;
  // eslint-disable-next-line no-unused-vars
  addToFavorites: (movie: Movie) => void;
  // eslint-disable-next-line no-unused-vars
  removeFromFavorites: (movieId: number) => void;
  // eslint-disable-next-line no-unused-vars
  toggleFavorites: (movie: Movie) => void;
  // eslint-disable-next-line no-unused-vars
  isInWatchlist: (movieId: number) => boolean;
  // eslint-disable-next-line no-unused-vars
  isInFavorites: (movieId: number) => boolean;
  clearWatchlist: () => void;
  clearFavorites: () => void;
}

export interface NotificationItem {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Theme {
  mode: "light" | "dark" | "system";
}

export interface AppState {
  user: User | null;
  theme: Theme;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

export type MediaType = "movie" | "tv" | "all";
export type TimeWindow = "day" | "week";
export type SortBy =
  | "popularity.desc"
  | "release_date.desc"
  | "vote_average.desc"
  | "title.asc";

export interface SearchFilters {
  mediaType: MediaType;
  genre?: number;
  year?: number;
  sortBy?: SortBy;
  minRating?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
