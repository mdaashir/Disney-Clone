import axios from "axios";
import type { 
  Movie, 
  TvShow, 
  MediaItem, 
  MovieDetails, 
  TvShowDetails, 
  ApiResponse,
  Credits,
  VideosResponse,
  Genre 
} from "@/types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY) {
  console.warn(
    "[tmdb] Missing VITE_TMDB_API_KEY environment variable. Requests will fail.",
  );
}

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: API_KEY },
  timeout: 10000,
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("TMDB API Error:", error);
    return Promise.reject(error);
  },
);

export const imageBaseUrl = "https://image.tmdb.org/t/p/original";

// Trending endpoints
export const fetchTrending = async (timeWindow: 'day' | 'week' = 'day'): Promise<MediaItem[]> => {
  const response = await client.get<ApiResponse<MediaItem>>(`/trending/all/${timeWindow}`);
  return response.data.results;
};

export const fetchTrendingMovies = async (timeWindow: 'day' | 'week' = 'day'): Promise<Movie[]> => {
  const response = await client.get<ApiResponse<Movie>>(`/trending/movie/${timeWindow}`);
  return response.data.results;
};

export const fetchTrendingTvShows = async (timeWindow: 'day' | 'week' = 'day'): Promise<TvShow[]> => {
  const response = await client.get<ApiResponse<TvShow>>(`/trending/tv/${timeWindow}`);
  return response.data.results;
};

// Movie endpoints
export const fetchPopularMovies = async (page: number = 1): Promise<ApiResponse<Movie>> => {
  const response = await client.get<ApiResponse<Movie>>("/movie/popular", { params: { page } });
  return response.data;
};

export const fetchTopRatedMovies = async (page: number = 1): Promise<ApiResponse<Movie>> => {
  const response = await client.get<ApiResponse<Movie>>("/movie/top_rated", { params: { page } });
  return response.data;
};

export const fetchUpcomingMovies = async (page: number = 1): Promise<ApiResponse<Movie>> => {
  const response = await client.get<ApiResponse<Movie>>("/movie/upcoming", { params: { page } });
  return response.data;
};

export const fetchNowPlayingMovies = async (page: number = 1): Promise<ApiResponse<Movie>> => {
  const response = await client.get<ApiResponse<Movie>>("/movie/now_playing", { params: { page } });
  return response.data;
};

export const fetchMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await client.get<MovieDetails>(`/movie/${movieId}`);
  return response.data;
};

export const fetchMovieCredits = async (movieId: number): Promise<Credits> => {
  const response = await client.get<Credits>(`/movie/${movieId}/credits`);
  return response.data;
};

export const fetchMovieVideos = async (movieId: number): Promise<VideosResponse> => {
  const response = await client.get<VideosResponse>(`/movie/${movieId}/videos`);
  return response.data;
};

export const fetchSimilarMovies = async (movieId: number): Promise<Movie[]> => {
  const response = await client.get<ApiResponse<Movie>>(`/movie/${movieId}/similar`);
  return response.data.results;
};

export const fetchRecommendedMovies = async (movieId: number): Promise<Movie[]> => {
  const response = await client.get<ApiResponse<Movie>>(`/movie/${movieId}/recommendations`);
  return response.data.results;
};

// TV Show endpoints
export const fetchPopularTvShows = async (page: number = 1): Promise<ApiResponse<TvShow>> => {
  const response = await client.get<ApiResponse<TvShow>>("/tv/popular", { params: { page } });
  return response.data;
};

export const fetchTopRatedTvShows = async (page: number = 1): Promise<ApiResponse<TvShow>> => {
  const response = await client.get<ApiResponse<TvShow>>("/tv/top_rated", { params: { page } });
  return response.data;
};

export const fetchOnTheAirTvShows = async (page: number = 1): Promise<ApiResponse<TvShow>> => {
  const response = await client.get<ApiResponse<TvShow>>("/tv/on_the_air", { params: { page } });
  return response.data;
};

