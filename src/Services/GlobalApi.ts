import tmdbApi, {
  fetchTrending,
  fetchByGenre,
  imageBaseUrl,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  searchMulti,
  searchMovies,
  fetchMovieGenres,
  getImageUrl,
  getPosterUrl,
  getBackdropUrl
} from "@/api/tmdb";

// Modern API exports
export {
  fetchTrending,
  fetchByGenre,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  searchMulti,
  searchMovies,
  fetchMovieGenres,
  imageBaseUrl,
  getImageUrl,
  getPosterUrl,
  getBackdropUrl,
};

// Legacy compatibility layer (to be removed in future versions)
export const getTrendingVideos = () => ({
  then: (cb: (data: { data: { results: any[] } }) => void) =>
    Promise.resolve(fetchTrending()).then((results) =>
      cb({ data: { results } }),
    ),
});

export const getMovieByGenreId = (id: number) => ({
  then: (cb: (data: { data: { results: any[] } }) => void) =>
    Promise.resolve(fetchByGenre(id)).then((results) =>
      cb({ data: { results } }),
    ),
});

// Default export for backward compatibility
export default {
  getTrendingVideos,
  getMovieByGenreId,

  // Modern API methods
  ...tmdbApi,
};
