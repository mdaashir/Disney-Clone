import { fetchTrending, fetchByGenre, imageBaseUrl } from "../api/tmdb";

// Backwards compatibility shim (to be removed)
export const getTrendingVideos = () => ({
  then: (cb) =>
    Promise.resolve(fetchTrending()).then((results) =>
      cb({ data: { results } }),
    ),
});
export const getMovieByGenreId = (id) => ({
  then: (cb) =>
    Promise.resolve(fetchByGenre(id)).then((results) =>
      cb({ data: { results } }),
    ),
});

export default {
  getTrendingVideos,
  getMovieByGenreId,
  imageBaseUrl,
};