export const fetchAiringTodayTvShows = async (page: number = 1): Promise<ApiResponse<TvShow>> => {
  const response = await client.get<ApiResponse<TvShow>>("/tv/airing_today", { params: { page } });
  return response.data;
};

export const fetchTvShowDetails = async (tvId: number): Promise<TvShowDetails> => {
  const response = await client.get<TvShowDetails>(`/tv/${tvId}`);
  return response.data;
};

export const fetchTvShowCredits = async (tvId: number): Promise<Credits> => {
  const response = await client.get<Credits>(`/tv/${tvId}/credits`);
  return response.data;
};

export const fetchTvShowVideos = async (tvId: number): Promise<VideosResponse> => {
  const response = await client.get<VideosResponse>(`/tv/${tvId}/videos`);
  return response.data;
};

// Genre endpoints
export const fetchMovieGenres = async (): Promise<Genre[]> => {
  const response = await client.get<{ genres: Genre[] }>("/genre/movie/list");
  return response.data.genres;
};

export const fetchTvGenres = async (): Promise<Genre[]> => {
  const response = await client.get<{ genres: Genre[] }>("/genre/tv/list");
  return response.data.genres;
};

export const fetchByGenre = async (genreId: number, page: number = 1): Promise<Movie[]> => {
  const response = await client.get<ApiResponse<Movie>>("/discover/movie", { 
    params: { with_genres: genreId, page } 
  });
  return response.data.results;
};

export const fetchTvByGenre = async (genreId: number, page: number = 1): Promise<TvShow[]> => {
  const response = await client.get<ApiResponse<TvShow>>("/discover/tv", { 
    params: { with_genres: genreId, page } 
  });
  return response.data.results;
};

// Search endpoints
export const searchMulti = async (query: string, page: number = 1): Promise<ApiResponse<MediaItem>> => {
  const response = await client.get<ApiResponse<MediaItem>>("/search/multi", { 
    params: { query, page } 
  });
  return response.data;
};

export const searchMovies = async (query: string, page: number = 1): Promise<ApiResponse<Movie>> => {
  const response = await client.get<ApiResponse<Movie>>("/search/movie", { 
    params: { query, page } 
  });
  return response.data;
};

export const searchTvShows = async (query: string, page: number = 1): Promise<ApiResponse<TvShow>> => {
  const response = await client.get<ApiResponse<TvShow>>("/search/tv", { 
    params: { query, page } 
  });
  return response.data;
};

// Configuration endpoints
export const fetchConfiguration = async () => {
  const response = await client.get("/configuration");
  return response.data;
};

// Utility functions
export const getImageUrl = (path: string | null, size: string = "w500"): string => {
  if (!path) return "/placeholder-movie.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: string = "w1280"): string => {
  if (!path) return "/placeholder-backdrop.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getPosterUrl = (path: string | null, size: string = "w500"): string => {
  if (!path) return "/placeholder-poster.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getProfileUrl = (path: string | null, size: string = "w185"): string => {
  if (!path) return "/placeholder-profile.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default {
  // Trending
  fetchTrending,
  fetchTrendingMovies,
  fetchTrendingTvShows,
  
  // Movies
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  fetchSimilarMovies,
  fetchRecommendedMovies,
  
  // TV Shows
  fetchPopularTvShows,
  fetchTopRatedTvShows,
  fetchOnTheAirTvShows,
  fetchAiringTodayTvShows,
  fetchTvShowDetails,
  fetchTvShowCredits,
  fetchTvShowVideos,
  
  // Genres
  fetchMovieGenres,
  fetchTvGenres,
  fetchByGenre,
  fetchTvByGenre,
  
  // Search
  searchMulti,
  searchMovies,
  searchTvShows,
  
  // Configuration
  fetchConfiguration,
  
  // Utilities
  imageBaseUrl,
  getImageUrl,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
};
