import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const movieBaseUrl = 'https://api.themoviedb.org/3';
export const imageBaseUrl = 'https://image.tmdb.org/t/p/original';

// Axios instance for TMDB
const apiClient = axios.create({
	baseURL: movieBaseUrl,
	params: {
		api_key: API_KEY,
	},
});

apiClient.interceptors.response.use(
	(res) => res,
	(err) => {
		// You can enhance logging here
		return Promise.reject(err);
	}
);

export const getTrendingVideos = () => apiClient.get('/trending/all/day');
export const getMovieByGenreId = (id) =>
	apiClient.get('/discover/movie', { params: { with_genres: id } });

export default {
	getTrendingVideos,
	getMovieByGenreId,
	imageBaseUrl,
};
