import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
if (!API_KEY) {
	// eslint-disable-next-line no-console
	console.warn('TMDB API key missing. Set VITE_TMDB_API_KEY in your .env file.');
}

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const tmdbClient = axios.create({
	baseURL: 'https://api.themoviedb.org/3',
	params: { api_key: API_KEY },
	timeout: 10000,
});

tmdbClient.interceptors.response.use(
	(r) => r,
	(err) => {
		if (err.response) {
			// eslint-disable-next-line no-console
			console.error('TMDB error', err.response.status, err.response.data);
		} else {
			// eslint-disable-next-line no-console
			console.error('Network or CORS error contacting TMDB');
		}
		return Promise.reject(err);
	}
);

export const fetchTrending = () => tmdbClient.get('/trending/all/day').then(r => r.data.results);
export const fetchByGenre = (genreId) => tmdbClient.get('/discover/movie', { params: { with_genres: genreId } }).then(r => r.data.results);

export default {
	fetchTrending,
	fetchByGenre,
	IMAGE_BASE_URL,
};
