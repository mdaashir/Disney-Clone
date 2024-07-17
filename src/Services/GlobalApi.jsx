import axios from 'axios';

const movieBaseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
const api_key = '21453a69eabf45f0a56b51202e353808';
const trendingVideosBaseUrl =
	movieBaseUrl + '/trending/all/day?api_key=' + api_key;
const movieByGenreBaseUrl = movieBaseUrl + '/discover/movie?api_key=' + api_key;
const getTrendingVideos = axios.get(trendingVideosBaseUrl);
const getMovieByGenreId = (id) =>
	axios.get(movieByGenreBaseUrl + '&with_genres=' + id);

export default {
	getTrendingVideos,
	getMovieByGenreId,
	imageBaseUrl,
};
