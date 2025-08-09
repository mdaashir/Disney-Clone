import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
if (!API_KEY) {
  // Provide a clear runtime warning (won't break build unless you choose to throw)
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
    // Could add centralized error logging here
    return Promise.reject(error);
  },
);

export const imageBaseUrl = "https://image.tmdb.org/t/p/original";

export const fetchTrending = () =>
  client.get("/trending/all/day").then((r) => r.data.results);
export const fetchByGenre = (genreId) =>
  client
    .get("/discover/movie", { params: { with_genres: genreId } })
    .then((r) => r.data.results);

export default {
  fetchTrending,
  fetchByGenre,
  imageBaseUrl,
};
